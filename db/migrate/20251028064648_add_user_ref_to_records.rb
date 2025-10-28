class AddUserRefToRecords < ActiveRecord::Migration[8.0]
  def change
    add_reference :records, :user, null: false, foreign_key: true
  end
end
