class RemoveLockableFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :failed_attempts, :integer
    remove_column :users, :unlock_token, :string
    remove_column :users, :locked_at, :datetime
  end
end
