Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Authentication
      post 'auth/login', to: 'authentication#login'
      post 'auth/register', to: 'authentication#register'
      post 'auth/refresh', to: 'authentication#refresh'
      delete 'auth/logout', to: 'authentication#logout'

      # Candidates
      resources :candidates, only: [:show, :update] do
        member do
          get :profile
          get :progress
        end
      end

      # Challenges
      resources :challenges, only: [:index, :show] do
        member do
          get :instructions
          post :start
          post :submit
          get :evaluation
        end
      end

      # Challenge Attempts
      resources :challenge_attempts, only: [:create, :show, :update] do
        member do
          post :evaluate
          get :results
        end
      end

      # Leaderboard
      get 'leaderboard', to: 'leaderboard#index'
      get 'leaderboard/:challenge_id', to: 'leaderboard#show'

      # Analytics (Admin only)
      namespace :admin do
        resources :candidates, only: [:index, :show] do
          member do
            get :analytics
            get :report
          end
        end
        resources :challenges, only: [:create, :update, :destroy]
        get 'dashboard', to: 'dashboard#index'
      end
    end
  end

  # Health check
  get 'health', to: 'health#check'
end


