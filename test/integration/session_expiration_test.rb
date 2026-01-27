require "test_helper"

class SessionExpirationTest < ActionDispatch::IntegrationTest
  test "「日付」のセッションは、設定時間の間、値を保持する" do
    user_timezone = "Asia/Tokyo"
    Time.use_zone(user_timezone) do
      changed_first_date = "#{Date.current.advance(months: 1).strftime("%Y-%m-%d")}"
      changed_last_date = "#{Date.current.advance(months: 2).strftime("%Y-%m-%d")}"
      post home_index_url,
        params: { calc_condition_form:
          { first_date: changed_first_date,
            last_date: changed_last_date,
            location: "AKASHI",
            timezone: user_timezone } }
      assert_response :redirect
      follow_redirect!

      travel (Rails.configuration.x.session.timeout_in - 1.minutes) do
        get root_url
        assert_equal changed_first_date, session[:first_date]
        assert_equal changed_last_date, session[:last_date]
      end
    end
  end

  test "「日付」のセッションは、設定時間経過後、保持した値を破棄する" do
    user_timezone = "Asia/Tokyo"
    Time.use_zone(user_timezone) do
      changed_first_date = "#{Date.current.advance(months: 1).strftime("%Y-%m-%d")}"
      changed_last_date = "#{Date.current.advance(months: 2).strftime("%Y-%m-%d")}"
      post home_index_url,
        params: { calc_condition_form:
          { first_date: changed_first_date,
            last_date: changed_last_date,
            location: "AKASHI",
            timezone: user_timezone } }
      assert_response :redirect
      follow_redirect!

      travel (Rails.configuration.x.session.timeout_in + 1.minute) do
        get root_url
        assert_not_equal changed_first_date, session[:first_date]
        assert_not_equal changed_last_date, session[:last_date]
      end
    end
  end
end
