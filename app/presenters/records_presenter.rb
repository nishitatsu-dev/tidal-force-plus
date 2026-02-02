class RecordsPresenter
  HOUR_RANGE = 0..23

  def initialize(user)
    @user = user
  end

  def complete_one_day_records(date)
    indexed_records = @user.records.records_on(date).index_by { |record| record.recorded_at.hour }
    date_hours = HOUR_RANGE.map { |hour| Time.zone.parse(date + " " + format("%02d:00", hour)) }
    HOUR_RANGE.map do |hour|
      indexed_records[hour] || Record.new(recorded_at: date_hours[hour])
    end
  end
end
