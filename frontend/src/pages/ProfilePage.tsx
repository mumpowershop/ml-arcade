import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { candidatesApi } from '../services/api'
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin,
  Award,
  Target,
  TrendingUp,
  Clock,
  Edit,
  Save,
  X
} from 'lucide-react'
import { LoadingSpinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface CandidateProfile {
  id: number
  candidate_id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  bio: string
  linkedin_url: string
  github_url: string
  portfolio_url: string
  experience_level: string
  total_score: number
  current_level: string
  completion_rate: number
  achievements: string[]
  last_login_at: string
}

export const ProfilePage: React.FC = () => {
  const { candidate, logout } = useAuthStore()
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    experience_level: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await candidatesApi.getProfile()
        const profileData = response.data.data
        setProfile(profileData)
        setEditData({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          linkedin_url: profileData.linkedin_url || '',
          github_url: profileData.github_url || '',
          portfolio_url: profileData.portfolio_url || '',
          experience_level: profileData.experience_level
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
      linkedin_url: profile?.linkedin_url || '',
      github_url: profile?.github_url || '',
      portfolio_url: profile?.portfolio_url || '',
      experience_level: profile?.experience_level || ''
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await candidatesApi.updateProfile(editData)
      setProfile(prev => prev ? { ...prev, ...editData } : null)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  const experienceLevels = [
    { value: 'junior', label: 'Junior (0-2 years)' },
    { value: 'mid', label: 'Mid-level (2-5 years)' },
    { value: 'senior', label: 'Senior (5-8 years)' },
    { value: 'expert', label: 'Expert (8+ years)' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
        <p className="text-gray-500">Unable to load your profile information.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-gray-600">ID: {profile.candidate_id}</p>
              <p className="text-sm text-gray-500">
                {experienceLevels.find(level => level.value === profile.experience_level)?.label}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="btn btn-outline btn-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary btn-sm"
                >
                  {isSaving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="btn btn-outline btn-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={editData.first_name}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900">{profile.first_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={editData.last_name}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900">{profile.last_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {profile.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {profile.phone || 'Not provided'}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                {isEditing ? (
                  <select
                    name="experience_level"
                    value={editData.experience_level}
                    onChange={handleChange}
                    className="input"
                  >
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {experienceLevels.find(level => level.value === profile.experience_level)?.label}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bio</h2>
            {isEditing ? (
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleChange}
                rows={4}
                className="textarea"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700">
                {profile.bio || 'No bio provided'}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="linkedin_url"
                    value={editData.linkedin_url}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                    {profile.linkedin_url ? (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.linkedin_url}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="github_url"
                    value={editData.github_url}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://github.com/yourusername"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Github className="h-4 w-4 mr-2 text-gray-600" />
                    {profile.github_url ? (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.github_url}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="portfolio_url"
                    value={editData.portfolio_url}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://yourportfolio.com"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-green-600" />
                    {profile.portfolio_url ? (
                      <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.portfolio_url}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Achievements */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Total Score</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{profile.total_score}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{profile.completion_rate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Current Level</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{profile.current_level}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Last Login</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(profile.last_login_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
            {profile.achievements && profile.achievements.length > 0 ? (
              <div className="space-y-2">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Award className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No achievements yet</p>
                <p className="text-xs text-gray-400">Complete challenges to earn achievements!</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = '/challenges'}
                className="w-full btn btn-primary btn-sm"
              >
                View Challenges
              </button>
              <button
                onClick={() => window.location.href = '/leaderboard'}
                className="w-full btn btn-outline btn-sm"
              >
                View Leaderboard
              </button>
              <button
                onClick={() => {
                  logout()
                  window.location.href = '/'
                }}
                className="w-full btn btn-danger btn-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


