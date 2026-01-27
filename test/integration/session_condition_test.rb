require "test_helper"

class SessionConditionTest < ActionDispatch::IntegrationTest
  test "フォームに入力される前、セッションは初期値を持つ" do
    get root_url
    assert session[:first_date].present?
    assert session[:last_date].present?
    assert session[:location].present?
    assert session[:timezone].present?
  end
end
