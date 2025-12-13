Rails.application.routes.draw do
  root "home#new"
  resources :home, only: [ :index, :new ] do
    member do
      get :memo_index
      get :memo_new
    end
  end
  get "about/index"
  get "privacy/index"
  get "terms/index"
  resources :record_titles do
    member do
      get :confirm_destroy
    end
  end
  resources :records do
    member do
      get :confirm_destroy
    end
  end
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

  # letter_opener_webの設定
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
