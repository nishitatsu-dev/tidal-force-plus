require "test_helper"

class SnsCredentialTest < ActiveSupport::TestCase
  include SignInHelper

  setup do
    set_omniauth_test_config
  end

  test "既存ユーザの場合、そのユーザのsns_credentialデータを見つけて返す" do
    auth = set_mock_as(users(:alice))
    sns_credential = SnsCredential.find_or_create_from_omniauth(auth)
    assert_equal users(:alice).sns_credentials.find_by(provider: "google_oauth2"), sns_credential
  end

  test "新規ユーザの場合、userとsns_credentialが作成される" do
    auth = set_mock_as_new_user
    assert_difference [ "User.count", "SnsCredential.count" ], 1 do
      SnsCredential.find_or_create_from_omniauth(auth)
    end
  end

  test "新規ユーザの場合、sns_credentialの作成に失敗すると、userも作成されない" do
    auth = OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new({
      provider: "google_oauth2",
      uid: nil,
      info: {
        email: "new-user@example.com"
      }
    })
    assert_no_difference [ "User.count", "SnsCredential.count" ] do
      assert_raises(ActiveRecord::NotNullViolation) do
        SnsCredential.find_or_create_from_omniauth(auth)
      end
    end
  end
end
