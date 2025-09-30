import React, { useState, useEffect } from 'react';
import { useGameEngine, GameStats } from '../utils/gameEngine';
import { useArcadeSound } from '../utils/arcadeSounds';
import {
  Brain,
  Trophy,
  Target,
  Zap,
  User,
  BarChart3,
  Play,
  Settings,
  Volume2,
  VolumeX,
  Music,
  Pause
} from 'lucide-react';

interface GameMenuProps {
  onStartGame: (level: number) => void;
  onViewStats: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({ onStartGame, onViewStats }) => {
  const gameEngine = useGameEngine();
  const { 
    playButtonPress, 
    playHover, 
    toggleMute, 
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    setBackgroundMusicVolume,
    backgroundMusicStatus
  } = useArcadeSound();
  
  const [stats, setStats] = useState<GameStats>(gameEngine.getStats());
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.15);
  const [showAudioControls, setShowAudioControls] = useState(false);

  useEffect(() => {
    setStats(gameEngine.getStats());
  }, [gameEngine]);

  // Auto-start background music on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startBackgroundMusic();
    }, 1000); // Start music after 1 second delay

    return () => clearTimeout(timer);
  }, [startBackgroundMusic]);

  const handleStartGame = () => {
    playButtonPress();
    onStartGame(selectedLevel);
  };

  const handleLevelSelect = (level: number) => {
    if (level <= stats.highestLevel || level === 1) {
      setSelectedLevel(level);
      playHover();
    }
  };

  const handleMuteToggle = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    if (muted) {
      stopBackgroundMusic();
    } else {
      playButtonPress();
      startBackgroundMusic();
    }
  };

  const handleMusicToggle = () => {
    const isPlaying = toggleBackgroundMusic();
    playButtonPress();
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setMusicVolume(volume);
    setBackgroundMusicVolume(volume);
  };

  const toggleAudioControls = () => {
    setShowAudioControls(!showAudioControls);
    playHover();
  };

  const categories = [
    {
      name: 'DATA MATRIX',
      description: 'Data preprocessing and cleaning protocols',
      levels: '1-3',
      color: 'neon-text',
      icon: <Target className="h-8 w-8" />
    },
    {
      name: 'NEURAL FORGE',
      description: 'Model training and algorithm construction',
      levels: '1-6',
      color: 'neon-text-green',
      icon: <Brain className="h-8 w-8" />
    },
    {
      name: 'PERFORMANCE SCANNER',
      description: 'Model evaluation and optimization',
      levels: '2-5',
      color: 'neon-text-pink',
      icon: <BarChart3 className="h-8 w-8" />
    },
    {
      name: 'CYBER DEPLOYMENT',
      description: 'MLOps and production deployment',
      levels: '6-9',
      color: 'neon-text',
      icon: <Zap className="h-8 w-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 opacity-15">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 neon-text opacity-60 animate-bounce-gentle">◆</div>
        <div className="absolute top-40 right-32 w-6 h-6 neon-text-pink opacity-40 animate-arcade-rotate">▲</div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 neon-text-green opacity-50 animate-neon-flicker">●</div>
        <div className="absolute bottom-20 right-20 w-4 h-4 neon-text opacity-60 animate-bounce-gentle">■</div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Brain className="h-16 w-16 neon-text-pink animate-arcade-rotate mr-4" />
            <h1 className="text-6xl font-bold neon-text animate-neon-flicker" style={{fontFamily: 'Orbitron, monospace'}}>
              ML ARCADE
            </h1>
          </div>
          <p className="text-xl neon-text-green" style={{fontFamily: 'Orbitron, monospace'}}>
            NEURAL NETWORK BATTLEGROUND
          </p>
          <div className="mt-4 neon-text text-sm animate-neon-flicker" style={{fontFamily: 'Press Start 2P, monospace'}}>
            SYSTEM STATUS: ONLINE • READY FOR COMBAT
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Menu */}
            <div className="lg:col-span-2">
              {!showLevelSelect ? (
                <div className="space-y-6">
                  {/* Quick Start */}
                  <div className="retro-panel p-8 pixel-corners">
                    <h2 className="text-3xl font-bold neon-text-pink mb-6" style={{fontFamily: 'Orbitron, monospace'}}>
                      INITIALIZE NEURAL LINK
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={handleStartGame}
                        className="btn btn-primary btn-lg h-16 flex items-center justify-center animate-bounce-gentle"
                        onMouseEnter={() => playHover()}
                      >
                        <Play className="h-6 w-6 mr-3" />
                        START MISSION
                      </button>
                      <button
                        onClick={() => {
                          setShowLevelSelect(true);
                          playButtonPress();
                        }}
                        className="btn btn-secondary btn-lg h-16 flex items-center justify-center"
                        onMouseEnter={() => playHover()}
                      >
                        <Target className="h-6 w-6 mr-3" />
                        SELECT LEVEL
                      </button>
                    </div>
                  </div>

                  {/* Battle Arenas */}
                  <div className="retro-panel p-8 pixel-corners">
                    <h2 className="text-2xl font-bold neon-text mb-6" style={{fontFamily: 'Orbitron, monospace'}}>
                      COMBAT ZONES
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {categories.map((category, index) => (
                        <div key={index} className="card p-6 hover:animate-glitch transition-all duration-300">
                          <div className="flex items-center mb-4">
                            <div className={`${category.color} mr-3`}>
                              {category.icon}
                            </div>
                            <div>
                              <h3 className={`text-lg font-bold ${category.color}`} style={{fontFamily: 'Orbitron, monospace'}}>
                                {category.name}
                              </h3>
                              <div className="text-xs neon-text-pink" style={{fontFamily: 'Press Start 2P, monospace'}}>
                                LEVELS {category.levels}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-cyan-300" style={{fontFamily: 'Orbitron, monospace'}}>
                            {category.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Level Selection */
                <div className="retro-panel p-8 pixel-corners">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold neon-text-pink" style={{fontFamily: 'Orbitron, monospace'}}>
                      SELECT DIFFICULTY LEVEL
                    </h2>
                    <button
                      onClick={() => {
                        setShowLevelSelect(false);
                        playButtonPress();
                      }}
                      className="btn btn-secondary"
                      onMouseEnter={() => playHover()}
                    >
                      BACK
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Array.from({ length: 9 }, (_, i) => i + 1).map(level => {
                      const isUnlocked = level <= stats.highestLevel || level === 1;
                      const isSelected = level === selectedLevel;
                      
                      return (
                        <button
                          key={level}
                          onClick={() => handleLevelSelect(level)}
                          disabled={!isUnlocked}
                          className={`p-6 border-2 transition-all duration-300 pixel-corners ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-400 bg-opacity-20'
                              : isUnlocked
                                ? 'border-cyan-600 hover:border-cyan-400'
                                : 'border-gray-700 opacity-50'
                          }`}
                          onMouseEnter={() => isUnlocked && playHover()}
                        >
                          <div className={`text-3xl font-bold mb-2 ${
                            isSelected
                              ? 'neon-text-green'
                              : isUnlocked
                                ? 'neon-text'
                                : 'text-gray-600'
                          }`} style={{fontFamily: 'Orbitron, monospace'}}>
                            {level}
                          </div>
                          <div className={`text-xs ${
                            isUnlocked ? 'neon-text-pink' : 'text-gray-600'
                          }`} style={{fontFamily: 'Press Start 2P, monospace'}}>
                            {isUnlocked ? 'READY' : 'LOCKED'}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleStartGame}
                      className="btn btn-success btn-lg px-8 py-4 animate-bounce-gentle"
                      onMouseEnter={() => playHover()}
                    >
                      <Play className="h-6 w-6 mr-3" />
                      START LEVEL {selectedLevel}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Stats & Settings */}
            <div className="space-y-6">
              {/* Player Stats */}
              <div className="retro-panel p-6 pixel-corners">
                <h3 className="text-xl font-bold neon-text-green mb-4" style={{fontFamily: 'Orbitron, monospace'}}>
                  WARRIOR STATS
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-300" style={{fontFamily: 'Orbitron, monospace'}}>
                      Highest Level
                    </span>
                    <span className="neon-text-pink font-bold" style={{fontFamily: 'Press Start 2P, monospace'}}>
                      {stats.highestLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-300" style={{fontFamily: 'Orbitron, monospace'}}>
                      Total Score
                    </span>
                    <span className="neon-text font-bold" style={{fontFamily: 'Press Start 2P, monospace'}}>
                      {stats.totalScore.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-300" style={{fontFamily: 'Orbitron, monospace'}}>
                      Accuracy
                    </span>
                    <span className="neon-text-green font-bold" style={{fontFamily: 'Press Start 2P, monospace'}}>
                      {stats.averageAccuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-300" style={{fontFamily: 'Orbitron, monospace'}}>
                      Games Played
                    </span>
                    <span className="neon-text-pink font-bold" style={{fontFamily: 'Press Start 2P, monospace'}}>
                      {stats.totalGamesPlayed}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onViewStats();
                    playButtonPress();
                  }}
                  className="btn btn-outline btn-sm w-full mt-4"
                  onMouseEnter={() => playHover()}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  VIEW DETAILED STATS
                </button>
              </div>

              {/* Settings */}
              <div className="retro-panel p-6 pixel-corners">
                <h3 className="text-xl font-bold neon-text mb-4" style={{fontFamily: 'Orbitron, monospace'}}>
                  SYSTEM CONFIG
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleMuteToggle}
                    className="btn btn-secondary w-full flex items-center justify-center"
                    onMouseEnter={() => playHover()}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5 mr-2" /> : <Volume2 className="h-5 w-5 mr-2" />}
                    AUDIO {isMuted ? 'OFF' : 'ON'}
                  </button>

                  {/* Expandable Audio Controls */}
                  <button
                    onClick={toggleAudioControls}
                    className="btn btn-outline btn-sm w-full flex items-center justify-center"
                    onMouseEnter={() => playHover()}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    AUDIO CONFIG {showAudioControls ? '▼' : '▶'}
                  </button>

                  {showAudioControls && (
                    <div className="space-y-2 mt-3 p-3 border border-cyan-600 rounded pixel-corners bg-black bg-opacity-50">
                      {/* Background Music Toggle */}
                      <button
                        onClick={handleMusicToggle}
                        className={`btn btn-sm w-full flex items-center justify-center ${
                          backgroundMusicStatus.isPlaying ? 'btn-success' : 'btn-outline'
                        }`}
                        onMouseEnter={() => playHover()}
                        disabled={isMuted}
                      >
                        {backgroundMusicStatus.isPlaying ? 
                          <Pause className="h-4 w-4 mr-2" /> : 
                          <Music className="h-4 w-4 mr-2" />
                        }
                        SYNTHWAVE {backgroundMusicStatus.isPlaying ? 'ON' : 'OFF'}
                      </button>

                      {/* Music Volume Slider */}
                      <div className="space-y-1">
                        <label className="text-xs neon-text-pink block" style={{fontFamily: 'Press Start 2P, monospace'}}>
                          MUSIC VOL
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="0.4"
                          step="0.05"
                          value={musicVolume}
                          onChange={handleMusicVolumeChange}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-neon"
                          disabled={isMuted}
                        />
                        <div className="text-xs text-cyan-400 text-center" style={{fontFamily: 'Orbitron, monospace'}}>
                          {Math.round(musicVolume * 100)}%
                        </div>
                      </div>

                      <div className="text-xs neon-text-pink text-center pt-2" style={{fontFamily: 'Press Start 2P, monospace'}}>
                        🎵 1980s CYBERPUNK MIX 🎵
                      </div>
                    </div>
                  )}

                  <div className="text-xs neon-text-pink text-center" style={{fontFamily: 'Press Start 2P, monospace'}}>
                    v1.0.1 SYNTHWAVE
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              {stats.achievements.length > 0 && (
                <div className="retro-panel p-6 pixel-corners">
                  <h3 className="text-xl font-bold neon-text-green mb-4" style={{fontFamily: 'Orbitron, monospace'}}>
                    ACHIEVEMENTS
                  </h3>
                  <div className="space-y-2">
                    {stats.achievements.slice(-3).map((achievement, index) => (
                      <div key={achievement.id} className="flex items-center space-x-2">
                        <span className="text-xl">{achievement.icon}</span>
                        <div>
                          <div className="text-sm neon-text font-bold" style={{fontFamily: 'Orbitron, monospace'}}>
                            {achievement.name}
                          </div>
                          <div className="text-xs text-cyan-400" style={{fontFamily: 'Orbitron, monospace'}}>
                            +{achievement.points} pts
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="neon-text-pink text-sm animate-neon-flicker" style={{fontFamily: 'Press Start 2P, monospace'}}>
            PREPARE FOR NEURAL WARFARE • ALGORITHM MASTERY AWAITS
          </div>
        </div>
      </div>
    </div>
  );
};

