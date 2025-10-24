require "application_system_test_case"

class RecordsTest < ApplicationSystemTestCase
  setup do
    @record = records(:one)
  end

  test "visiting the index" do
    visit records_url
    assert_selector "h1", text: "Records"
  end

  test "should create record" do
    visit records_url
    click_on "New record"

    fill_in "Column 0", with: @record.column_0
    fill_in "Column 1", with: @record.column_1
    fill_in "Column 2", with: @record.column_2
    fill_in "Column 3", with: @record.column_3
    fill_in "Column 4", with: @record.column_4
    fill_in "Column 5", with: @record.column_5
    fill_in "Memo", with: @record.memo
    fill_in "Recorded at", with: @record.recorded_at
    click_on "Create Record"

    assert_text "Record was successfully created"
    click_on "Back"
  end

  test "should update Record" do
    visit record_url(@record)
    click_on "Edit this record", match: :first

    fill_in "Column 0", with: @record.column_0
    fill_in "Column 1", with: @record.column_1
    fill_in "Column 2", with: @record.column_2
    fill_in "Column 3", with: @record.column_3
    fill_in "Column 4", with: @record.column_4
    fill_in "Column 5", with: @record.column_5
    fill_in "Memo", with: @record.memo
    fill_in "Recorded at", with: @record.recorded_at.to_s
    click_on "Update Record"

    assert_text "Record was successfully updated"
    click_on "Back"
  end

  test "should destroy Record" do
    visit record_url(@record)
    accept_confirm { click_on "Destroy this record", match: :first }

    assert_text "Record was successfully destroyed"
  end
end
