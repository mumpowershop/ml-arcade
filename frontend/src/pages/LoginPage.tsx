import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Brain, Eye, EyeOff, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { useArcadeSound } from '../utils/arcadeSounds'

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { playButtonPress, playSuccess, playError, playTyping } = useArcadeSound()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    playTyping() // Play typing sound on input
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    playButtonPress()
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      playSuccess()
      toast.success('NEURAL LINK ESTABLISHED!')
      navigate('/dashboard')
    } catch (error: any) {
      playError()
      toast.error(error.message || 'ACCESS DENIED - NEURAL LINK FAILED')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 retro-panel p-8 pixel-corners relative z-10">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center space-x-3">
              <Brain className="h-12 w-12 neon-text animate-arcade-rotate" />
              <span className="text-3xl font-bold neon-text-pink" style={{fontFamily: 'Orbitron, monospace'}}>ML ARCADE</span>
            </div>
          </div>
          <h2 className="mt-8 text-center text-2xl font-extrabold neon-text animate-neon-flicker" style={{fontFamily: 'Orbitron, monospace'}}>
            NEURAL AUTHENTICATION
          </h2>
          <p className="mt-4 text-center text-sm text-cyan-300" style={{fontFamily: 'Orbitron, monospace'}}>
            OR{' '}
            <Link
              to="/register"
              className="font-bold neon-text-pink hover:animate-glitch"
              onMouseEnter={() => playButtonPress()}
            >
              INITIALIZE NEW WARRIOR
            </Link>
          </p>
        </div>
        
        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-cyan-300 mb-2" style={{fontFamily: 'Orbitron, monospace'}}>
                NEURAL EMAIL ID
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input w-full"
                placeholder="ENTER EMAIL SIGNATURE"
                value={formData.email}
                onChange={handleChange}
                style={{fontFamily: 'Orbitron, monospace'}}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-bold text-cyan-300 mb-2" style={{fontFamily: 'Orbitron, monospace'}}>
                ACCESS PASSWORD
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="input w-full pr-12"
                placeholder="ENTER SECURITY CODE"
                value={formData.password}
                onChange={handleChange}
                style={{fontFamily: 'Orbitron, monospace'}}
              />
              <button
                type="button"
                className="absolute bottom-3 right-3 text-cyan-400 hover:text-cyan-200 transition-colors"
                onClick={() => {
                  setShowPassword(!showPassword)
                  playButtonPress()
                }}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 accent-cyan-400 border-cyan-400 bg-black"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-cyan-300" style={{fontFamily: 'Orbitron, monospace'}}>
                SAVE NEURAL PATTERN
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-bold neon-text-pink hover:animate-glitch" style={{fontFamily: 'Orbitron, monospace'}}>
                RESET ACCESS KEY?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg w-full flex justify-center items-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              onMouseEnter={() => !isLoading && playButtonPress()}
            >
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'INITIATE NEURAL LINK'
              )}
            </button>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-cyan-500 opacity-30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black neon-text-green" style={{fontFamily: 'Press Start 2P, monospace', fontSize: '10px'}}>DEMO ACCESS</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: 'demo@example.com', password: 'password123' })
                  playSuccess()
                }}
                onMouseEnter={() => playButtonPress()}
                className="btn btn-secondary w-full py-3"
              >
                ACTIVATE DEMO NEURAL LINK
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}


