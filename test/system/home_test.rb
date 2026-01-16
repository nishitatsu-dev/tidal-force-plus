require "application_system_test_case"

class HomeTest < ApplicationSystemTestCase
  test "ログイン後、初回計算実行前はテーブルを表示しない（日付未設定のメモ欄が表示されるのを防ぐ為）" do
    sign_in_as(users(:alice))
    assert_no_table "calcResults"
    click_button "グラフ・表・メモの表示更新"
    assert_table "calcResults"
  end

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

  test "ホームページで、グラフ・表の表示更新後に、グラフの表示枠がある" do
    visit root_path
    click_button "グラフ・表の表示更新"
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

  test "「表示更新」した後、フォームの入力値がリセットされずに残る" do
    # 日付は、ある程度時間が経つとリセットするが、ここではテストしない（テスト動作が不安定な為）
    visit root_path
    next_locations = calc_next_locations
    date_after_first_date = calc_tomorrow("first_date")
    date_after_last_date = calc_tomorrow("last_date")

    select next_locations[:text], from: "location"
    fill_in "first_date", with: date_after_first_date.strftime("%Y/%m/%d")
    fill_in "last_date", with: date_after_last_date.strftime("%Y/%m/%d")
    click_button "グラフ・表の表示更新"
    assert_table "calcResults"

    assert_field "location", with: next_locations[:value]
    assert_field "first_date", with: date_after_first_date.strftime("%Y-%m-%d")
    assert_field "last_date", with: date_after_last_date.strftime("%Y-%m-%d")
  end

  test "ページネーションの矢印「⇥」「⇤」選択に連動して結果一覧の表示が切り替わる" do
    visit root_path
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表の表示更新"
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"

    find('[aria-label="ページネーション"]').find("li", text: "⇥").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.advance(weeks: 1).day}\"]"
    find('[aria-label="ページネーション"]').find("li", text: "⇤").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"
  end

  test "ページネーションの矢印「→」「←」選択に連動して結果一覧の表示が切り替わる" do
    visit root_path
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表の表示更新"
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"

    find('[aria-label="ページネーション"]').find("li", text: "→").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.tomorrow.day}\"]"
    find('[aria-label="ページネーション"]').find("li", text: "←").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"
  end

  test "ページネーションの日付選択に連動して結果一覧の表示が切り替わる" do
    visit root_path
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表の表示更新"
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"

    find('[aria-label="ページネーション"]').find("li", text: "#{Date.current.tomorrow.day}").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.tomorrow.day}\"]"
  end

  test "ページネーションの矢印「⇥」「⇤」選択に連動してメモが表示される" do
    sign_in_as(users(:bob))
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
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
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
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
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモの表示更新"
    within "#records" do
      assert_text "bob's memo today"
    end

    find('[aria-label="ページネーション"]').find("li", text: "#{Date.current.tomorrow.day}").click
    within "#records" do
      assert_text "bob's memo tomorrow"
    end
  end
end
