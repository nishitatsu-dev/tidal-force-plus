class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :set_session_timezone
  around_action :set_timezone

  def after_sign_in_path_for(resource)
    memo_new_home_path(current_user.id)
  end

  def after_sign_out_path_for(resource)
    root_path
  end

  private
  def set_session_timezone
    session[:timezone] = if !params[:timezone].blank?
      params[:timezone]
    elsif !session[:timezone].blank?
      session[:timezone]
    else
      "Asia/Tokyo"
    end
  end

  def set_timezone
    Time.use_zone(session[:timezone]) { yield }
  end

  def get_db_records(date)
    date_hour_0000 = Time.zone.parse(date + " 00:00")
    date_hour_2300 = Time.zone.parse(date + " 23:00")
    current_user.records.where(recorded_at: (date_hour_0000..date_hour_2300))
  end

  def make_hourly_records(date, db_records)
    time_indexed_records = db_records.index_by { |record| record.recorded_at.hour }
    date_hours = (0..23).map { |hour| Time.zone.parse(date + " " + format("%02d:00", hour)) }
    (0..23).map do |hour|
      time_indexed_records[hour] || Record.new(recorded_at: date_hours[hour])
    end
  end

  def make_one_day_records
    date = Date.parse(session[:first_date]).advance(days: session[:page_id]).strftime("%Y-%m-%d")
    db_records = get_db_records(date)
    make_hourly_records(date, db_records)
  end

  def make_record_titles
    column_number_indexed_titles = current_user.record_titles.index_by { |title| title.column_number }
    (0..5).map do |column_number|
      column_number_indexed_titles[column_number] || RecordTitle.new(column_number: column_number, title: "No.#{column_number + 1}")
    end
  end
end
