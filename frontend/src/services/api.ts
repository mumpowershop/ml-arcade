import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await useAuthStore.getState().refreshToken()
        const token = useAuthStore.getState().token
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', { candidate: credentials }),

  register: (candidateData: any) =>
    api.post('/auth/register', { candidate: candidateData }),

  refreshToken: () =>
    api.post('/auth/refresh'),

  logout: () =>
    api.delete('/auth/logout'),
}

export const challengesApi = {
  getAll: (params?: { difficulty?: string; category?: string; search?: string }) =>
    api.get('/challenges', { params }),

  getById: (id: string) =>
    api.get(`/challenges/${id}`),

  getInstructions: (id: string) =>
    api.get(`/challenges/${id}/instructions`),

  start: (id: string) =>
    api.post(`/challenges/${id}/start`),

  submit: (id: string, code: string) =>
    api.post(`/challenges/${id}/submit`, { challenge: { code } }),

  getEvaluation: (id: string) =>
    api.get(`/challenges/${id}/evaluation`),
}

export const challengeAttemptsApi = {
  create: (data: any) =>
    api.post('/challenge_attempts', data),

  getById: (id: string) =>
    api.get(`/challenge_attempts/${id}`),

  update: (id: string, data: any) =>
    api.patch(`/challenge_attempts/${id}`, data),

  evaluate: (id: string) =>
    api.post(`/challenge_attempts/${id}/evaluate`),

  getResults: (id: string) =>
    api.get(`/challenge_attempts/${id}/results`),
}

export const candidatesApi = {
  getProfile: () =>
    api.get('/candidates/profile'),

  updateProfile: (data: any) =>
    api.patch('/candidates', data),

  getProgress: () =>
    api.get('/candidates/progress'),
}

export const leaderboardApi = {
  getGlobal: () =>
    api.get('/leaderboard'),

  getByChallenge: (challengeId: string) =>
    api.get(`/leaderboard/${challengeId}`),
}

export const adminApi = {
  getDashboard: () =>
    api.get('/admin/dashboard'),

  getCandidates: () =>
    api.get('/admin/candidates'),

  getCandidate: (id: string) =>
    api.get(`/admin/candidates/${id}`),

  getCandidateAnalytics: (id: string) =>
    api.get(`/admin/candidates/${id}/analytics`),

  getCandidateReport: (id: string) =>
    api.get(`/admin/candidates/${id}/report`),

  createChallenge: (data: any) =>
    api.post('/admin/challenges', data),

  updateChallenge: (id: string, data: any) =>
    api.patch(`/admin/challenges/${id}`, data),

  deleteChallenge: (id: string) =>
    api.delete(`/admin/challenges/${id}`),
}

export default api


