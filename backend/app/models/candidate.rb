class Candidate < ApplicationRecord
  has_secure_password

  has_many :challenge_attempts, dependent: :destroy
  has_many :challenges, through: :challenge_attempts

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :password, length: { minimum: 8 }, if: -> { new_record? || !password.nil? }

  enum status: { active: 0, completed: 1, suspended: 2 }
  enum experience_level: { junior: 0, mid: 1, senior: 2, expert: 3 }

  before_create :generate_candidate_id

  def full_name
    "#{first_name} #{last_name}"
  end

  def total_score
    challenge_attempts.completed.sum(:score)
  end

  def average_score
    completed_attempts = challenge_attempts.completed
    return 0 if completed_attempts.empty?

    completed_attempts.sum(:score) / completed_attempts.count
  end

  def completion_rate
    total_challenges = Challenge.count
    return 0 if total_challenges.zero?

    (challenge_attempts.completed.count.to_f / total_challenges * 100).round(2)
  end

  def current_level
    case total_score
    when 0..100
      'Beginner'
    when 101..300
      'Intermediate'
    when 301..500
      'Advanced'
    else
      'Expert'
    end
  end

  def achievements
    achievements = []

    achievements << 'First Challenge' if challenge_attempts.completed.any?
    achievements << 'Perfect Score' if challenge_attempts.completed.exists?(score: 100)
    achievements << 'Speed Demon' if challenge_attempts.completed.where('completed_at - started_at < ?', 30.minutes).any?
    achievements << 'ML Master' if total_score > 500

    achievements
  end

  private

  def generate_candidate_id
    self.candidate_id = SecureRandom.alphanumeric(8).upcase
  end
end


