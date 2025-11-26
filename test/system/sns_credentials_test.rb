require "application_system_test_case"

class SnsCredentialsTest < ApplicationSystemTestCase
  setup do
    set_env_omniauth
  end

  test "signs in by existing user with Google OAuth" do
    sign_in_as(users(:bob))
    assert_selector "p.notice", text: "Google アカウントによる認証に成功しました。"
  end

  test "signs in by new user with Google OAuth" do
    sign_in_as_new_user
    assert_selector "p.notice", text: "Google アカウントによる認証に成功しました。"
  end

  test "signs out" do
    sign_in_as(users(:bob))
    accept_confirm do
      click_on "ログアウト"
    end
    assert_selector "p.notice", text: "ログアウトしました。"
  end
end
