require "test_helper"

class AboutsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get about_url
    assert_response :success
  end
end
