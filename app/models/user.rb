class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :rememberable, :validatable, :timeoutable,
         :omniauthable, omniauth_providers: [ :google_oauth2 ]

  has_many :sns_credentials, dependent: :destroy
  has_many :records, dependent: :destroy
  has_many :record_titles, dependent: :destroy

  def self.from_omniauth(auth)
    sns_credential = SnsCredential.find_or_create_from_omniauth(auth)
    sns_credential.user.update(email: auth.info.email) if sns_credential.user.email != auth.info.email

    sns_credential.user
  end
end
