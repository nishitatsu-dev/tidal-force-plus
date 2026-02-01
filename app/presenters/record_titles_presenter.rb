class RecordTitlesPresenter
  def initialize(user)
    @user = user
  end

  def complete_record_titles
    indexed_titles = @user.record_titles.index_by { |title| title.column_number }
    (0..5).map do |column_number|
      indexed_titles[column_number] || RecordTitle.new(column_number:, title: "No.#{column_number + 1}")
    end
  end
end
