class AddUserRefToRecordTitles < ActiveRecord::Migration[8.0]
  def change
    add_reference :record_titles, :user, null: false, foreign_key: true
  end
end
