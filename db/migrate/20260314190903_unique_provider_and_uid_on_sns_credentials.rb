class UniqueProviderAndUidOnSnsCredentials < ActiveRecord::Migration[8.1]
  def change
    add_index :sns_credentials, [ :provider, :uid ], unique: true
  end
end
