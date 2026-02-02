require "test_helper"

class RecordsPresenterTest < ActionDispatch::IntegrationTest
  test "レコードの表示欄に合うように、「保存されたレコード」と「空のレコード」を統合して返す" do
    user = users(:bob)
    presenter = RecordsPresenter.new(user)
    date = Date.current.strftime("%Y/%m/%d")
    complete_records = presenter.complete_one_day_records(date)

    assert_equal RecordsPresenter::HOUR_RANGE.size, complete_records.size

    complete_records.each_with_index do |record, index|
      if user.records.exists?(recorded_at: date + " " + format("%02d:00", index))
        assert_equal user.records.find_by(recorded_at: date + " " + format("%02d:00", index)).memo, record.memo
      else
        assert_nil record.memo
      end
    end
  end
end
