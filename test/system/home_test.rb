require "application_system_test_case"

class HomeTest < ApplicationSystemTestCase
  test "ログイン後、初回計算実行前はテーブルを表示しない（日付未設定のメモ欄が表示されるのを防ぐ為）" do
    sign_in_as(users(:alice))
    assert_no_table "calcResults"
    click_button "グラフ・表・メモを更新"
    assert_table "calcResults"
  end

  test "ホームページからログインできる" do
    set_omniauth_test_config
    set_mock_as(users(:alice))
    visit root_path
    click_on "google_oauth2"
    assert_selector "p.notice", text: "Google アカウントでログインしました。"
  end
end
