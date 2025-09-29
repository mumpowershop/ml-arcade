import React, { useEffect, useState } from 'react'
import { leaderboardApi } from '../services/api'
import { Trophy, Medal, Award, Crown, Target, TrendingUp } from 'lucide-react'
import { LoadingSpinner } from '../components/LoadingSpinner'

interface LeaderboardEntry {
  rank: number
  candidate_id: string
  full_name: string
  total_score: number
  completion_rate: number
  current_level: string
  achievements: string[]
}

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardApi.getGlobal()
        setLeaderboard(response.data.data)
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        </div>
        <p className="text-gray-600">
          See how you rank against other ML engineering candidates
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 2nd Place */}
          <div className="order-2 md:order-1">
            <div className="card p-6 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <div className="flex justify-center mb-4">
                <Medal className="h-12 w-12 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-600 mb-2">#2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {leaderboard[1]?.full_name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {leaderboard[1]?.candidate_id}
              </p>
              <div className="text-2xl font-bold text-gray-800">
                {leaderboard[1]?.total_score} pts
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {leaderboard[1]?.completion_rate}% completion
              </div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="order-1 md:order-2">
            <div className="card p-6 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Crown className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="flex justify-center mb-4 mt-2">
                <Trophy className="h-16 w-16 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">#1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {leaderboard[0]?.full_name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {leaderboard[0]?.candidate_id}
              </p>
              <div className="text-3xl font-bold text-yellow-700">
                {leaderboard[0]?.total_score} pts
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {leaderboard[0]?.completion_rate}% completion
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3">
            <div className="card p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-2">#3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {leaderboard[2]?.full_name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {leaderboard[2]?.candidate_id}
              </p>
              <div className="text-2xl font-bold text-orange-700">
                {leaderboard[2]?.total_score} pts
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {leaderboard[2]?.completion_rate}% completion
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Full Rankings</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            <span>Updated in real-time</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Achievements
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <tr key={entry.candidate_id} className={`${getRankColor(entry.rank)} hover:bg-gray-50`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {entry.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.candidate_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-primary-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {entry.total_score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge badge-primary">
                      {entry.current_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${entry.completion_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {entry.completion_rate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {entry.achievements.slice(0, 2).map((achievement, idx) => (
                        <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {achievement}
                        </span>
                      ))}
                      {entry.achievements.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{entry.achievements.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rankings yet</h3>
            <p className="text-gray-500">
              Complete some challenges to appear on the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


