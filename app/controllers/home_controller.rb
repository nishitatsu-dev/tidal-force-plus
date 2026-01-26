class HomeController < ApplicationController
  ADDITIONAL_DAYS = 9
  before_action :authenticate_user!, only: %i[ memo_index memo_new ]
  before_action :ensure_session, only: %i[ index new memo_index memo_new ]
  before_action :refresh_session_date, only: %i[ index new memo_index memo_new ]
  before_action :set_calc_condition, only: %i[ index new memo_index memo_new ]

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

  def create
    @calc_condition_form = CalcConditionForm.new(calc_condition_params)

    if @calc_condition_form.valid?
      session[:location] = @calc_condition_form.location
      session[:first_date] = @calc_condition_form.first_date
      session[:last_date] = @calc_condition_form.last_date
      session[:timezone] = @calc_condition_form.timezone
      set_session_timeout
      redirect_to user_signed_in? ? memo_index_home_url(current_user.id) : home_index_url
    else
      set_initial_calc_values
      render :new, status: :unprocessable_entity
    end
  end

  private
  def set_calc_condition
    @calc_condition_form = CalcConditionForm.new(
      location: session[:location],
      first_date: session[:first_date],
      last_date: session[:last_date],
      timezone: session[:timezone]
    )
  end

  def calc_condition_params
    params.expect(calc_condition_form: [ :location, :first_date, :last_date, :timezone ])
  end

  def ensure_session
    session[:location] ||= "AKASHI"
    session[:first_date] ||= Date.current.strftime("%Y-%m-%d")
    session[:last_date] ||= ADDITIONAL_DAYS.days.from_now.strftime("%Y-%m-%d")
    session[:page_id] = params[:page_id].to_i || 0
    set_session_timeout
  end

  def set_session_timeout
    session[:timeout] = (Time.current + Rails.configuration.x.session.timeout_in)
  end

  def refresh_session_date
    if Time.current > session[:timeout]
      session[:first_date] = Date.current.strftime("%Y-%m-%d")
      session[:last_date] = ADDITIONAL_DAYS.days.from_now.strftime("%Y-%m-%d")
    end
  end
end
