import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  BarChart3, 
  Code, 
  Trophy, 
  User, 
  Brain,
  Target,
  Clock,
  Award
} from 'lucide-react'

export const Sidebar: React.FC = () => {
  const { candidate } = useAuthStore()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Challenges', href: '/challenges', icon: Code },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const stats = [
    {
      name: 'Total Score',
      value: candidate?.total_score || 0,
      icon: Target,
      color: 'text-primary-600'
    },
    {
      name: 'Completion Rate',
      value: `${candidate?.completion_rate || 0}%`,
      icon: Clock,
      color: 'text-success-600'
    },
    {
      name: 'Current Level',
      value: candidate?.current_level || 'Beginner',
      icon: Award,
      color: 'text-warning-600'
    }
  ]

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        {/* User info */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{candidate?.full_name}</p>
              <p className="text-xs text-gray-500">ID: {candidate?.candidate_id}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 px-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Progress
          </h3>
          <div className="space-y-3">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.name} className="flex items-center">
                  <Icon className={`h-4 w-4 ${stat.color} mr-2`} />
                  <div>
                    <p className="text-xs text-gray-500">{stat.name}</p>
                    <p className="text-sm font-medium text-gray-900">{stat.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Achievements */}
        {candidate?.achievements && candidate.achievements.length > 0 && (
          <div className="px-4 pb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Achievements
            </h3>
            <div className="space-y-2">
              {candidate.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <Award className="h-3 w-3 text-warning-500 mr-2" />
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


