import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="year-month-display"
export default class extends Controller {
  static targets = ["display"];

  connect() {
    this.showYearMonthDisplay();
  }

  showYearMonthDisplay() {
    this.#removeOldDOM(this.displayTarget);
    this.#makeNewDisplay(this.displayTarget);
  }

  #removeOldDOM(thisTarget) {
    const parentDOM = thisTarget;
    while (parentDOM.firstChild) {
      parentDOM.removeChild(parentDOM.firstChild);
    }
  }

  #makeNewDisplay(displayTarget) {
    const firstDay = sessionStorage.getItem("firstDay");
    const lastDay = sessionStorage.getItem("lastDay");
    const firstDayYearMonth = this.#getYearAndMonth(firstDay);
    const lastDayYearMonth = this.#getYearAndMonth(lastDay);

    let yearMonth = `${firstDayYearMonth.year}年${firstDayYearMonth.month}月`;
    if (firstDayYearMonth.month !== lastDayYearMonth.month) {
      yearMonth += ` 〜 ${lastDayYearMonth.year}年${lastDayYearMonth.month}月`;
    }

    const content = document.createElement("div");
    content.className = `relative inline-flex items-center justify-center h-10 text-sm font-semibold text-gray-900`;
    content.textContent = yearMonth;
    displayTarget.appendChild(content);
  }

  #getYearAndMonth(date) {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return { year, month };
  }
}
