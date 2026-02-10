class CalcConditionForm
  include ActiveModel::Model

  attr_accessor :location, :first_date, :last_date, :timezone

  validates :location, presence: true
  validates :first_date, presence: true
  validates :last_date, presence: true
  validates :timezone, presence: true
  validate :date_limit

  def date_limit
    first = Date.parse(first_date) rescue nil
    last = Date.parse(last_date) rescue nil
    return if first.nil? || last.nil?

    min = Date.new(2017, 1, 1)
    max = Date.new(2060, 12, 31)

    if last < first
      errors.add(:base, "・期間の「終了日」は「開始日」以降の日付を選択してください。")
    end

    if first < min || last > max
      errors.add(:base, "・期間は2017年1月1日から2060年12月31日までの範囲内で選択してください。")
    end

    if last > first + 10.years
      errors.add(:base, "・期間は最大10年間です。")
    end
  end
end
