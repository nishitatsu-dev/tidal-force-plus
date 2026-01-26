class CalcConditionForm
  include ActiveModel::Model

  attr_accessor :location, :first_date, :last_date, :timezone

  validates :location, presence: true
  validates :first_date, presence: true
  validates :last_date, presence: true
  validates :timezone, presence: true
end
