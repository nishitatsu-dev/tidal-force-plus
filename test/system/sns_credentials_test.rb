require "application_system_test_case"

class SnsCredentialsTest < ApplicationSystemTestCase
  test "新規ユーザは、サインインと同時にアカウントが生成される" do
    set_omniauth_test_config
    set_mock_as_new_user
    visit new_user_session_path
    assert_difference("User.count", 1) do
      click_on "google_oauth2"
    end
    assert_selector "p.notice", text: "Google アカウントでログインしました。"
  end
end
