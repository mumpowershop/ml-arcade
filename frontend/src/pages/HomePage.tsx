import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  Code, 
  Trophy, 
  Target, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { useArcadeSound } from '../utils/arcadeSounds'

export const HomePage: React.FC = () => {
  const { playButtonPress, playHover } = useArcadeSound()
  const features = [
    {
      icon: Code,
      title: 'NEURAL CHALLENGES',
      description: 'Battle through hardcore ML missions that test your machine learning prowess in cyber-world scenarios.'
    },
    {
      icon: Target,
      title: 'ADAPTIVE AI',
      description: 'The system evolves with your skills - face progressively harder challenges as you level up your abilities.'
    },
    {
      icon: Trophy,
      title: 'GLOBAL RANKINGS',
      description: 'Compete against elite ML warriors from around the world and claim your spot on the leaderboards.'
    },
    {
      icon: Zap,
      title: 'INSTANT NEURAL FEEDBACK',
      description: 'Get real-time analysis of your code performance and ML knowledge with lightning-fast AI evaluation.'
    },
    {
      icon: Users,
      title: 'EXPERT VALIDATORS',
      description: 'Your solutions are reviewed by legendary ML architects using cutting-edge assessment protocols.'
    },
    {
      icon: Brain,
      title: 'COMPLETE NEURAL SCAN',
      description: 'Master everything from data preprocessing to model deployment in this comprehensive ML battleground.'
    }
  ]

  const challengeCategories = [
    {
      name: 'DATA MATRIX',
      description: 'Hack and decode raw data streams for neural network consumption',
      difficulty: 'LEVEL 1-3',
      color: 'neon-text'
    },
    {
      name: 'NEURAL FORGE',
      description: 'Construct and train powerful AI warriors from digital blueprints',
      difficulty: 'LEVEL 3-6',
      color: 'neon-text-green'
    },
    {
      name: 'PERFORMANCE SCANNER',
      description: 'Analyze and optimize your AI creations for maximum battle effectiveness',
      difficulty: 'LEVEL 2-4',
      color: 'neon-text-pink'
    },
    {
      name: 'CYBER DEPLOYMENT',
      description: 'Launch your AI warriors into the production battlespace',
      difficulty: 'LEVEL 6-9',
      color: 'neon-text'
    }
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl animate-neon-flicker" style={{fontFamily: 'Orbitron, monospace'}}>
                  <span className="block xl:inline neon-text-pink">ML ARCADE</span>{' '}
                  <span className="block neon-text xl:inline">NEURAL ZONE</span>
                </h1>
                <p className="mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 text-cyan-400" style={{fontFamily: 'Orbitron, monospace'}}>
                  ENTER THE CYBER-REALM WHERE ML WARRIORS FORGE THEIR NEURAL NETWORKS. 
                  TEST YOUR ALGORITHMS IN THE ULTIMATE AI BATTLEGROUND.
                </p>
                <div className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div>
                    <Link
                      to="/register"
                      className="btn btn-primary btn-lg w-full flex items-center justify-center px-8 py-4 animate-bounce-gentle"
                      onMouseEnter={() => playHover()}
                      onClick={() => playButtonPress()}
                    >
                      ENTER ARENA
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div>
                    <Link
                      to="/login"
                      className="btn btn-secondary btn-lg w-full flex items-center justify-center px-8 py-4"
                      onMouseEnter={() => playHover()}
                      onClick={() => playButtonPress()}
                    >
                      NEURAL LOGIN
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full gradient-primary sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center retro-panel">
            <Brain className="h-32 w-32 text-white opacity-90 animate-arcade-rotate" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base neon-text-pink font-bold tracking-wide uppercase animate-neon-flicker" style={{fontFamily: 'Press Start 2P, monospace'}}>SYSTEM FEATURES</h2>
            <p className="mt-4 text-3xl leading-8 font-extrabold tracking-tight neon-text sm:text-4xl" style={{fontFamily: 'Orbitron, monospace'}}>
              NEURAL ENHANCEMENT PROTOCOLS
            </p>
            <p className="mt-6 max-w-2xl text-xl text-cyan-300 lg:mx-auto" style={{fontFamily: 'Orbitron, monospace'}}>
              ADVANCED AI BATTLEGROUND DESIGNED BY LEGENDARY ML ARCHITECTS
            </p>
          </div>

          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="relative retro-panel p-6 pixel-corners">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 arcade-border neon-text">
                        <Icon className="h-6 w-6 animate-neon-flicker" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-bold neon-text-pink" style={{fontFamily: 'Orbitron, monospace'}}>{feature.title}</p>
                    </dt>
                    <dd className="mt-3 ml-16 text-base text-cyan-300" style={{fontFamily: 'Orbitron, monospace'}}>{feature.description}</dd>
                  </div>
                )
              })}
            </dl>
          </div>
        </div>
      </div>

      {/* Challenge Categories */}
      <div className="py-16 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base neon-text-green font-bold tracking-wide uppercase animate-neon-flicker" style={{fontFamily: 'Press Start 2P, monospace'}}>BATTLE ARENAS</h2>
            <p className="mt-4 text-3xl leading-8 font-extrabold tracking-tight neon-text-pink sm:text-4xl" style={{fontFamily: 'Orbitron, monospace'}}>
              CHOOSE YOUR NEURAL BATTLEFIELD
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {challengeCategories.map((category) => (
              <div key={category.name} className="card p-8 hover:animate-glitch transition-all duration-300 pixel-corners">
                <div className="w-16 h-16 arcade-border flex items-center justify-center mb-6 bg-black">
                  <Code className={`h-8 w-8 ${category.color} animate-neon-flicker`} />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${category.color}`} style={{fontFamily: 'Orbitron, monospace'}}>{category.name}</h3>
                <p className="text-cyan-300 text-sm mb-4" style={{fontFamily: 'Orbitron, monospace'}}>{category.description}</p>
                <div className="flex items-center text-xs neon-text-pink">
                  <Target className="h-4 w-4 mr-2 animate-neon-flicker" />
                  <span style={{fontFamily: 'Press Start 2P, monospace'}}>{category.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-danger relative py-20">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl animate-neon-flicker" style={{fontFamily: 'Orbitron, monospace'}}>
            <span className="block neon-text">READY TO ENTER THE NEURAL MATRIX?</span>
            <span className="block neon-text-pink">INITIATE SEQUENCE NOW!</span>
          </h2>
          <p className="mt-6 text-lg leading-6 text-cyan-200" style={{fontFamily: 'Orbitron, monospace'}}>
            JOIN THE ELITE BROTHERHOOD OF ML WARRIORS AND ASCEND TO ALGORITHMIC SUPREMACY.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/register"
              className="btn btn-success btn-lg inline-flex items-center px-8 py-4 animate-bounce-gentle"
              onMouseEnter={() => playHover()}
              onClick={() => playButtonPress()}
            >
              ACTIVATE NEURAL LINK
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t-2 border-cyan-500" style={{borderImage: 'linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff) 1'}}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Brain className="h-10 w-10 neon-text animate-arcade-rotate" />
              <span className="text-2xl font-bold neon-text-pink" style={{fontFamily: 'Orbitron, monospace'}}>ML ARCADE</span>
            </div>
            <p className="text-cyan-400 text-sm" style={{fontFamily: 'Orbitron, monospace'}}>
              © 2024 ML ARCADE. ENGINEERED FOR THE FUTURE OF NEURAL WARFARE.
            </p>
            <div className="mt-4 text-xs neon-text opacity-60 animate-neon-flicker" style={{fontFamily: 'Press Start 2P, monospace'}}>
              SYSTEM ONLINE • ALL NEURAL NETWORKS OPERATIONAL • READY FOR BATTLE
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


