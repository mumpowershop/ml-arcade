class ChallengeAttempt < ApplicationRecord
  belongs_to :candidate
  belongs_to :challenge

  validates :status, presence: true, inclusion: { in: %w[started in_progress completed failed] }
  validates :score, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }, allow_nil: true

  enum status: { started: 0, in_progress: 1, completed: 2, failed: 3 }

  scope :completed, -> { where(status: :completed) }
  scope :in_progress, -> { where(status: [:started, :in_progress]) }
  scope :recent, -> { order(created_at: :desc) }

  before_create :set_started_at
  before_update :set_completed_at, if: :status_changed_to_completed?

  def duration_minutes
    return nil unless started_at && (completed_at || Time.current)

    end_time = completed_at || Time.current
    ((end_time - started_at) / 60.0).round(2)
  end

  def time_remaining
    return nil unless started_at

    elapsed = Time.current - started_at
    remaining = challenge.time_limit * 60 - elapsed
    [remaining, 0].max
  end

  def is_expired?
    return false unless started_at

    Time.current - started_at > challenge.time_limit * 60
  end

  def progress_percentage
    return 0 unless challenge.time_limit

    elapsed = Time.current - started_at
    [(elapsed / (challenge.time_limit * 60)) * 100, 100].min.round(2)
  end

  def performance_rating
    return 'Not Rated' unless score

    case score
    when 90..100
      'Excellent'
    when 80..89
      'Very Good'
    when 70..79
      'Good'
    when 60..69
      'Satisfactory'
    when 50..59
      'Needs Improvement'
    else
      'Poor'
    end
  end

  def code_quality_score
    return nil unless evaluation_results

    results = JSON.parse(evaluation_results)
    results['code_quality_score'] || 0
  rescue JSON::ParserError
    0
  end

  def ml_knowledge_score
    return nil unless evaluation_results

    results = JSON.parse(evaluation_results)
    results['ml_knowledge_score'] || 0
  rescue JSON::ParserError
    0
  end

  def problem_solving_score
    return nil unless evaluation_results

    results = JSON.parse(evaluation_results)
    results['problem_solving_score'] || 0
  rescue JSON::ParserError
    0
  end

  def engineering_score
    return nil unless evaluation_results

    results = JSON.parse(evaluation_results)
    results['engineering_score'] || 0
  rescue JSON::ParserError
    0
  end

  def feedback_summary
    return 'No feedback available' unless evaluation_results

    results = JSON.parse(evaluation_results)
    results['feedback_summary'] || 'No feedback available'
  rescue JSON::ParserError
    'No feedback available'
  end

  def detailed_feedback
    return {} unless evaluation_results

    JSON.parse(evaluation_results)
  rescue JSON::ParserError
    {}
  end

  private

  def set_started_at
    self.started_at = Time.current
  end

  def set_completed_at
    self.completed_at = Time.current
  end

  def status_changed_to_completed?
    status == 'completed' && status_was != 'completed'
  end
end


