require "application_system_test_case"

class RecordsTest < ApplicationSystemTestCase
  test "タイトルの初期値からの変更" do
    sign_in_as(users(:alice))
    click_button "グラフ・表・メモの表示更新"
    within 'div[aria-label="各数値データのタイトル"] turbo-frame#record_title_1' do
      assert_text "No.2"
    end

    find('[aria-label="各数値データのタイトル"]').find("#record_title_1").find('[aria-label="タイトルを初期値から変更する"]').click
    has_field?("record_title[title]")
    fill_in "record_title[title]", with: "ケナフ2"
    click_on "更新"
    has_no_field?("record_title[title]")

    within 'div[aria-label="各数値データのタイトル"] turbo-frame#record_title_1' do
      assert_text "ケナフ2"
    end
  end

  test "タイトルの編集" do
    sign_in_as(users(:alice))
    click_button "グラフ・表・メモの表示更新"
    within 'div[aria-label="各数値データのタイトル"] turbo-frame#record_title_0' do
      assert_text "alice's title 1"
    end

    find('[aria-label="各数値データのタイトル"]').find("#record_title_0").find('[aria-label="タイトルを編集する"]').click
    has_field?("record_title[title]")
    fill_in "record_title[title]", with: "ケナフ1"
    click_on "更新"
    has_no_field?("record_title[title]")

    within 'div[aria-label="各数値データのタイトル"] turbo-frame#record_title_0' do
      assert_text "ケナフ1"
    end
  end

  test "タイトルのリセット" do
    sign_in_as(users(:alice))
    click_button "グラフ・表・メモの表示更新"
    within 'div[aria-label="各数値データのタイトル"] turbo-frame#record_title_0' do
      assert_text "alice's title 1"
    end

    find('[aria-label="各数値データのタイトル"]').find("#record_title_0").find('[aria-label="タイトルをリセットする"]').click
    has_text?("本当にリセットしますか？")
    click_on "OK"
    has_no_text?("本当にリセットしますか？")

    within 'div[aria-label="各数値データのタイトル"] turbo-frame#record_title_0' do
      assert_text "No.1"
    end
  end
end
