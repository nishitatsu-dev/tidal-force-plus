class RecordsController < ApplicationController
  before_action :authenticate_user!, only: %i[ index show new edit confirm_destroy ]
  before_action :set_record, only: %i[ show edit confirm_destroy update destroy ]

  # GET /records or /records.json
  def index
    @records = RecordsPresenter.new(current_user).complete_one_day_records(set_date)
  end

  # GET /records/1 or /records/1.json
  def show
  end

  # GET /records/new
  def new
    @record_titles = RecordTitlesPresenter.new(current_user).complete_record_titles
    @record = Record.new(recorded_at: params[:recorded_at])
  end

  # GET /records/1/edit
  def edit
    @record_titles = RecordTitlesPresenter.new(current_user).complete_record_titles
  end

  def confirm_destroy
  end

  # POST /records or /records.json
  def create
    @record = current_user.records.new(record_params)

    if @record.save
      redirect_to @record, notice: "作成に成功しました。"
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /records/1 or /records/1.json
  def update
    if @record.update(record_params)
      redirect_to @record, notice: "更新に成功しました。", status: :see_other
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /records/1 or /records/1.json
  def destroy
    date = @record.recorded_at.strftime("%Y-%m-%d")
    @record.destroy!
    redirect_to records_path(date: date), notice: "削除に成功しました。", status: :see_other
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_record
      @record = Record.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def record_params
      params.expect(record: [ :recorded_at, :column_0, :column_1, :column_2, :column_3, :column_4, :column_5, :memo ])
    end
end
