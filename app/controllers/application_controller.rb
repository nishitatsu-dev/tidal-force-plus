class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :ensure_session_timezone
  around_action :set_timezone

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
end
