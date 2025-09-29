class Challenge < ApplicationRecord
  has_many :challenge_attempts, dependent: :destroy
  has_many :candidates, through: :challenge_attempts

  validates :title, presence: true
  validates :description, presence: true
  validates :difficulty, presence: true, inclusion: { in: %w[easy medium hard expert] }
  validates :category, presence: true, inclusion: { in: %w[data_preprocessing model_training model_evaluation mlops problem_solving] }
  validates :max_score, presence: true, numericality: { greater_than: 0 }
  validates :time_limit, presence: true, numericality: { greater_than: 0 }

  enum status: { draft: 0, active: 1, archived: 2 }

  scope :by_difficulty, ->(level) { where(difficulty: level) }
  scope :by_category, ->(cat) { where(category: cat) }
  scope :active, -> { where(status: :active) }

  def average_completion_time
    completed_attempts = challenge_attempts.completed
    return 0 if completed_attempts.empty?

    total_time = completed_attempts.sum do |attempt|
      (attempt.completed_at - attempt.started_at) / 60.0 # in minutes
    end

    (total_time / completed_attempts.count).round(2)
  end

  def average_score
    completed_attempts = challenge_attempts.completed
    return 0 if completed_attempts.empty?

    (completed_attempts.sum(:score) / completed_attempts.count.to_f).round(2)
  end

  def completion_rate
    total_attempts = challenge_attempts.count
    return 0 if total_attempts.zero?

    (challenge_attempts.completed.count.to_f / total_attempts * 100).round(2)
  end

  def difficulty_multiplier
    case difficulty
    when 'easy'
      1.0
    when 'medium'
      1.5
    when 'hard'
      2.0
    when 'expert'
      3.0
    end
  end

  def estimated_time
    "#{time_limit} minutes"
  end

  def skills_tested
    case category
    when 'data_preprocessing'
      ['Data Cleaning', 'Feature Engineering', 'Data Validation', 'Pandas/NumPy']
    when 'model_training'
      ['Algorithm Selection', 'Hyperparameter Tuning', 'Cross Validation', 'Scikit-learn']
    when 'model_evaluation'
      ['Metrics Selection', 'Model Interpretation', 'Bias Detection', 'Statistical Analysis']
    when 'mlops'
      ['Model Deployment', 'Monitoring', 'CI/CD', 'Containerization']
    when 'problem_solving'
      ['Debugging', 'Optimization', 'System Design', 'Troubleshooting']
    end
  end

  def prerequisites
    case difficulty
    when 'easy'
      ['Basic Python', 'Pandas fundamentals']
    when 'medium'
      ['Intermediate Python', 'ML basics', 'Scikit-learn']
    when 'hard'
      ['Advanced Python', 'Deep Learning', 'MLOps concepts']
    when 'expert'
      ['Expert Python', 'Production ML', 'System Architecture']
    end
  end
end


