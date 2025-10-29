const DISPLAY_LENGTH = 17;

export default class Paginator {
  constructor(firstDay, totalDay, currentIndex) {
    this.firstDay = firstDay;
    this.totalDay = totalDay;
    this.currentIndex = currentIndex;
  }

  getDatesAndDays() {
    const dates = [];
    const days = [];
    const firstDay = new Date(this.firstDay);
    const firstDate = firstDay.getDate();
    for (let i = 0; i < this.totalDay; i++) {
      const date = new Date(this.firstDay);
      date.setDate(firstDate + i);
      dates.push(date.getDate());
      days.push(date.getDay());
    }
    return {dates, days};
  }

  getStartIndex() {
    const headIndex = this.currentIndex - Math.floor(DISPLAY_LENGTH / 2);
    const startIndex =
      DISPLAY_LENGTH < this.totalDay && 0 < headIndex
        ? Math.min(headIndex, this.totalDay - DISPLAY_LENGTH)
        : 0;
    return startIndex;
  }

  getEndIndex() {
    const tailIndex = this.currentIndex + Math.floor(DISPLAY_LENGTH / 2);
    const lastIndex = this.totalDay - 1;
    const endIndex =
      DISPLAY_LENGTH < this.totalDay && tailIndex < lastIndex
        ? Math.max(DISPLAY_LENGTH - 1, tailIndex)
        : lastIndex;
    return endIndex;
  }
}
