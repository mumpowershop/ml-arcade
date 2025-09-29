require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module MlInterviewPlatform
  class Application < Rails::Application
    config.load_defaults 7.0

    # API only configuration
    config.api_only = true

    # CORS configuration
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head]
      end
    end

    # Time zone
    config.time_zone = 'UTC'

    # Active Job
    config.active_job.queue_adapter = :sidekiq
  end
end


