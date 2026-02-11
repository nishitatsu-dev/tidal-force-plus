require "test_helper"

class RecordTest < ActiveSupport::TestCase
  test "指定した日付の全レコードを取得できる" do
    today = Date.current.strftime("%Y/%m/%d")
    records_today = users(:carol).records.records_on(today)
    records_all = users(:carol).records

    assert_equal records_today.size, 3
    assert_not_equal records_today.size, records_all.size
  end
end
