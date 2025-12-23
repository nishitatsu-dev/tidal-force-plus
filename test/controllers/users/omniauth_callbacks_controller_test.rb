require "test_helper"

class Users::OmniauthCallbacksControllerTest < ActionDispatch::IntegrationTest
  include SignInHelper

  setup do
    set_omniauth_test_config
  end

  test "サインイン（google認証）" do
    set_mock_as(users(:alice))

    assert_difference("User.count", 0) do
      get user_google_oauth2_omniauth_callback_path
    end
    assert_redirected_to memo_new_home_path(users(:alice))
    assert_includes flash[:notice], "Google アカウントでログインしました。"
  end

  test "サインアウト" do
    set_mock_as(users(:alice))
    get user_google_oauth2_omniauth_callback_path
    assert_includes flash[:notice], "Google アカウントでログインしました。"

    delete destroy_user_session_path
    assert_redirected_to root_path
    assert_includes flash[:notice], "ログアウトしました。"
  end
end
