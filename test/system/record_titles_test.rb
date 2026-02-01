require "application_system_test_case"

class RecordsTest < ApplicationSystemTestCase
  test "タイトルの初期値からの変更" do
    sign_in_as(users(:alice))
    click_button "グラフ・表・メモの表示更新"
    assert_text "alice's title 1"

    find('[aria-label="各数値データのタイトル"]').first('[aria-label="タイトルを初期値から変更する"]').click
    has_field?("record_title[title]")
    fill_in "record_title[title]", with: "ケナフ2"
    click_on "更新"
    has_no_field?("record_title[title]")

    assert_text "ケナフ2"
  end

  test "タイトルの編集" do
    sign_in_as(users(:alice))
    click_button "グラフ・表・メモの表示更新"
    assert_text "alice's title 1"

    find('[aria-label="各数値データのタイトル"]').first('[aria-label="タイトルを編集する"]').click
    has_field?("record_title[title]")
    fill_in "record_title[title]", with: "ケナフ1"
    click_on "更新"
    has_no_field?("record_title[title]")

    assert_no_text "alice's title 1"
    assert_text "ケナフ1"
  end

  test "タイトルのリセット" do
    sign_in_as(users(:alice))
    click_button "グラフ・表・メモの表示更新"
    assert_text "alice's title 1"

    find('[aria-label="各数値データのタイトル"]').first('[aria-label="タイトルをリセットする"]').click
    has_text?("本当に削除しますか？")
    click_on "OK"
    has_no_text?("本当に削除しますか？")

    assert_no_text "alice's title 1"
  end
end
