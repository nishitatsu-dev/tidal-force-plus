require "test_helper"

class TermsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get terms_url
    assert_response :success
  end
end
