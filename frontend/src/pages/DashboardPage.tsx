import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { challengesApi } from '../services/api'
import { 
  Code, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  Award,
  ArrowRight,
  Brain,
  Zap
} from 'lucide-react'
import { LoadingSpinner } from '../components/LoadingSpinner'

interface Challenge {
  id: number
  title: string
  description: string
  difficulty: string
  category: string
  time_limit: number
  max_score: number
  skills_tested: string[]
  average_score: number
  completion_rate: number
  tags: string[]
}

export const DashboardPage: React.FC = () => {
  const { candidate } = useAuthStore()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await challengesApi.getAll()
        setChallenges(response.data.data.slice(0, 6)) // Show first 6 challenges
      } catch (error) {
        console.error('Failed to fetch challenges:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChallenges()
  }, [])

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

  const stats = [
    {
      name: 'Total Score',
      value: candidate?.total_score || 0,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Completion Rate',
      value: `${candidate?.completion_rate || 0}%`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Current Level',
      value: candidate?.current_level || 'Beginner',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Achievements',
      value: candidate?.achievements?.length || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {candidate?.first_name}! 👋
        </h1>
        <p className="text-primary-100">
          Ready to continue your ML engineering journey? Let's tackle some challenges!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Challenges */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Featured Challenges</h2>
            <Link
              to="/challenges"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {challenges.slice(0, 3).map((challenge) => {
              const Icon = getCategoryIcon(challenge.category)
              return (
                <div key={challenge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Icon className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {challenge.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {challenge.difficulty} • {challenge.time_limit} min
                    </p>
                  </div>
                  <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Achievements</h2>
            <Award className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {candidate?.achievements && candidate.achievements.length > 0 ? (
              candidate.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-1 bg-yellow-100 rounded-full">
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="text-sm text-gray-900">{achievement}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Award className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Complete challenges to earn achievements!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Challenges Preview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Challenges</h2>
          <Link
            to="/challenges"
            className="btn btn-primary btn-md flex items-center"
          >
            View All Challenges
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const Icon = getCategoryIcon(challenge.category)
            return (
              <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Icon className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{challenge.max_score} pts</p>
                    <p className="text-xs text-gray-500">{challenge.time_limit} min</p>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{challenge.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {challenge.skills_tested.slice(0, 2).map((skill, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                    {challenge.skills_tested.length > 2 && (
                      <span className="text-xs text-gray-500">+{challenge.skills_tested.length - 2} more</span>
                    )}
                  </div>
                  <Link
                    to={`/challenges/${challenge.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Start →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


