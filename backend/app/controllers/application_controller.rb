class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate_candidate, except: [:health_check]

  def health_check
    render json: { status: 'ok', timestamp: Time.current }
  end

  private

  def authenticate_candidate
    token = extract_token

    if token
      begin
        decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base, true, { algorithm: 'HS256' })
        candidate_id = decoded_token[0]['candidate_id']
        @current_candidate = Candidate.find(candidate_id)
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { message: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { message: 'Token required' }, status: :unauthorized
    end
  end

  def extract_token
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    auth_header.split(' ').last if auth_header.start_with?('Bearer ')
  end

  def current_candidate
    @current_candidate
  end

  def render_error(message, status = :unprocessable_entity)
    render json: { message: message }, status: status
  end

  def render_success(data = {}, message = 'Success')
    render json: { message: message, data: data }, status: :ok
  end
end


