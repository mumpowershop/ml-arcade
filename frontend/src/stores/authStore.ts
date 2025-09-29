import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../services/api'

export interface Candidate {
  id: number
  candidate_id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  experience_level: 'junior' | 'mid' | 'senior' | 'expert'
  status: 'active' | 'completed' | 'suspended'
  total_score: number
  current_level: string
  completion_rate: number
  achievements: string[]
  last_login_at: string | null
}

interface AuthState {
  candidate: Candidate | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (candidateData: RegisterData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

interface RegisterData {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
  phone?: string
  bio?: string
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
  experience_level: 'junior' | 'mid' | 'senior' | 'expert'
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      candidate: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions - STANDALONE DEMO MODE (No Backend Required!)
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 800))
        
        try {
          // Accept any reasonable email/password combination
          if (email && password && email.includes('@') && password.length >= 3) {
            const mockCandidate: Candidate = {
              id: 1,
              candidate_id: 'NEURAL_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
              email: email,
              first_name: email.includes('demo') ? 'Demo' : 'Neural',
              last_name: email.includes('demo') ? 'Warrior' : 'Fighter',
              full_name: email.includes('demo') ? 'Demo Warrior' : 'Neural Fighter',
              experience_level: 'mid',
              status: 'active',
              total_score: 0,
              current_level: 'Level 1',
              completion_rate: 0,
              achievements: [],
              last_login_at: new Date().toISOString()
            }
            
            const mockToken = 'neural_link_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
            
            set({
              candidate: mockCandidate,
              token: mockToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } else {
            throw new Error('NEURAL LINK FAILED - Invalid credentials format')
          }
        } catch (error: any) {
          set({
            error: error.message || 'NEURAL AUTHENTICATION FAILED',
            isLoading: false,
            isAuthenticated: false
          })
          throw error
        }
      },

      register: async (candidateData: RegisterData) => {
        set({ isLoading: true, error: null })
        
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        try {
          // Basic validation
          if (!candidateData.email || !candidateData.password || !candidateData.first_name || !candidateData.last_name) {
            throw new Error('NEURAL REGISTRATION FAILED - All fields required')
          }
          
          if (candidateData.password !== candidateData.password_confirmation) {
            throw new Error('NEURAL SYNC ERROR - Password confirmation mismatch')
          }

          const mockCandidate: Candidate = {
            id: Math.floor(Math.random() * 10000),
            candidate_id: 'NEURAL_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            email: candidateData.email,
            first_name: candidateData.first_name,
            last_name: candidateData.last_name,
            full_name: `${candidateData.first_name} ${candidateData.last_name}`,
            experience_level: candidateData.experience_level,
            status: 'active',
            total_score: 0,
            current_level: 'Level 1',
            completion_rate: 0,
            achievements: [],
            last_login_at: new Date().toISOString()
          }
          
          const mockToken = 'neural_link_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
          
          set({
            candidate: mockCandidate,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            error: error.message || 'NEURAL WARRIOR INITIALIZATION FAILED',
            isLoading: false,
            isAuthenticated: false
          })
          throw error
        }
      },

      logout: () => {
        set({
          candidate: null,
          token: null,
          isAuthenticated: false,
          error: null
        })
      },

      refreshToken: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await authApi.refreshToken()
          const { token: newToken } = response.data
          
          set({ token: newToken })
        } catch (error) {
          // If refresh fails, logout the user
          get().logout()
        }
      },

      clearError: () => {
        set({ error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        candidate: state.candidate,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)


