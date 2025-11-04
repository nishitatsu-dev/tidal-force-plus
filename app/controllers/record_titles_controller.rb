class RecordTitlesController < ApplicationController
  before_action :authenticate_user!, only: %i[ index show new edit confirm_destroy ]
  before_action :set_record_title, only: %i[ show edit confirm_destroy update destroy ]

  def index
    @record_titles = make_record_titles
  end

  def show
  end

  def new
    @record_title = RecordTitle.new(column_number: params[:column_number])
  end

  def edit
  end

  def confirm_destroy
  end

  def create
    @record_title = current_user.record_titles.new(record_title_params)
    if @record_title.save
      redirect_to @record_title, notice: "作成に成功しました。"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @record_title.update(record_title_params)
      redirect_to @record_title, notice: "更新に成功しました。", status: :see_other
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @record_title.destroy!
    redirect_to record_titles_path, notice: "削除に成功しました。", status: :see_other
  end

  private
  def set_record_title
    @record_title = RecordTitle.find(params[:id])
  end

  def record_title_params
    params.require(:record_title).permit(:column_number, :title)
  end
end
