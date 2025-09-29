class HealthController < ApplicationController
  skip_before_action :authenticate_candidate, only: [:check]

  def check
    render json: {
      status: 'healthy',
      timestamp: Time.current,
      version: '1.0.0',
      database: database_status,
      services: {
        authentication: 'ok',
        challenges: 'ok',
        evaluation: 'ok'
      }
    }
  end

  private

  def database_status
    ActiveRecord::Base.connection.active? ? 'connected' : 'disconnected'
  rescue => e
    'error'
  end
end


