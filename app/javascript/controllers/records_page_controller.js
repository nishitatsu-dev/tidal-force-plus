import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="records-page"
export default class extends Controller {
  static targets = ["pageField", "pageForm"];

  pageFormTargetConnected() {
    this.showPage();
  }

  showPage(event) {
    const pageId = event ? Number(event.currentTarget.id) : 0;

    this.pageFieldTarget.value = pageId;
    this.pageFormTarget.requestSubmit();
  }
}
