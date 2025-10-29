import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="timezone"
export default class extends Controller {
  static targets = ["timezoneField"];

  setValue() {
    this.timezoneFieldTarget.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}
