class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :ensure_session_timezone
  around_action :set_timezone

  def after_sign_in_path_for(resource)
    memo_index_home_path(current_user.id)
  end

  def after_sign_out_path_for(resource)
    root_path
  end

  private
  def ensure_session_timezone
    session[:timezone] ||= "Asia/Tokyo"
  end

  def set_timezone
    Time.use_zone(session[:timezone]) { yield }
  end

  def set_date
    Date.parse(session[:first_date]).advance(days: session[:page_id]).strftime("%Y-%m-%d")
  end

  def get_indexed_records(date)
    current_user.records.records_on(date).index_by { |record| record.recorded_at.hour }
  end

  def complete_one_day_records(date)
    indexed_records = get_indexed_records(date)
    date_hours = (0..23).map { |hour| Time.zone.parse(date + " " + format("%02d:00", hour)) }
    (0..23).map do |hour|
      indexed_records[hour] || Record.new(recorded_at: date_hours[hour])
    end
  end

  def get_indexed_record_titles
    current_user.record_titles.index_by { |title| title.column_number }
  end

  def complete_record_titles
    indexed_titles = get_indexed_record_titles
    (0..5).map do |column_number|
      indexed_titles[column_number] || RecordTitle.new(column_number:, title: "No.#{column_number + 1}")
    end
  end
end
