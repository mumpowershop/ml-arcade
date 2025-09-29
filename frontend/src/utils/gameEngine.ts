// ML ARCADE Game Engine
// Manages game state, progression, scoring, and arcade mechanics

import { Question, QUESTION_DATABASE, getRandomQuestions, calculateScore, getNextLevel, LEVEL_REQUIREMENTS } from '../data/questionDatabase';
import { arcadeAudio } from './arcadeSounds';

export interface GameState {
  currentLevel: number;
  totalScore: number;
  lives: number;
  currentQuestionIndex: number;
  questions: Question[];
  answers: (string | number | null)[];
  timeRemaining: number;
  gameStatus: 'menu' | 'playing' | 'paused' | 'game_over' | 'level_complete' | 'victory';
  streak: number; // Consecutive correct answers
  powerUps: PowerUp[];
  achievements: Achievement[];
  startTime?: number;
  endTime?: number;
}

export interface PowerUp {
  id: string;
  type: 'time_boost' | 'skip_question' | 'eliminate_two' | 'double_points';
  name: string;
  description: string;
  icon: string;
  uses: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
  points: number;
}

export interface GameStats {
  totalGamesPlayed: number;
  highestLevel: number;
  totalScore: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  averageAccuracy: number;
  fastestCompletion: number;
  longestStreak: number;
  achievements: Achievement[];
}

class MLArcadeGameEngine {
  private gameState: GameState;
  private gameTimer: number | null = null;
  private callbacks: { [key: string]: Function[] } = {};

  constructor() {
    this.gameState = this.getInitialGameState();
  }

  private getInitialGameState(): GameState {
    return {
      currentLevel: 1,
      totalScore: 0,
      lives: 3,
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      timeRemaining: 0,
      gameStatus: 'menu',
      streak: 0,
      powerUps: this.getInitialPowerUps(),
      achievements: [],
      startTime: undefined,
      endTime: undefined
    };
  }

  private getInitialPowerUps(): PowerUp[] {
    return [
      {
        id: 'time_boost',
        type: 'time_boost',
        name: 'NEURAL ACCELERATOR',
        description: 'Adds 30 seconds to current question timer',
        icon: '⚡',
        uses: 2
      },
      {
        id: 'skip_question',
        type: 'skip_question',
        name: 'QUANTUM BYPASS',
        description: 'Skip current question without penalty',
        icon: '🚀',
        uses: 1
      },
      {
        id: 'eliminate_two',
        type: 'eliminate_two',
        name: 'NEURAL FILTER',
        description: 'Eliminate 2 wrong answers (multiple choice only)',
        icon: '🎯',
        uses: 2
      },
      {
        id: 'double_points',
        type: 'double_points',
        name: 'SCORE AMPLIFIER',
        description: 'Double points for next correct answer',
        icon: '💎',
        uses: 1
      }
    ];
  }

  // Event system for UI updates
  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data?: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  // Game initialization
  startGame(level: number = 1) {
    this.gameState = this.getInitialGameState();
    this.gameState.currentLevel = level;
    this.gameState.startTime = Date.now();
    
    this.loadLevelQuestions(level);
    this.gameState.gameStatus = 'playing';
    
    arcadeAudio.playLevelUp();
    this.emit('gameStarted', this.gameState);
    this.startQuestionTimer();
  }

  private loadLevelQuestions(level: number) {
    const levelConfig = LEVEL_REQUIREMENTS[level as keyof typeof LEVEL_REQUIREMENTS];
    const questionsCount = levelConfig.questionsCount;
    
    // Get questions appropriate for the level
    let questionPool: Question[] = [];
    
    if (level <= 3) {
      questionPool = QUESTION_DATABASE.filter(q => q.level <= 3);
    } else if (level <= 6) {
      questionPool = QUESTION_DATABASE.filter(q => q.level >= 3 && q.level <= 6);
    } else {
      questionPool = QUESTION_DATABASE.filter(q => q.level >= 6);
    }
    
    this.gameState.questions = getRandomQuestions(questionsCount);
    this.gameState.answers = new Array(questionsCount).fill(null);
    this.gameState.currentQuestionIndex = 0;
    
    if (this.gameState.questions.length > 0) {
      this.gameState.timeRemaining = this.gameState.questions[0].time_limit;
    }
  }

  // Question management
  getCurrentQuestion(): Question | null {
    const { questions, currentQuestionIndex } = this.gameState;
    return questions[currentQuestionIndex] || null;
  }

