module ApplicationHelper
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
