class HomeController < ApplicationController
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
      params[:first_date]
    elsif !session[:first_date].blank?
      session[:first_date]
    else
      Date.current.strftime("%Y-%m-%d")
    end

    session[:last_date] = if !params[:last_date].blank?
      params[:last_date]
    elsif !session[:last_date].blank?
      session[:last_date]
    else
      9.days.from_now.strftime("%Y-%m-%d")
    end

    session[:page_id] = params[:page_id].to_i || 0
  end

  def set_initial_calc_values
    @initial_calc_values = {
      location: session[:location],
      first_date: session[:first_date],
      last_date: session[:last_date]
    }
  end
end
