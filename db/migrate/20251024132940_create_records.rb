class CreateRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :records do |t|
      t.datetime :recorded_at, null: false
      t.float :column_0
      t.float :column_1
      t.float :column_2
      t.float :column_3
      t.float :column_4
      t.float :column_5
      t.string :memo

      t.timestamps
    end
  end
end
