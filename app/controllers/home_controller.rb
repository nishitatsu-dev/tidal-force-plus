class HomeController < ApplicationController
  ADDITIONAL_DAYS = 9

  def index
    ensure_session
    reset_session_date
    set_calc_condition
    set_session_page_id
    if user_signed_in?
      @record_titles = RecordTitlesPresenter.new(current_user).complete_record_titles
      @records = RecordsPresenter.new(current_user).complete_one_day_records(set_date)
    end
  end

  def create
    @calc_condition_form = CalcConditionForm.new(calc_condition_params)

    if @calc_condition_form.valid?
      session[:location] = @calc_condition_form.location
      session[:first_date] = @calc_condition_form.first_date
      session[:last_date] = @calc_condition_form.last_date
      session[:timezone] = @calc_condition_form.timezone
      set_session_timeout
      redirect_to root_url
    else
      render :index, status: :unprocessable_entity
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
    session[:page_id] ||= 0
    session[:timeout] ||= (Time.current + Rails.configuration.x.session.timeout_in)
  end

  def set_session_page_id
    session[:page_id] = params[:page_id].to_i || 0
  end

  def set_session_timeout
    session[:timeout] = (Time.current + Rails.configuration.x.session.timeout_in)
  end

  def reset_session_date
    if Time.current > session[:timeout]
      session[:first_date] = Date.current.strftime("%Y-%m-%d")
      session[:last_date] = ADDITIONAL_DAYS.days.from_now.strftime("%Y-%m-%d")
    end
  end
end
