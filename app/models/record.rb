class Record < ApplicationRecord
  MEMO_MAX_LENGTH = 150
  COLUMN_MAX_VALUE = 9999.999
  COLUMN_MIN_VALUE = -999.999

  belongs_to :user

  validates :recorded_at, presence: true
  validates :column_0, numericality: { in: COLUMN_MIN_VALUE..COLUMN_MAX_VALUE }, allow_nil: true
  validates :column_1, numericality: { in: COLUMN_MIN_VALUE..COLUMN_MAX_VALUE }, allow_nil: true
  validates :column_2, numericality: { in: COLUMN_MIN_VALUE..COLUMN_MAX_VALUE }, allow_nil: true
  validates :column_3, numericality: { in: COLUMN_MIN_VALUE..COLUMN_MAX_VALUE }, allow_nil: true
  validates :column_4, numericality: { in: COLUMN_MIN_VALUE..COLUMN_MAX_VALUE }, allow_nil: true
  validates :column_5, numericality: { in: COLUMN_MIN_VALUE..COLUMN_MAX_VALUE }, allow_nil: true
  validates :memo, length: { maximum: MEMO_MAX_LENGTH }

  scope :records_on, ->(date) { where(recorded_at: Time.zone.parse(date).all_day) }
end
