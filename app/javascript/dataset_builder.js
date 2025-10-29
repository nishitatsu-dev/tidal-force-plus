const TIMES = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export default class DatasetBuilder {
  constructor(firstDate, totalDay) {
    this.firstDate = firstDate;
    this.totalDay = totalDay;
  }

  buildXAxisData() {
    let datePeriod = new Date(this.firstDate);
    let month = "";
    let date = "";
    let dateTime = "";
    const xAxisData = [];
    for (let i = 0; i < this.totalDay; i++) {
      month = (datePeriod.getMonth() + 1).toString();
      date = (datePeriod.getDate()).toString();
      for (let j = 0; j < TIMES.length; j++) {
        dateTime = `${month}/${date}\n${TIMES[j]}`;
        xAxisData.push(dateTime);
      }
      datePeriod.setDate(datePeriod.getDate() + 1);
    }
    return xAxisData;
  }
}
