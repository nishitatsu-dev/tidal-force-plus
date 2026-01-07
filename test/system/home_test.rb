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

  test "ホームページで、グラフ・表を更新後に、グラフの表示枠がある" do
    visit root_path
    click_button "グラフ・表を更新"
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

  test "ページネーションの矢印「⇥」「⇤」選択に連動して結果一覧の表示が切り替わる" do
    visit root_path
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表を更新"
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
    click_button "グラフ・表を更新"
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
    click_button "グラフ・表を更新"
    assert_selector "tbody tr[data-testid=\"#{Date.current.day}\"]"

    find('[aria-label="ページネーション"]').find("li", text: "#{Date.current.tomorrow.day}").click
    assert_selector "tbody tr[data-testid=\"#{Date.current.tomorrow.day}\"]"
  end

  test "ページネーションの矢印「⇥」「⇤」選択に連動してメモが表示される" do
    sign_in_as(users(:bob))
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモを更新"
    assert_text "bob's memo today"

    find('[aria-label="ページネーション"]').find("li", text: "⇥").click
    assert_text "bob's memo 1week later"
    find('[aria-label="ページネーション"]').find("li", text: "⇤").click
    assert_text "bob's memo today"
  end

  test "ページネーションの矢印「→」「←」選択に連動してメモが表示される" do
    sign_in_as(users(:bob))
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモを更新"
    assert_text "bob's memo today"

    find('[aria-label="ページネーション"]').find("li", text: "→").click
    assert_text "bob's memo tomorrow"
    find('[aria-label="ページネーション"]').find("li", text: "←").click
    assert_text "bob's memo today"
  end

  test "ページネーションの日付選択に連動してメモが表示される" do
    sign_in_as(users(:bob))
    fill_in "first_date", with: "#{Date.current.strftime("%Y/%m/%d")}"
    fill_in "last_date", with: "#{Date.current.advance(weeks: 1).strftime("%Y/%m/%d")}"
    click_button "グラフ・表・メモを更新"
    assert_text "bob's memo today"

    find('[aria-label="ページネーション"]').find("li", text: "#{Date.current.tomorrow.day}").click
    assert_text "bob's memo tomorrow"
  end
end
