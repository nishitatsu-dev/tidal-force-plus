module SignInHelper
  def set_omniauth_test_config
    OmniAuth.config.test_mode = true
    Rails.application.env_config["devise.mapping"] = Devise.mappings[:user]
    Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[:google_oauth2]
  end

  def sign_in_as(user)
    set_omniauth_test_config
    set_mock_as(user)
    visit new_user_session_path
    click_on "google_oauth2"
  end

  def set_mock_as(user)
    OmniAuth.config.add_mock(
      user.sns_credentials.find_by(provider: "google_oauth2").provider,
      uid: user.sns_credentials.find_by(provider: "google_oauth2").uid,
      info: {
        email: user.email
      }
    )
  end

  def set_mock_as_new_user
    OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new({
      provider: "google_oauth2",
      uid: "12345678910",
      info: {
        email: "new-user@example.com"
      }
    })
  end
end
