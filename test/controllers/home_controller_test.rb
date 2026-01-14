require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get home_index_url
    assert_response :success
  end

  test "should get new" do
    get new_home_url
    assert_response :success
  end

  test "フォームに入力される前、セッションは初期値を持つ" do
    get root_url
    assert session[:first_date].present?
    assert session[:last_date].present?
    assert session[:location].present?
    assert session[:timezone].present?
  end

  test "フォームの入力値を、セッションで保持する" do
    user_timezone = "Europe/London"
    Time.use_zone(user_timezone) do
      get home_index_url,
        params: { first_date: "#{Date.current.advance(months: 1).strftime("%Y-%m-%d")}",
                  last_date: "#{Date.current.advance(months: 2).strftime("%Y-%m-%d")}",
                  location: "TOKYO",
                  timezone: user_timezone }
      assert_equal "#{Date.current.advance(months: 1).strftime("%Y-%m-%d")}", session[:first_date]
      assert_equal "#{Date.current.advance(months: 2).strftime("%Y-%m-%d")}", session[:last_date]
      assert_equal "TOKYO", session[:location]
      assert_equal user_timezone, session[:timezone]
    end
  end

  test "「日付」を保持するセッションは、設定時間経過後、保持した値を破棄する" do
    user_timezone = "Asia/Tokyo"
    Time.use_zone(user_timezone) do
      changed_first_date = "#{Date.current.advance(months: 1).strftime("%Y-%m-%d")}"
      changed_last_date = "#{Date.current.advance(months: 2).strftime("%Y-%m-%d")}"
      get home_index_url,
        params: { first_date: changed_first_date,
                  last_date: changed_last_date,
                  location: "AKASHI",
                  timezone: user_timezone }
      travel (Rails.configuration.x.session.timeout_in - 1.minutes) do
        get home_index_url
        assert_equal changed_first_date, session[:first_date]
        assert_equal changed_last_date, session[:last_date]
      end
      travel (Rails.configuration.x.session.timeout_in + 1.minute) do
        get home_index_url
        assert_not_equal changed_first_date, session[:first_date]
        assert_not_equal changed_last_date, session[:last_date]
        assert session[:first_date].present?
        assert session[:last_date].present?
      end
    end
  end
end
