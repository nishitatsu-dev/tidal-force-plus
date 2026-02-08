import {
  MSEC_PER_DAY,
  MIN_PER_HOUR,
  SEC_PER_HOUR,
  HOUR_PER_DAY,
  UNIX_EPOCH_JULIAN_DATE,
  DELTA_T,
} from "tidal_force_plus/constants";

// 観測地点の条件を指定
export default class ObserverState {
  constructor(firstDate, lastDate, location) {
    this.firstDate = firstDate;
    this.lastDate = lastDate;
    this.location = location;
  }

  get getDateTimeDetails() {
    const firstDay = new Date(this.firstDate);
    const lastDay = new Date(this.lastDate);
    const firstJulianDay =
      firstDay.getTime() / MSEC_PER_DAY + UNIX_EPOCH_JULIAN_DATE; // UNIXエポックで午前0時の値に補正済み
    const timeZoneOffset = firstDay.getTimezoneOffset() / MIN_PER_HOUR;
    const totalDay = Math.round((lastDay - firstDay) / MSEC_PER_DAY) + 1;
    return {
      firstJulianDay: firstJulianDay,
      timeZoneOffset: timeZoneOffset,
      totalDay: totalDay,
    };
  }

  get getJulianCenturyNumberTs() {
    const dateTimeDetails = this.getDateTimeDetails;
    let julianCenturyNumberT = 0;
    const julianCenturyNumberTs = [];
    const deltaT = DELTA_T["20170101"] / SEC_PER_HOUR;
    for (let i = 0; i < dateTimeDetails["totalDay"]; i++) {
      julianCenturyNumberT =
        (dateTimeDetails["firstJulianDay"] + i - 2451545) / 36525; // ユリウス世紀、日の部分
      julianCenturyNumberTs[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        julianCenturyNumberTs[i][j] =
          julianCenturyNumberT +
          (deltaT + j + dateTimeDetails["timeZoneOffset"]) / 24 / 36525; // ユリウス世紀、時間の部分
      }
    }
    return julianCenturyNumberTs;
  }

  #calcGreenwichSiderealTimes() {
    const julianCenturyNumberTs = this.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const dateTimeDetails = this.getDateTimeDetails;
    const greenwichSiderealTimes = [];
    let t = 0;
    let gst = 0;
    // forループ内の計算について
    // グリニッジ恒星時の計算式：6.697375 + 2400.0513369 * t + 0.0000259 * t * t + UTS
    // （UTS = 地方時 + 時差（日本は−9））
    // 第1, 3, 4項を先に算出し、第2項を後から加算する。
    // 第2項は値が大きいので、24時=0時として加算。剰余の計算はマイナスの場合にも対応
    for (let i = 0; i < length; i++) {
      greenwichSiderealTimes[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        t = julianCenturyNumberTs[i][j];
        gst =
          6.697375 + 0.0000259 * t * t + j + dateTimeDetails["timeZoneOffset"];
        gst = gst + ((((2400.0513369 * t) % 24) + 24) % 24);
        gst = ((gst % 24) + 24) % 24;
        greenwichSiderealTimes[i][j] = gst;
      }
    }
    // 単位：時
    return greenwichSiderealTimes;
  }

  calcLocalHourAngles(equatorialLons) {
    const greenwichSiderealTimes = this.#calcGreenwichSiderealTimes();
    const length = greenwichSiderealTimes.length;
    const localHourAngles = [];
    let localHourAngle = 0;
    const localLon = this.location["longitude"] / 15; // 度→時に単位変換
    // forループ内のequatorialLons（ある瞬時の天体の赤経）も、度→時に単位変換している
    for (let i = 0; i < length; i++) {
      localHourAngles[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        localHourAngle =
          greenwichSiderealTimes[i][j] + localLon - equatorialLons[i][j] / 15;
        localHourAngle = ((localHourAngle % 24) + 24) % 24;
        localHourAngles[i][j] = localHourAngle;
      }
    }
    // 単位：時
    return localHourAngles;
  }
}
