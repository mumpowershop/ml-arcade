import React, { useState, useEffect } from 'react';
import { useGameEngine } from '../utils/gameEngine';
import { useArcadeSound } from '../utils/arcadeSounds';
import { Question } from '../data/questionDatabase';
import {
  Brain,
  Heart,
  Clock,
  Zap,
  Target,
  Trophy,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react';

interface GameScreenProps {
  onGameEnd: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameEnd }) => {
  const gameEngine = useGameEngine();
  const { playButtonPress, playHover, playError } = useArcadeSound();
  
  const [gameState, setGameState] = useState(gameEngine.getGameState());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    correct: boolean;
    message: string;
  }>({ show: false, correct: false, message: '' });
  const [showPowerUps, setShowPowerUps] = useState(false);

  useEffect(() => {
    // Set up game engine event listeners
    const handleGameStateUpdate = () => {
      setGameState(gameEngine.getGameState());
    };

    const handleCorrectAnswer = (data: any) => {
      setFeedback({
        show: true,
        correct: true,
        message: `NEURAL SYNC SUCCESS! +${data.points} POINTS`
      });
    };

    const handleWrongAnswer = (data: any) => {
      setFeedback({
        show: true,
        correct: false,
        message: `ACCESS DENIED! Correct: ${data.correctAnswer}`
      });
    };

    const handleTimeUp = () => {
      setFeedback({
        show: true,
        correct: false,
        message: 'NEURAL TIMEOUT! TIME EXPIRED'
      });
    };

    const handleLevelComplete = (data: any) => {
      setFeedback({
        show: true,
        correct: true,
        message: `LEVEL ${data.level} COMPLETE! BONUS: +${data.bonus}`
      });
    };

    const handleGameOver = () => {
      setTimeout(() => onGameEnd(), 3000);
    };

    const handleVictory = () => {
      setTimeout(() => onGameEnd(), 5000);
    };

    gameEngine.on('gameStarted', handleGameStateUpdate);
    gameEngine.on('correctAnswer', handleCorrectAnswer);
    gameEngine.on('wrongAnswer', handleWrongAnswer);
    gameEngine.on('timeUp', handleTimeUp);
    gameEngine.on('levelComplete', handleLevelComplete);
    gameEngine.on('gameOver', handleGameOver);
    gameEngine.on('victory', handleVictory);
    gameEngine.on('nextQuestion', handleGameStateUpdate);
    gameEngine.on('timerUpdate', handleGameStateUpdate);

    // Clean up event listeners
    return () => {
      gameEngine.off('gameStarted', handleGameStateUpdate);
      gameEngine.off('correctAnswer', handleCorrectAnswer);
      gameEngine.off('wrongAnswer', handleWrongAnswer);
      gameEngine.off('timeUp', handleTimeUp);
      gameEngine.off('levelComplete', handleLevelComplete);
      gameEngine.off('gameOver', handleGameOver);
      gameEngine.off('victory', handleVictory);
      gameEngine.off('nextQuestion', handleGameStateUpdate);
      gameEngine.off('timerUpdate', handleGameStateUpdate);
    };
  }, [gameEngine, onGameEnd]);

  useEffect(() => {
    setCurrentQuestion(gameEngine.getCurrentQuestion());
  }, [gameState.currentQuestionIndex, gameEngine]);

  useEffect(() => {
    // Hide feedback after 2 seconds
    if (feedback.show) {
      const timer = setTimeout(() => {
        setFeedback({ show: false, correct: false, message: '' });
        setSelectedAnswer(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback.show]);

  const handleAnswerSelect = (answer: string | number) => {
    if (feedback.show || gameState.gameStatus !== 'playing') return;
    
    playButtonPress();
    setSelectedAnswer(answer);
    gameEngine.answerQuestion(answer);
  };

  const handlePowerUpUse = (powerUpId: string) => {
    if (gameEngine.usePowerUp(powerUpId)) {
      setShowPowerUps(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (time: number, maxTime: number) => {
    const ratio = time / maxTime;
    if (ratio > 0.5) return 'neon-text-green';
    if (ratio > 0.2) return 'neon-text';
    return 'neon-text-pink animate-neon-flicker';
  };

  if (gameState.gameStatus === 'game_over') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center retro-panel p-8 pixel-corners">
          <div className="text-6xl mb-4 animate-glitch">💀</div>
          <h1 className="text-4xl font-bold neon-text-pink mb-4 animate-neon-flicker" style={{fontFamily: 'Orbitron, monospace'}}>
            NEURAL NETWORK FAILURE
          </h1>
          <p className="text-xl neon-text mb-6" style={{fontFamily: 'Orbitron, monospace'}}>
            SYSTEM OVERLOAD - LEVEL {gameState.currentLevel}
          </p>
          <div className="neon-text-green text-2xl font-bold" style={{fontFamily: 'Press Start 2P, monospace'}}>
            FINAL SCORE: {gameState.totalScore.toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gameStatus === 'victory') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center retro-panel p-8 pixel-corners">
          <div className="text-6xl mb-4 animate-bounce-gentle">🏆</div>
          <h1 className="text-4xl font-bold neon-text-green mb-4 animate-neon-flicker" style={{fontFamily: 'Orbitron, monospace'}}>
            NEURAL SUPREMACY ACHIEVED!
          </h1>
          <p className="text-xl neon-text mb-6" style={{fontFamily: 'Orbitron, monospace'}}>
            ALL 9 LEVELS CONQUERED
          </p>
          <div className="neon-text-pink text-2xl font-bold" style={{fontFamily: 'Press Start 2P, monospace'}}>
            LEGENDARY SCORE: {gameState.totalScore.toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Game HUD */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center mb-6">
          {/* Left side - Level and Score */}
          <div className="flex items-center space-x-6">
            <div className="retro-panel p-3 pixel-corners">
              <div className="text-sm neon-text-pink" style={{fontFamily: 'Press Start 2P, monospace'}}>LEVEL</div>
              <div className="text-2xl neon-text font-bold" style={{fontFamily: 'Orbitron, monospace'}}>
                {gameState.currentLevel}
              </div>
            </div>
            <div className="retro-panel p-3 pixel-corners">
              <div className="text-sm neon-text-pink" style={{fontFamily: 'Press Start 2P, monospace'}}>SCORE</div>
              <div className="text-2xl neon-text-green font-bold" style={{fontFamily: 'Orbitron, monospace'}}>
                {gameState.totalScore.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Center - Lives */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Heart
                key={i}
                className={`h-8 w-8 ${i < gameState.lives ? 'neon-text-pink animate-neon-flicker' : 'text-gray-800'}`}
                fill={i < gameState.lives ? 'currentColor' : 'none'}
              />
            ))}
          </div>

          {/* Right side - Timer and Controls */}
          <div className="flex items-center space-x-4">
            <div className="retro-panel p-3 pixel-corners">
              <div className="text-sm neon-text-pink" style={{fontFamily: 'Press Start 2P, monospace'}}>TIME</div>
              <div className={`text-2xl font-bold ${getTimerColor(gameState.timeRemaining, currentQuestion?.time_limit || 60)}`} style={{fontFamily: 'Orbitron, monospace'}}>
                {formatTime(gameState.timeRemaining)}
              </div>
            </div>
            <button
              onClick={() => gameState.gameStatus === 'playing' ? gameEngine.pauseGame() : gameEngine.resumeGame()}
              className="btn btn-secondary p-3"
              onMouseEnter={() => playHover()}
            >
              {gameState.gameStatus === 'playing' ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Power-ups */}
        <div className="mb-6">
          <button
            onClick={() => setShowPowerUps(!showPowerUps)}
            className="btn btn-secondary btn-sm mb-2"
            onMouseEnter={() => playHover()}
          >
            <Zap className="h-4 w-4 mr-2" />
            POWER-UPS
          </button>
          {showPowerUps && (
            <div className="flex space-x-2 animate-slide-up">
              {gameState.powerUps.map(powerUp => (
                <button
                  key={powerUp.id}
                  onClick={() => handlePowerUpUse(powerUp.id)}
                  disabled={powerUp.uses <= 0}
                  className="retro-panel p-2 pixel-corners hover:animate-glitch disabled:opacity-50"
                  title={powerUp.description}
                  onMouseEnter={() => playHover()}
                >
                  <div className="text-2xl mb-1">{powerUp.icon}</div>
                  <div className="text-xs neon-text" style={{fontFamily: 'Press Start 2P, monospace'}}>
                    {powerUp.uses}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Question Display */}
        {currentQuestion && (
          <div className="max-w-4xl mx-auto">
            <div className="retro-panel p-8 mb-6 pixel-corners">
              <div className="mb-4">
                <div className="badge badge-primary mb-2">
                  {currentQuestion.category.replace('_', ' ')}
                </div>
                <h2 className="text-2xl font-bold neon-text mb-4" style={{fontFamily: 'Orbitron, monospace'}}>
                  {currentQuestion.title}
                </h2>
              </div>
              
              <div className="mb-6">
                <p className="text-lg text-cyan-300 mb-4" style={{fontFamily: 'Orbitron, monospace'}}>
                  {currentQuestion.question}
                </p>
                
                {currentQuestion.code && (
                  <pre className="bg-black border border-cyan-500 p-4 rounded text-cyan-400 text-sm overflow-x-auto">
                    <code>{currentQuestion.code}</code>
                  </pre>
                )}
              </div>

              {/* Answer Options */}
              {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={feedback.show}
                      className={`w-full p-4 text-left border-2 transition-all duration-300 ${
                        selectedAnswer === index
                          ? 'border-cyan-400 bg-cyan-400 bg-opacity-20'
                          : 'border-cyan-600 hover:border-cyan-400'
                      } ${feedback.show ? 'pointer-events-none' : ''}`}
                      onMouseEnter={() => playHover()}
                      style={{fontFamily: 'Orbitron, monospace'}}
                    >
                      <span className="neon-text-pink font-bold mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-cyan-300">{option}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'code_completion' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="ENTER YOUR CODE..."
                    className="input w-full text-lg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAnswerSelect((e.target as HTMLInputElement).value);
                      }
                    }}
                    disabled={feedback.show}
                    style={{fontFamily: 'Orbitron, monospace'}}
                  />
                </div>
              )}

              {currentQuestion.type === 'true_false' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAnswerSelect('true')}
                    disabled={feedback.show}
                    className="btn btn-success flex-1 py-4"
                    onMouseEnter={() => playHover()}
                  >
                    TRUE
                  </button>
                  <button
                    onClick={() => handleAnswerSelect('false')}
                    disabled={feedback.show}
                    className="btn btn-danger flex-1 py-4"
                    onMouseEnter={() => playHover()}
                  >
                    FALSE
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="retro-panel p-4 pixel-corners">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm neon-text-pink" style={{fontFamily: 'Press Start 2P, monospace'}}>
                  PROGRESS
                </span>
                <span className="text-sm neon-text" style={{fontFamily: 'Press Start 2P, monospace'}}>
                  {gameState.currentQuestionIndex + 1} / {gameState.questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-800 h-2 arcade-border">
                <div
                  className="h-full gradient-primary transition-all duration-500"
                  style={{
                    width: `${((gameState.currentQuestionIndex + 1) / gameState.questions.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Overlay */}
      {feedback.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className={`retro-panel p-8 pixel-corners text-center ${feedback.correct ? 'animate-bounce-gentle' : 'animate-glitch'}`}>
            <div className="text-6xl mb-4">
              {feedback.correct ? '✅' : '❌'}
            </div>
            <div className={`text-2xl font-bold mb-4 ${feedback.correct ? 'neon-text-green' : 'neon-text-pink'}`} style={{fontFamily: 'Orbitron, monospace'}}>
              {feedback.message}
            </div>
            {gameState.streak > 1 && feedback.correct && (
              <div className="neon-text text-lg animate-neon-flicker" style={{fontFamily: 'Press Start 2P, monospace'}}>
                STREAK: {gameState.streak}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
