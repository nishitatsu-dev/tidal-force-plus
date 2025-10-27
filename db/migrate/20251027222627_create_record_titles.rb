class CreateRecordTitles < ActiveRecord::Migration[8.0]
  def change
    create_table :record_titles do |t|
      t.integer :column_number, null: false
      t.string :title

      t.timestamps
    end
  end
end
