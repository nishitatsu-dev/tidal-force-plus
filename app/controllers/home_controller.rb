class HomeController < ApplicationController
  def index
  end

  def new
  end

  def memo_index
    render :index
  end

  def memo_new
    render :new
  end
end
