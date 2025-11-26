module SignInHelper
  def set_env_omniauth
    Rails.application.env_config["devise.mapping"] = Devise.mappings[:user]
    Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[:google_oauth2]
  end

  def sign_in_as(user)
    OmniAuth.config.test_mode = true
    OmniAuth.config.add_mock(
      user.sns_credentials.find_by(provider: "google_oauth2").provider,
      uid: user.sns_credentials.find_by(provider: "google_oauth2").uid,
      info: {
        email: user.email
      }
    )
    visit new_user_session_path
    click_on "google_oauth2"
  end

  def sign_in_as_new_user
    OmniAuth.config.test_mode = true
    OmniAuth.config.mock_auth[:google_oauth2] = google_oauth2_mock
    visit new_user_session_path
    click_on "google_oauth2"
  end

  private

  def google_oauth2_mock
    OmniAuth::AuthHash.new({
      provider: "google_oauth2",
      uid: "12345678910",
      info: {
        email: "new-user@example.com"
      }
    })
  end
end