  answerQuestion(answer: string | number) {
    if (this.gameState.gameStatus !== 'playing') return;

    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return;

    this.stopQuestionTimer();
    
    // Record answer
    this.gameState.answers[this.gameState.currentQuestionIndex] = answer;
    
    const isCorrect = answer === currentQuestion.correct_answer;
    
    if (isCorrect) {
      // Correct answer
      arcadeAudio.playSuccess();
      this.gameState.streak++;
      
      let points = currentQuestion.points;
      
      // Streak bonus
      if (this.gameState.streak >= 3) {
        points *= 1.5;
      }
      if (this.gameState.streak >= 5) {
        points *= 2;
      }
      
      // Time bonus (bonus for answering quickly)
      const timeBonus = Math.floor((this.gameState.timeRemaining / currentQuestion.time_limit) * 100);
      points += timeBonus;
      
      this.gameState.totalScore += Math.floor(points);
      
      this.emit('correctAnswer', {
        points: Math.floor(points),
        streak: this.gameState.streak,
        timeBonus
      });
      
      this.checkAchievements();
      
    } else {
      // Wrong answer
      arcadeAudio.playError();
      this.gameState.lives--;
      this.gameState.streak = 0;
      
      this.emit('wrongAnswer', {
        correctAnswer: currentQuestion.correct_answer,
        explanation: currentQuestion.explanation,
        livesRemaining: this.gameState.lives
      });
      
      if (this.gameState.lives <= 0) {
        this.gameOver();
        return;
      }
    }
    
    // Move to next question
    setTimeout(() => {
      this.nextQuestion();
    }, 2000); // 2 second delay to show feedback
  }

  private nextQuestion() {
    this.gameState.currentQuestionIndex++;
    
    if (this.gameState.currentQuestionIndex >= this.gameState.questions.length) {
      // Level complete
      this.completeLevel();
    } else {
      // Next question
      const nextQuestion = this.getCurrentQuestion();
      if (nextQuestion) {
        this.gameState.timeRemaining = nextQuestion.time_limit;
        this.startQuestionTimer();
        this.emit('nextQuestion', nextQuestion);
      }
    }
  }

  // Timer management
  private startQuestionTimer() {
    this.stopQuestionTimer();
    
    this.gameTimer = setInterval(() => {
      this.gameState.timeRemaining--;
      
      this.emit('timerUpdate', this.gameState.timeRemaining);
      
      if (this.gameState.timeRemaining <= 5 && this.gameState.timeRemaining > 0) {
        // Warning sound for last 5 seconds
        arcadeAudio.playHover();
      }
      
      if (this.gameState.timeRemaining <= 0) {
        // Time's up
        this.timeUp();
      }
    }, 1000);
  }

