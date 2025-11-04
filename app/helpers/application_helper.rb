module ApplicationHelper
  def extract_date_hour(record)
    record.recorded_at.in_time_zone(session[:timezone]).strftime("%m-%d_%H")
  end

  def display_line_breaks(original_text)
    original_text.nil? ? nil : safe_join(original_text.split("\n"), tag.br)
  end

  def each_home_index_path
    user_signed_in? ? memo_index_home_path(current_user.id) : home_index_path
  end

  def default_meta_tags
    {
      site: "Tidal Force plus",
      description: "「月・太陽による起潮力（潮汐力）」と「木星との距離」を計算します。ログインするとメモ機能が使えます。",
      reverse: true,
      separator: "|",
      og: {
        title: :title,
        type: "website",
        url: request.original_url,
        image: image_url("logo(400x400).png"),
        site_name: "Tidal Force plus",
        description: :description,
        locale: "ja_JP"
      },
      twitter: {
        card: "summary",
        description: :description,
        image: image_url("logo(400x400).png")
      }
    }
  end
end
