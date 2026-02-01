class Record < ApplicationRecord
  belongs_to :user

  scope :records_on, ->(date) { where(recorded_at: Time.zone.parse(date).all_day) }
end
