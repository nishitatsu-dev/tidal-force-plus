require "application_system_test_case"

class RecordsTest < ApplicationSystemTestCase
  test "メモの新規作成" do
    sign_in_as(users(:alice))
    fill_in "calc_condition_form[first_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモの表示更新"
    within "#records" do
      assert_text "alice's memo"
    end

    find('[aria-label="１時間ごとの数値データとメモ"]').first('[aria-label="メモを新規作成する"]').click
    has_field?("record[column_0]", type: "number")
    fill_in "record[column_0]", with: 0
    fill_in "record[column_1]", with: 1
    fill_in "record[column_2]", with: 2
    fill_in "record[column_3]", with: 3
    fill_in "record[column_4]", with: 4
    fill_in "record[column_5]", with: 5
    fill_in "record[memo]", with: "晴れのち曇り"
    click_on "更新"
    has_no_field?("record[column_0]", type: "number")

    within "#records" do
      assert_text "晴れのち曇り"
    end
  end

  test "メモの編集" do
    sign_in_as(users(:alice))
    fill_in "calc_condition_form[first_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモの表示更新"
    within "#records" do
      assert_text "alice's memo"
    end

    find('[aria-label="１時間ごとの数値データとメモ"]').first('[aria-label="メモを編集する"]').click
    has_field?("record[column_0]", type: "number")
    fill_in "record[memo]", with: "雨"
    click_on "更新"
    has_no_field?("record[column_0]", type: "number")

    within "#records" do
      assert_text "雨"
    end
  end

  test "メモの削除" do
    sign_in_as(users(:alice))
    fill_in "calc_condition_form[first_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "calc_condition_form[last_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモの表示更新"
    within "#records" do
      assert_text "alice's memo"
    end

    find('[aria-label="１時間ごとの数値データとメモ"]').first('[aria-label="メモを削除する"]').click
    has_text?("本当に削除しますか？")
    click_on "OK"
    has_no_text?("本当に削除しますか？")

    within "#records" do
      assert_no_text "alice's memo"
    end
  end
end
