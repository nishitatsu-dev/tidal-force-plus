import { Controller } from "@hotwired/stimulus"
import CalcResultsPage from "calc_results_page";

// Connects to data-controller="calc-results-page"
export default class extends Controller {
  static targets = ["calcResultsTbody"];

  connect() {
    this.showPage();
  }

  showPage(event) {
    const pageId = event ? Number(event.currentTarget.id) : 0;

    this.#removeOldDOM(this.calcResultsTbodyTarget);
    const calcResultsPage = new CalcResultsPage(this.calcResultsTbodyTarget);
    calcResultsPage.makeNewTable(pageId);
  }

  #removeOldDOM(thisTarget) {
    const parentDOM = thisTarget;
    while (parentDOM.firstChild) {
      parentDOM.removeChild(parentDOM.firstChild);
    }
  }
}
