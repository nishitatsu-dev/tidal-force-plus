module FormValueHelper
  def calc_next_locations
    select_box = find_field("location")
    current_index = select_box.all("option").index(&:selected?)
    next_location = select_box.all("option")[current_index + 1]
    { text: next_location.text, value: next_location.value }
  end

  def calc_tomorrow(date)
    initial_date = find_field("#{date}").value
    Time.zone.parse(initial_date).tomorrow
  end
end
