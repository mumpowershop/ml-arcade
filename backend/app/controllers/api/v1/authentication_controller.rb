class Api::V1::AuthenticationController < ApplicationController
  before_action :authenticate_candidate, only: [:logout, :refresh]

  def register
    @candidate = Candidate.new(candidate_params)

    if @candidate.save
      token = generate_token(@candidate)
      render json: {
        message: 'Registration successful',
        candidate: candidate_response(@candidate),
        token: token
      }, status: :created
    else
      render json: {
        message: 'Registration failed',
        errors: @candidate.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def login
    @candidate = Candidate.find_by(email: login_params[:email])

    if @candidate&.authenticate(login_params[:password])
      @candidate.update(last_login_at: Time.current)
      token = generate_token(@candidate)

      render json: {
        message: 'Login successful',
        candidate: candidate_response(@candidate),
        token: token
      }, status: :ok
    else
      render json: {
        message: 'Invalid email or password'
      }, status: :unauthorized
    end
  end

  def refresh
    token = generate_token(@current_candidate)

    render json: {
      message: 'Token refreshed',
      token: token
    }, status: :ok
  end

  def logout
    # In a real application, you might want to blacklist the token
    render json: {
      message: 'Logout successful'
    }, status: :ok
  end

  private

  def candidate_params
    params.require(:candidate).permit(
      :email, :password, :password_confirmation,
      :first_name, :last_name, :phone, :bio,
      :linkedin_url, :github_url, :portfolio_url,
      :experience_level, :preferences
    )
  end

  def login_params
    params.require(:candidate).permit(:email, :password)
  end

  def generate_token(candidate)
    JWT.encode(
      {
        candidate_id: candidate.id,
        email: candidate.email,
        exp: 24.hours.from_now.to_i
      },
      Rails.application.secrets.secret_key_base
    )
  end

  def candidate_response(candidate)
    {
      id: candidate.id,
      candidate_id: candidate.candidate_id,
      email: candidate.email,
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      full_name: candidate.full_name,
      experience_level: candidate.experience_level,
      status: candidate.status,
      total_score: candidate.total_score,
      current_level: candidate.current_level,
      completion_rate: candidate.completion_rate,
      achievements: candidate.achievements,
      last_login_at: candidate.last_login_at
    }
  end
end


