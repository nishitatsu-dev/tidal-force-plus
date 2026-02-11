require "test_helper"

class ApplicationHelperTest < ActionView::TestCase
  test "recordの記録日時を、月-日_時間の形式で取得できる" do
    record = records(:carol_record_today_00)
    date_hour = Date.current.strftime("%m-%d_%H")
    assert_equal date_hour, extract_date_hour(record)
  end

  test "文章があれば、改行をHTMLの改行コードに変換して出力し、無ければnilを返す" do
    assert_equal "改行<br>テスト<br>です", display_line_breaks("改行\nテスト\nです")
    assert_nil display_line_breaks(nil)
  end
end
