require "test_helper"

class RecordTitlesPresenterTest < ActionDispatch::IntegrationTest
  test "タイトルの表示欄に合うように、「保存されたタイトル」と「デフォルトのタイトル」を統合して返す" do
    user = users(:carol)
    presenter = RecordTitlesPresenter.new(user)
    complete_titles = presenter.complete_record_titles

    assert_equal RecordTitle::COLUMN_NUMBER_RANGE.size, complete_titles.size

    complete_titles.each_with_index do |title, index|
      if user.record_titles.exists?(column_number: index)
        assert_equal user.record_titles.find_by(column_number: index).title, title.title
      else
        assert_equal "No.#{index + 1}", title.title
      end
    end
  end
end
