class HomeController < ApplicationController
  ADDITIONAL_DAYS = 9
  before_action :authenticate_user!, only: %i[ memo_index memo_new ]
  before_action :set_session
  before_action :set_initial_calc_values, only: %i[ index new memo_index memo_new ]

  def index
  end

  def new
  end

  def memo_index
    @record_titles = make_record_titles
    @records = make_one_day_records
    render :index
  end

  def memo_new
    render :new
  end

  private
  def set_session
    session[:location] = if !params[:location].blank?
      params[:location]
    elsif !session[:location].blank?
      session[:location]
    else
      "AKASHI"
    end

    session[:first_date] = if !params[:first_date].blank?
      set_session_timeout
      params[:first_date]
    elsif !session[:first_date].blank? && get_timeout_condition
      session[:first_date]
    else
      Date.current.strftime("%Y-%m-%d")
    end

    session[:last_date] = if !params[:last_date].blank?
      set_session_timeout
      params[:last_date]
    elsif !session[:last_date].blank? && get_timeout_condition
      session[:last_date]
    else
      ADDITIONAL_DAYS.days.from_now.strftime("%Y-%m-%d")
    end

    session[:page_id] = params[:page_id].to_i || 0
  end

  def set_session_timeout
    session[:timeout] = (Time.current + Rails.configuration.x.session.timeout_in)
  end

  def get_timeout_condition
    session[:timeout] ? Time.current < session[:timeout] : false
  end

  def set_initial_calc_values
    @initial_calc_values = {
      location: session[:location],
      first_date: session[:first_date],
      last_date: session[:last_date]
    }
  end
end
