class NullFalseProviderAndUidOnSnsCredentials < ActiveRecord::Migration[8.0]
  def change
    change_column_null :sns_credentials, :provider, false
    change_column_null :sns_credentials, :uid, false
  end
end
