require "application_system_test_case"

class HomeTest < ApplicationSystemTestCase
  test "ホームページからログインできる" do
    set_omniauth_test_config
    set_mock_as(users(:alice))
    visit root_path
    find('[aria-label="google_oauth2のログインボタン"]').click
    assert_selector "p.notice", text: "Google アカウントでログインしました。"
  end

  test "ホームページでグラフの表示枠がある" do
    visit root_path
    within "section[aria-label='起潮力(垂直方向)と木星との距離のグラフ']" do
      assert_selector "div#chart_vertical"
      assert_selector "canvas"
    end
    within "section[aria-label='起潮力(水平方向)の強さと方位角のグラフ']" do
      find("summary", text: "起潮力(水平方向) の｢強さ｣と｢方位角｣").click
      assert_selector "div#chart_horizontal"
      assert_selector "canvas"
    end
  end

  test "ホームページで、各計算結果の表が表示される" do
    visit root_path
    click_button "グラフ・表の表示更新"

    within "table#calcResults tbody tr:first-of-type" do
      assert_selector "td", count: 9
    end
  end

  test "「表示更新」した後、フォームの入力値がリセットされずに残る" do
    # 日付は、ある程度時間が経つとリセットするが、ここではテストしない（テスト動作が不安定な為）
    visit root_path
    next_locations = calc_next_locations
    date_after_first_date = calc_tomorrow("first_date")
    date_after_last_date = calc_tomorrow("last_date")

    select next_locations[:text], from: "calc_condition_form[location]"
    fill_in "calc_condition_form[first_date]", with: date_after_first_date.strftime("%Y/%m/%d")
    fill_in "calc_condition_form[last_date]", with: date_after_last_date.strftime("%Y/%m/%d")
    click_button "グラフ・表の表示更新"
    assert_table "calcResults"

    assert_field "calc_condition_form[location]", with: next_locations[:value]
    assert_field "calc_condition_form[first_date]", with: date_after_first_date.strftime("%Y-%m-%d")
    assert_field "calc_condition_form[last_date]", with: date_after_last_date.strftime("%Y-%m-%d")
  end

  test "ページネーションの矢印「⇥」「⇤」選択に連動して結果一覧の表示が切り替わる" do
    visit root_path
    fill_in "calc_condition_form[first_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "calc_condition_form[last_date]", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表の表示更新"
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"

    find('[aria-label="ページネーション"]').find("li", text: "⇥").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.advance(weeks: 1).day}\"]"
    find('[aria-label="ページネーション"]').find("li", text: "⇤").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"
  end

  test "ページネーションの矢印「→」「←」選択に連動して結果一覧の表示が切り替わる" do
    visit root_path
    fill_in "calc_condition_form[first_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    click_button "グラフ・表の表示更新"
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"

    find('[aria-label="ページネーション"]').find("li", text: "→").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.tomorrow.day}\"]"
    find('[aria-label="ページネーション"]').find("li", text: "←").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"
  end

  test "ページネーションの日付選択に連動して結果一覧の表示が切り替わる" do
    visit root_path
    fill_in "calc_condition_form[first_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    click_button "グラフ・表の表示更新"
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"

    find('[aria-label="ページネーション"]').find("li", text: "#{Date.current.tomorrow.day}").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.tomorrow.day}\"]"
  end

  test "ページネーションの矢印「⇥」「⇤」選択に連動してメモが表示される" do
    sign_in_as(users(:bob))
    fill_in "calc_condition_form[first_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "calc_condition_form[last_date]", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモの表示更新"
    within "#records" do
      assert_text "bob's memo today"
    end

    find('[aria-label="ページネーション"]').find("li", text: "⇥").click
    within "#records" do
      assert_text "bob's memo 1week later"
    end
    find('[aria-label="ページネーション"]').find("li", text: "⇤").click
    within "#records" do
      assert_text "bob's memo today"
    end
  end

  test "ページネーションの矢印「→」「←」選択に連動してメモが表示される" do
    sign_in_as(users(:bob))
    fill_in "calc_condition_form[first_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモの表示更新"
    within "#records" do
      assert_text "bob's memo today"
    end

    find('[aria-label="ページネーション"]').find("li", text: "→").click
    within "#records" do
      assert_text "bob's memo tomorrow"
    end
    find('[aria-label="ページネーション"]').find("li", text: "←").click
    within "#records" do
      assert_text "bob's memo today"
    end
  end

  test "ページネーションの日付選択に連動してメモが表示される" do
    sign_in_as(users(:bob))
    fill_in "calc_condition_form[first_date]", with: "#{Date.current.strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモの表示更新"
    within "#records" do
      assert_text "bob's memo today"
    end

    find('[aria-label="ページネーション"]').find("li", text: "#{Date.current.tomorrow.day}").click
    within "#records" do
      assert_text "bob's memo tomorrow"
    end
  end

  test "補足説明などのページの「ホームへ」リンクは、ログイン有無に応じたホームページに遷移する" do
    visit about_index_path
    click_link "ホームへ"
    assert_text "ログインすると、メモ機能が使えます。"

    sign_in_as(users(:alice))
    first('[aria-label="補足説明のページへ"]').click
    assert_current_path about_index_path
    click_link "ホームへ"
    assert_selector "div[aria-label='各数値データのタイトル'] turbo-frame#record_title_0" do
      assert_text "alice's title 1"
    end
  end
end
