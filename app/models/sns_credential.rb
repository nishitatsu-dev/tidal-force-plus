class SnsCredential < ApplicationRecord
  belongs_to :user

  def self.find_or_create_from_omniauth(auth)
    sns_credential = SnsCredential.find_by(provider: auth.provider, uid: auth.uid)

    unless sns_credential
      user = User.create(email: auth.info.email, password: Devise.friendly_token[0, 20])
      sns_credential = user.sns_credentials.create(provider: auth.provider, uid: auth.uid)
    end

    sns_credential
  end
end
