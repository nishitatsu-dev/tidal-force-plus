class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable
  #      , :omniauthable, omniauth_providers: [ :google_oauth2 ]

  has_many :records, dependent: :destroy
  has_many :record_titles, dependent: :destroy
end
