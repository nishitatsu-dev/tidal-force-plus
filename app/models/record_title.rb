class RecordTitle < ApplicationRecord
  COLUMN_NUMBER_RANGE = 0..5
  TITLE_MAX_LENGTH = 15

  belongs_to :user

  validates :column_number, presence: true, numericality: { only_integer: true, in: COLUMN_NUMBER_RANGE }
  validates :title, length: { maximum: TITLE_MAX_LENGTH }
end
