require "application_system_test_case"

class HomeTest < ApplicationSystemTestCase
  test "ログイン後、初回計算実行前はテーブルを表示しない（日付未設定のメモ欄が表示されるのを防ぐ為）" do
    sign_in_as(users(:alice))
    assert_no_table "calcResults"
    click_button "計算実行"
    assert_table "calcResults"
  end
end