  private stopQuestionTimer() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  }

  private timeUp() {
    this.stopQuestionTimer();
    arcadeAudio.playError();
    
    this.gameState.lives--;
    this.gameState.streak = 0;
    
    this.emit('timeUp', {
      livesRemaining: this.gameState.lives,
      correctAnswer: this.getCurrentQuestion()?.correct_answer
    });
    
    if (this.gameState.lives <= 0) {
      this.gameOver();
    } else {
      setTimeout(() => {
        this.nextQuestion();
      }, 2000);
    }
  }

  // Level completion
  private completeLevel() {
    this.stopQuestionTimer();
    arcadeAudio.playLevelUp();
    
    const score = calculateScore(this.gameState.questions, this.gameState.answers.filter(a => a !== null) as (string | number)[]);
    
    // Level completion bonus
    let bonus = 0;
    if (score.accuracy >= 90) bonus = 1000;
    else if (score.accuracy >= 75) bonus = 500;
    else if (score.accuracy >= 60) bonus = 250;
    
    this.gameState.totalScore += bonus;
    
    this.gameState.gameStatus = 'level_complete';
    
    this.emit('levelComplete', {
      level: this.gameState.currentLevel,
      score: score,
      bonus: bonus,
      totalScore: this.gameState.totalScore
    });
    
    this.checkAchievements();
    
    // Check if player can advance to next level
    const nextLevel = getNextLevel(this.gameState.currentLevel, this.gameState.totalScore);
    if (nextLevel > this.gameState.currentLevel && nextLevel <= 9) {
      setTimeout(() => {
        this.advanceToNextLevel(nextLevel);
      }, 3000);
    } else if (this.gameState.currentLevel >= 9) {
      // Game completed!
      this.victory();
    }
  }

  private advanceToNextLevel(level: number) {
    this.gameState.currentLevel = level;
    this.loadLevelQuestions(level);
    this.gameState.gameStatus = 'playing';
    
    // Restore some lives for next level
    this.gameState.lives = Math.min(3, this.gameState.lives + 1);
    
    this.emit('levelUp', {
      newLevel: level,
      lives: this.gameState.lives
    });
    
    this.startQuestionTimer();
  }

  // Game ending
  private gameOver() {
    this.stopQuestionTimer();
    this.gameState.gameStatus = 'game_over';
    this.gameState.endTime = Date.now();
    
    arcadeAudio.playError();
    
    this.emit('gameOver', {
      finalScore: this.gameState.totalScore,
      level: this.gameState.currentLevel,
      playTime: this.gameState.endTime! - this.gameState.startTime!
    });
    
    this.saveGameStats();
  }

  private victory() {
    this.stopQuestionTimer();
    this.gameState.gameStatus = 'victory';
    this.gameState.endTime = Date.now();
    
    // Victory bonus
    this.gameState.totalScore += 5000;
    
    arcadeAudio.playSuccess();
    
    this.emit('victory', {
      finalScore: this.gameState.totalScore,
      playTime: this.gameState.endTime! - this.gameState.startTime!
    });
    
    this.saveGameStats();
  }

  // Power-ups
  usePowerUp(powerUpId: string) {
    const powerUp = this.gameState.powerUps.find(p => p.id === powerUpId);
    if (!powerUp || powerUp.uses <= 0) return false;
    
    arcadeAudio.playSuccess();
    powerUp.uses--;
    
    switch (powerUp.type) {
      case 'time_boost':
        this.gameState.timeRemaining += 30;
        break;
      case 'skip_question':
        this.nextQuestion();
        break;
      case 'eliminate_two':
        // This would be handled by the UI component
        break;
      case 'double_points':
        // This would be handled when calculating points
        break;
    }
    
    this.emit('powerUpUsed', powerUp);
    return true;
  }

  // Achievement system
  private checkAchievements() {
    const newAchievements: Achievement[] = [];
    
    // Streak achievements
    if (this.gameState.streak === 5) {
      newAchievements.push({
        id: 'streak_5',
        name: 'NEURAL SYNCHRONIZATION',
        description: '5 correct answers in a row',
        icon: '🔥',
        unlockedAt: Date.now(),
        points: 250
      });
    }
    
    // Score achievements
    if (this.gameState.totalScore >= 10000) {
      newAchievements.push({
        id: 'score_10k',
        name: 'ALGORITHM MASTER',
        description: 'Reached 10,000 points',
        icon: '👑',
        unlockedAt: Date.now(),
        points: 500
      });
    }
    
    // Add new achievements
    newAchievements.forEach(achievement => {
      if (!this.gameState.achievements.find(a => a.id === achievement.id)) {
        this.gameState.achievements.push(achievement);
        this.gameState.totalScore += achievement.points;
        this.emit('achievementUnlocked', achievement);
      }
    });
  }

  // Game state management
  pauseGame() {
    if (this.gameState.gameStatus === 'playing') {
      this.stopQuestionTimer();
      this.gameState.gameStatus = 'paused';
      this.emit('gamePaused');
    }
  }

  resumeGame() {
    if (this.gameState.gameStatus === 'paused') {
      this.gameState.gameStatus = 'playing';
      this.startQuestionTimer();
      this.emit('gameResumed');
    }
  }

  resetGame() {
    this.stopQuestionTimer();
    this.gameState = this.getInitialGameState();
    this.emit('gameReset');
  }

  // Stats and persistence
  private saveGameStats() {
    const stats = this.getStoredStats();
    
    stats.totalGamesPlayed++;
    stats.highestLevel = Math.max(stats.highestLevel, this.gameState.currentLevel);
    stats.totalScore += this.gameState.totalScore;
    
    const correctAnswers = this.gameState.answers.filter((answer, index) => 
      answer === this.gameState.questions[index]?.correct_answer
    ).length;
    
    stats.totalCorrectAnswers += correctAnswers;
    stats.totalQuestions += this.gameState.questions.length;
    stats.averageAccuracy = (stats.totalCorrectAnswers / stats.totalQuestions) * 100;
    
    if (this.gameState.endTime && this.gameState.startTime) {
      const playTime = this.gameState.endTime - this.gameState.startTime;
      if (stats.fastestCompletion === 0 || playTime < stats.fastestCompletion) {
        stats.fastestCompletion = playTime;
      }
    }
    
    stats.longestStreak = Math.max(stats.longestStreak, this.gameState.streak);
    stats.achievements = [...stats.achievements, ...this.gameState.achievements];
    
    localStorage.setItem('mlArcadeStats', JSON.stringify(stats));
  }

  private getStoredStats(): GameStats {
    const stored = localStorage.getItem('mlArcadeStats');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      totalGamesPlayed: 0,
      highestLevel: 1,
      totalScore: 0,
      totalCorrectAnswers: 0,
      totalQuestions: 0,
      averageAccuracy: 0,
      fastestCompletion: 0,
      longestStreak: 0,
      achievements: []
    };
  }

  // Public getters
  getGameState(): Readonly<GameState> {
    return { ...this.gameState };
  }

  getStats(): GameStats {
    return this.getStoredStats();
  }
}

// Singleton instance
export const gameEngine = new MLArcadeGameEngine();

// React hook for using the game engine
export const useGameEngine = () => {
  return {
    startGame: (level?: number) => gameEngine.startGame(level),
    answerQuestion: (answer: string | number) => gameEngine.answerQuestion(answer),
    usePowerUp: (powerUpId: string) => gameEngine.usePowerUp(powerUpId),
    pauseGame: () => gameEngine.pauseGame(),
    resumeGame: () => gameEngine.resumeGame(),
    resetGame: () => gameEngine.resetGame(),
    getCurrentQuestion: () => gameEngine.getCurrentQuestion(),
    getGameState: () => gameEngine.getGameState(),
    getStats: () => gameEngine.getStats(),
    on: (event: string, callback: Function) => gameEngine.on(event, callback),
    off: (event: string, callback: Function) => gameEngine.off(event, callback)
  };
};
