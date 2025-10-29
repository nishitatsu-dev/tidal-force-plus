class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def after_sign_in_path_for(resource)
    memo_new_home_path(current_user.id)
  end

  def after_sign_out_path_for(resource)
    root_path
  end
end
