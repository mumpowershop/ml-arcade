class Api::V1::ChallengesController < ApplicationController
  before_action :set_challenge, only: [:show, :instructions, :start, :submit, :evaluation]

  def index
    @challenges = Challenge.active.includes(:challenge_attempts)

    # Filter by difficulty
    @challenges = @challenges.by_difficulty(params[:difficulty]) if params[:difficulty]

    # Filter by category
    @challenges = @challenges.by_category(params[:category]) if params[:category]

    # Search by title or description
    if params[:search]
      @challenges = @challenges.where(
        "title ILIKE ? OR description ILIKE ?",
        "%#{params[:search]}%", "%#{params[:search]}%"
      )
    end

    challenges_data = @challenges.map do |challenge|
      challenge_data(challenge)
    end

    render_success(challenges_data, 'Challenges retrieved successfully')
  end

  def show
    render_success(challenge_data(@challenge), 'Challenge retrieved successfully')
  end

  def instructions
    render_success({
      title: @challenge.title,
      description: @challenge.description,
      instructions: @challenge.instructions,
      difficulty: @challenge.difficulty,
      category: @challenge.category,
      time_limit: @challenge.time_limit,
      max_score: @challenge.max_score,
      skills_tested: @challenge.skills_tested,
      prerequisites: @challenge.prerequisites,
      estimated_time: @challenge.estimated_time
    }, 'Challenge instructions retrieved successfully')
  end

  def start
    # Check if candidate already has an attempt for this challenge
    existing_attempt = @current_candidate.challenge_attempts
                                       .where(challenge: @challenge)
                                       .where(status: [:started, :in_progress])
                                       .first

    if existing_attempt
      return render_success({
        attempt_id: existing_attempt.id,
        status: existing_attempt.status,
        started_at: existing_attempt.started_at,
        time_remaining: existing_attempt.time_remaining
      }, 'Existing attempt found')
    end

    # Create new attempt
    @attempt = @current_candidate.challenge_attempts.build(
      challenge: @challenge,
      status: :started
    )

    if @attempt.save
      render_success({
        attempt_id: @attempt.id,
        status: @attempt.status,
        started_at: @attempt.started_at,
        time_remaining: @attempt.time_remaining,
        starter_code: @challenge.starter_code
      }, 'Challenge started successfully')
    else
      render_error('Failed to start challenge')
    end
  end

  def submit
    @attempt = @current_candidate.challenge_attempts
                                .where(challenge: @challenge)
                                .where(status: [:started, :in_progress])
                                .first

    unless @attempt
      return render_error('No active attempt found for this challenge')
    end

    if @attempt.is_expired?
      @attempt.update(status: :failed)
      return render_error('Challenge time limit exceeded')
    end

    # Update attempt with submitted code
    @attempt.update(
      submitted_code: submit_params[:code],
      status: :completed
    )

    # Queue evaluation job
    EvaluateChallengeAttemptJob.perform_later(@attempt.id)

    render_success({
      attempt_id: @attempt.id,
      status: @attempt.status,
      submitted_at: @attempt.completed_at,
      duration_minutes: @attempt.duration_minutes
    }, 'Challenge submitted successfully. Evaluation in progress.')
  end

  def evaluation
    @attempt = @current_candidate.challenge_attempts
                                .where(challenge: @challenge)
                                .order(created_at: :desc)
                                .first

    unless @attempt
      return render_error('No attempt found for this challenge')
    end

    evaluation_data = {
      attempt_id: @attempt.id,
      status: @attempt.status,
      score: @attempt.score,
      performance_rating: @attempt.performance_rating,
      duration_minutes: @attempt.duration_minutes,
      submitted_at: @attempt.completed_at
    }

    if @attempt.completed?
      evaluation_data.merge!({
        code_quality_score: @attempt.code_quality_score,
        ml_knowledge_score: @attempt.ml_knowledge_score,
        problem_solving_score: @attempt.problem_solving_score,
        engineering_score: @attempt.engineering_score,
        feedback_summary: @attempt.feedback_summary,
        detailed_feedback: @attempt.detailed_feedback
      })
    end

    render_success(evaluation_data, 'Evaluation retrieved successfully')
  end

  private

  def set_challenge
    @challenge = Challenge.active.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error('Challenge not found', :not_found)
  end

  def submit_params
    params.require(:challenge).permit(:code)
  end

  def challenge_data(challenge)
    {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      category: challenge.category,
      time_limit: challenge.time_limit,
      max_score: challenge.max_score,
      skills_tested: challenge.skills_tested,
      prerequisites: challenge.prerequisites,
      estimated_time: challenge.estimated_time,
      average_score: challenge.average_score,
      completion_rate: challenge.completion_rate,
      average_completion_time: challenge.average_completion_time,
      tags: challenge.tags
    }
  end
end


