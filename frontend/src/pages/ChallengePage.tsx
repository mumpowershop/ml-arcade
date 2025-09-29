import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { challengesApi } from '../services/api'
import { 
  Code, 
  Clock, 
  Target, 
  Play, 
  CheckCircle,
  AlertCircle,
  Brain,
  Zap,
  Award
} from 'lucide-react'
import { LoadingSpinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface Challenge {
  id: number
  title: string
  description: string
  instructions: string
  difficulty: string
  category: string
  time_limit: number
  max_score: number
  skills_tested: string[]
  prerequisites: string[]
  starter_code: string
}

interface ChallengeAttempt {
  id: number
  status: string
  started_at: string
  time_remaining: number
  starter_code: string
}

export const ChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [attempt, setAttempt] = useState<ChallengeAttempt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await challengesApi.getById(id!)
        setChallenge(response.data.data)
      } catch (error) {
        console.error('Failed to fetch challenge:', error)
        toast.error('Failed to load challenge')
      } finally {
        setIsLoading(false)
      }
    }

    fetchChallenge()
  }, [id])

  const handleStartChallenge = async () => {
    setIsStarting(true)
    try {
      const response = await challengesApi.start(id!)
      setAttempt(response.data.data)
      setCode(response.data.data.starter_code || challenge?.starter_code || '')
      toast.success('Challenge started! Good luck!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start challenge')
    } finally {
      setIsStarting(false)
    }
  }

  const handleSubmitChallenge = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting')
      return
    }

    setIsSubmitting(true)
    try {
      await challengesApi.submit(id!, code)
      toast.success('Challenge submitted successfully!')
      navigate('/challenges')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit challenge')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      case 'expert': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data_preprocessing': return Brain
      case 'model_training': return Code
      case 'model_evaluation': return Target
      case 'mlops': return Zap
      default: return Code
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Challenge not found</h3>
        <p className="text-gray-500">The challenge you're looking for doesn't exist.</p>
      </div>
    )
  }

  const Icon = getCategoryIcon(challenge.category)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Challenge Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Icon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
              <p className="text-gray-600">{challenge.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="badge badge-gray">
              {challenge.max_score} points
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{challenge.time_limit} minutes</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Target className="h-4 w-4" />
            <span>{challenge.skills_tested.length} skills tested</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Award className="h-4 w-4" />
            <span>{challenge.category.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instructions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{challenge.instructions}</p>
          </div>

          {/* Skills Tested */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Skills Tested</h3>
            <div className="flex flex-wrap gap-2">
              {challenge.skills_tested.map((skill, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {challenge.prerequisites.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Prerequisites</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {challenge.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Code Editor</h2>
            {attempt && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{attempt.time_remaining} seconds remaining</span>
              </div>
            )}
          </div>

          {!attempt ? (
            <div className="text-center py-12">
              <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to start?</h3>
              <p className="text-gray-500 mb-4">
                Click the button below to begin the challenge. The timer will start immediately.
              </p>
              <button
                onClick={handleStartChallenge}
                disabled={isStarting}
                className="btn btn-primary btn-lg flex items-center mx-auto"
              >
                {isStarting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start Challenge
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write your solution here..."
              />
              <div className="flex justify-between">
                <button
                  onClick={() => navigate('/challenges')}
                  className="btn btn-outline btn-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitChallenge}
                  disabled={isSubmitting || !code.trim()}
                  className="btn btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Submit Solution'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


