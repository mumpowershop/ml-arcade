import React, { useState } from 'react'
import { useGameEngine } from '../utils/gameEngine'
import { GameMenu } from '../components/GameMenu'
import { GameScreen } from '../components/GameScreen'

type GameMode = 'menu' | 'playing' | 'stats'

export const ChallengesPage: React.FC = () => {
  const gameEngine = useGameEngine()
  const [gameMode, setGameMode] = useState<GameMode>('menu')

  const handleStartGame = (level: number) => {
    gameEngine.startGame(level)
    setGameMode('playing')
  }

  const handleGameEnd = () => {
    setGameMode('menu')
  }

  const handleViewStats = () => {
    setGameMode('stats')
  }

  const handleBackToMenu = () => {
    setGameMode('menu')
  }

  if (gameMode === 'playing') {
    return <GameScreen onGameEnd={handleGameEnd} />
  }

  if (gameMode === 'stats') {
    return <StatsScreen onBack={handleBackToMenu} />
  }

  return (
    <GameMenu 
      onStartGame={handleStartGame} 
      onViewStats={handleViewStats} 
    />
  )
}

// Simple stats screen component
const StatsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const gameEngine = useGameEngine()
  const stats = gameEngine.getStats()

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

      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold neon-text-green" style={{fontFamily: 'Orbitron, monospace'}}>
              WARRIOR STATISTICS
            </h1>
            <button
              onClick={onBack}
              className="btn btn-secondary"
            >
              BACK TO MENU
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Overall Stats */}
            <div className="retro-panel p-6 pixel-corners">
              <h3 className="text-xl font-bold neon-text-pink mb-4" style={{fontFamily: 'Orbitron, monospace'}}>
                COMBAT RECORD
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-cyan-300">Games Played:</span>
                  <span className="neon-text font-bold">{stats.totalGamesPlayed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Highest Level:</span>
                  <span className="neon-text-green font-bold">{stats.highestLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Total Score:</span>
                  <span className="neon-text-pink font-bold">{stats.totalScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Average Accuracy:</span>
                  <span className="neon-text font-bold">{stats.averageAccuracy.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="retro-panel p-6 pixel-corners">
              <h3 className="text-xl font-bold neon-text mb-4" style={{fontFamily: 'Orbitron, monospace'}}>
                NEURAL PERFORMANCE
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-cyan-300">Total Answers:</span>
                  <span className="neon-text font-bold">{stats.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Correct Answers:</span>
                  <span className="neon-text-green font-bold">{stats.totalCorrectAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300">Longest Streak:</span>
                  <span className="neon-text-pink font-bold">{stats.longestStreak}</span>
                </div>
                {stats.fastestCompletion > 0 && (
                  <div className="flex justify-between">
                    <span className="text-cyan-300">Fastest Time:</span>
                    <span className="neon-text font-bold">{Math.floor(stats.fastestCompletion / 60000)}:{((stats.fastestCompletion % 60000) / 1000).toFixed(0).padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="retro-panel p-6 pixel-corners">
              <h3 className="text-xl font-bold neon-text-green mb-4" style={{fontFamily: 'Orbitron, monospace'}}>
                ACHIEVEMENTS
              </h3>
              {stats.achievements.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {stats.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-2 border border-cyan-500 border-opacity-30">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <div className="text-sm neon-text font-bold">{achievement.name}</div>
                        <div className="text-xs text-cyan-400">{achievement.description}</div>
                        <div className="text-xs neon-text-pink">+{achievement.points} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-cyan-400" style={{fontFamily: 'Orbitron, monospace'}}>
                  No achievements yet.<br />Start playing to unlock them!
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="retro-panel p-8 pixel-corners">
              <h2 className="text-3xl font-bold neon-text-pink mb-4 animate-neon-flicker" style={{fontFamily: 'Orbitron, monospace'}}>
                READY FOR MORE NEURAL WARFARE?
              </h2>
              <button
                onClick={onBack}
                className="btn btn-primary btn-lg px-8 py-4 animate-bounce-gentle"
              >
                RETURN TO BATTLEFIELD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


