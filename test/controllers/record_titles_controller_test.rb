require "test_helper"

class RecordTitlesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get record_titles_index_url
    assert_response :success
  end

  test "should get show" do
    get record_titles_show_url
    assert_response :success
  end

  test "should get new" do
    get record_titles_new_url
    assert_response :success
  end

  test "should get edit" do
    get record_titles_edit_url
    assert_response :success
  end

  test "should get create" do
    get record_titles_create_url
    assert_response :success
  end

  test "should get update" do
    get record_titles_update_url
    assert_response :success
  end

  test "should get destroy" do
    get record_titles_destroy_url
    assert_response :success
  end
end
