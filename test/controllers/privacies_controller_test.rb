require "test_helper"

class PrivaciesControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get privacy_url
    assert_response :success
  end
end
