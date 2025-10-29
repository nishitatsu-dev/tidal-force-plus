export const SEC_PER_HOUR = 3600;
export const MIN_PER_HOUR = 60;
export const MSEC_PER_DAY = 86400000;
export const HOUR_PER_DAY = 24;
// 1970/1/1 0時0分（世界時）のユリウス日
export const UNIX_EPOCH_JULIAN_DATE = 2440587.5;
// ΔT。2017/1/1以降、69.184 ± 0.9秒
export const DELTA_T = { 20170101: 69.184 }; // s

export const G = 6.67428e-11; // m^3 kg^-1 s^-2
export const MASS_MOON = 7.345752822e22; // kg
export const MASS_SUN = 1.9884e30; // kg
export const EARTH_RADIUS = 6378136.6; // m
export const AU = 149597870700; // m

export const LOCATION = {
  WAKKANAI: { longitude: 141.683, latitude: 45.4 },
  NEMURO: { longitude: 145.583, latitude: 43.35 },
  OTARU: { longitude: 141, latitude: 43.2 },
  AKITA: { longitude: 140.067, latitude: 39.75 },
  SOMA: { longitude: 140.967, latitude: 37.833 },
  TOKYO: { longitude: 139.767, latitude: 35.65 },
  TOYAMA: { longitude: 137.217, latitude: 36.767 },
  NAGOYA: { longitude: 136.883, latitude: 35.083 },
  AKASHI: { longitude: 134.983, latitude: 34.65 },
  SAKAIMINATO: { longitude: 133.25, latitude: 35.55 },
  TOSASHIMIZU: { longitude: 132.967, latitude: 32.783 },
  HAKATA: { longitude: 130.4, latitude: 33.617 },
  TANEGASHIMA: { longitude: 130.967, latitude: 30.467 },
  NAHA: { longitude: 127.667, latitude: 26.217 },
  YONAGUNIJIMA: { longitude: 122.95, latitude: 24.45 },
  CHICHIJIMA: { longitude: 142.2, latitude: 27.1 },
  MINAMITORISHIMA: { longitude: 153.983, latitude: 24.283 },
};

// 起潮力・惑星距離計算の最表層
export class Main {
  constructor(first_date, last_date, location) {
    this.first_date = first_date;
    this.last_date = last_date;
    this.location = location;
  }

  get #getObserverState() {
    const location = LOCATION[this.location];
    const observerState = new ObserverState(
      this.first_date,
      this.last_date,
      location,
    );
    return observerState;
  }

  get #getSunInstance() {
    return new Sun(this.#getObserverState);
  }

  get getMoonTidalForces() {
    const moon = new Moon(this.#getObserverState);
    const moonTidalForce = new TidalForce(moon);
    const moonVerticalTidalForces = moonTidalForce.calcVerticalTidalForces();
    const moonLateralTidalForces = moonTidalForce.calcLateralTidalForces();
    return {
      verticals: moonVerticalTidalForces,
      laterals: moonLateralTidalForces,
    };
  }

  get getSunTidalForces() {
    const sunTidalForce = new TidalForce(this.#getSunInstance);
    const sunVerticalTidalForces = sunTidalForce.calcVerticalTidalForces();
    const sunLateralTidalForces = sunTidalForce.calcLateralTidalForces();
    return {
      verticals: sunVerticalTidalForces,
      laterals: sunLateralTidalForces,
    };
  }

  get getJupiterDistances() {
    const jupiter = new Jupiter(this.#getObserverState, this.#getSunInstance);
    const jupiterDistances = jupiter.getDistances;
    return jupiterDistances;
  }

  get getTotalDay() {
    return this.#getObserverState.getDateTimeDetails["totalDay"];
  }
}

// 観測地点の条件を指定
export class ObserverState {
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
      for (let j = 0; j < 24; j++) {
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

// 月に関わる計算
export class Moon {
  constructor(observerState) {
    this.observerState = observerState;
  }

  #calcLongitude(t) {
    const coefficients = [
      0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0004, 0.0004,
      0.0005, 0.0005, 0.0005, 0.0006, 0.0006, 0.0007, 0.0007, 0.0007, 0.0007,
      0.0008, 0.0009, 0.0011, 0.0012, 0.0016, 0.0018, 0.0021, 0.0021, 0.0021,
      0.0022, 0.0023, 0.0024, 0.0026, 0.0027, 0.0028, 0.0037, 0.0038, 0.004,
      0.004, 0.004, 0.005, 0.0052, 0.0068, 0.0079, 0.0085, 0.01, 0.0107, 0.011,
      0.0125, 0.0154, 0.0304, 0.0347, 0.0409, 0.0458, 0.0533, 0.0571, 0.0588,
      0.1144, 0.1851, 0.2136, 0.6583, 1.274, 6.2888,
    ];
    const degrees = [
      2322131 * t + 191,
      4067 * t + 70,
      549197 * t + 220,
      1808933 * t + 58,
      349472 * t + 337,
      381404 * t + 354,
      958465 * t + 340,
      12006 * t + 187,
      39871 * t + 223,
      509131 * t + 242,
      1745069 * t + 24,
      1908795 * t + 90,
      2258267 * t + 156,
      111869 * t + 38,
      27864 * t + 127,
      485333 * t + 186,
      405201 * t + 50,
      790672 * t + 114,
      1403732 * t + 98,
      858602 * t + 129,
      1920802 * t + 186,
      1267871 * t + 249,
      1856938 * t + 152,
      401329 * t + 274,
      341337 * t + 16,
      71998 * t + 85,
      990397 * t + 357,
      818536 * t + 151,
      922466 * t + 163,
      99863 * t + 122,
      1379739 * t + 17,
      918399 * t + 182,
      1934 * t + 145,
      541062 * t + 259,
      1781068 * t + 21,
      133 * t + 29,
      1844932 * t + 56,
      1331734 * t + 283,
      481266 * t + 205,
      31932 * t + 107,
      926533 * t + 323,
      449334 * t + 188,
      826671 * t + 111,
      1431597 * t + 315,
      1303870 * t + 246,
      489205 * t + 142,
      1443603 * t + 52,
      75870 * t + 41,
      513197.9 * t + 222.5,
      445267.1 * t + 27.9,
      441199.8 * t + 47.4,
      854535.2 * t + 148.2,
      1367733.1 * t + 280.7,
      377336.3 * t + 13.2,
      63863.5 * t + 124.2,
      966404 * t + 276.5,
      35999.05 * t + 87.53,
      954397.74 * t + 179.93,
      890534.22 * t + 145.7,
      413335.35 * t + 10.74,
      477198.868 * t + 44.963,
    ];
    const length = coefficients.length;
    let longitude = 0;
    for (let i = 0; i < length; i++) {
      longitude =
        longitude + coefficients[i] * Math.cos((degrees[i] * Math.PI) / 180);
    }
    longitude = longitude + 218.3162 + 481267.8809 * t;
    longitude = ((longitude % 360) + 360) % 360;
    return longitude;
  }

  #calcLatitude(t) {
    const coefficients = [
      0.0003, 0.0003, 0.0003, 0.0003, 0.0003, 0.0004, 0.0004, 0.0005, 0.0005,
      0.0005, 0.0006, 0.0006, 0.0007, 0.0008, 0.0009, 0.001, 0.0011, 0.0013,
      0.0013, 0.0014, 0.0015, 0.0015, 0.0015, 0.0018, 0.0018, 0.0018, 0.0019,
      0.0021, 0.0022, 0.0022, 0.0025, 0.0034, 0.0042, 0.0043, 0.0082, 0.0088,
      0.0093, 0.0172, 0.0326, 0.0463, 0.0554, 0.1733, 0.2777, 0.2806, 5.1281,
    ];
    const degrees = [
      335334 * t + 57,
      1814936 * t + 16,
      2264270 * t + 115,
      1409735 * t + 57,
      932536 * t + 282,
      1024264 * t + 352,
      2328134 * t + 149,
      948395 * t + 222,
      419339 * t + 149,
      848532 * t + 190,
      1361730 * t + 322,
      559072 * t + 134,
      1309873 * t + 205,
      972407 * t + 235,
      1787072 * t + 340,
      1297866 * t + 288,
      1914799 * t + 48,
      37935 * t + 65,
      447203 * t + 6,
      29996 * t + 129,
      996400 * t + 316,
      928469 * t + 121,
      42002 * t + 46,
      1149606 * t + 10,
      519201 * t + 181,
      820668 * t + 153,
      924402 * t + 141,
      105866 * t + 80,
      1337737 * t + 241,
      481268 * t + 308,
      860538 * t + 106,
      443331 * t + 230,
      1850935 * t + 14,
      547066 * t + 217,
      371333 * t + 55,
      471196 * t + 87,
      884531 * t + 187,
      1437599.8 * t + 273.2,
      1373736.2 * t + 239,
      69866.7 * t + 82.5,
      896537.4 * t + 104,
      407332.2 * t + 52.43,
      6003.15 * t + 48.31,
      960400.89 * t + 138.24,
      483202.019 * t + 3.273,
    ];
    const length = coefficients.length;
    let latitude = 0;
    for (let i = 0; i < length; i++) {
      latitude =
        latitude + coefficients[i] * Math.cos((degrees[i] * Math.PI) / 180);
    }
    latitude = ((latitude % 360) + 360) % 360;
    return latitude;
  }

  #calcParallax(t) {
    const coefficients = [
      0.000005, 0.000006, 0.000006, 0.000007, 0.000007, 0.000009, 0.00001,
      0.000011, 0.000011, 0.000012, 0.000013, 0.000013, 0.000013, 0.000019,
      0.000023, 0.000026, 0.000029, 0.00003, 0.000031, 0.000033, 0.000034,
      0.000041, 0.000063, 0.000064, 0.000073, 0.000078, 0.000083, 0.000084,
      0.000103, 0.000111, 0.000167, 0.000173, 0.000197, 0.000263, 0.000271,
      0.000319, 0.0004, 0.000531, 0.000858, 0.002824, 0.007842, 0.00953,
      0.05182,
    ];
    const degrees = [
      405201 * t + 140,
      99863 * t + 212,
      485333 * t + 276,
      1808933 * t + 148,
      2322131 * t + 281,
      790672 * t + 204,
      1745069 * t + 114,
      858602 * t + 219,
      1908795 * t + 180,
      2258267 * t + 246,
      401329 * t + 4,
      341337 * t + 106,
      1403732 * t + 188,
      1267871 * t + 339,
      553069 * t + 266,
      818536 * t + 241,
      990397 * t + 87,
      75870 * t + 131,
      922466 * t + 253,
      541062 * t + 349,
      918399 * t + 272,
      481266 * t + 295,
      449334 * t + 278,
      1331734 * t + 13,
      1781068 * t + 111,
      1844932 * t + 146,
      926533 * t + 53,
      63864 * t + 214,
      826671 * t + 201,
      35999 * t + 178,
      1303870 * t + 336,
      1431597 * t + 45,
      489205 * t + 232,
      513198 * t + 312,
      445267 * t + 118,
      441199.8 * t + 137.4,
      377336.3 * t + 103.2,
      854535.2 * t + 238.2,
      1367733.1 * t + 10.7,
      954397.74 * t + 269.93,
      890534.22 * t + 235.7,
      413335.35 * t + 100.74,
      477198.868 * t + 134.963,
    ];
    const length = coefficients.length;
    let parallax = 0;
    for (let i = 0; i < length; i++) {
      parallax =
        parallax + coefficients[i] * Math.cos((degrees[i] * Math.PI) / 180);
    }
    parallax = parallax + 0.950725;
    return parallax;
  }

  #calcDistance(t) {
    const distance = 1 / Math.sin((this.#calcParallax(t) * Math.PI) / 180);
    return distance;
  }

  get getLongitudes() {
    const julianCenturyNumberTs = this.observerState.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const longitudes = [];
    for (let i = 0; i < length; i++) {
      longitudes[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        longitudes[i][j] = this.#calcLongitude(julianCenturyNumberTs[i][j]);
      }
    }
    return longitudes;
  }

  get getLatitudes() {
    const julianCenturyNumberTs = this.observerState.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const latitudes = [];
    for (let i = 0; i < length; i++) {
      latitudes[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        latitudes[i][j] = this.#calcLatitude(julianCenturyNumberTs[i][j]);
      }
    }
    return latitudes;
  }

  get getDistances() {
    const julianCenturyNumberTs = this.observerState.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const distances = [];
    for (let i = 0; i < length; i++) {
      distances[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        distances[i][j] = this.#calcDistance(julianCenturyNumberTs[i][j]);
      }
    }
    // 単位は地球の赤道半径。メートルで表すには EARTH_RADIUS をかける。
    return distances;
  }

  get getCoefficientTidalForce() {
    // TidalForce計算用の係数
    // ・元の計算式は以下で、returnの式は、EARTH_RADIUSで約分したもの
    //   G * MASS_MOON * EARTH_RADIUS / (EARTH_RADIUS * EARTH_RADIUS * EARTH_RADIUS);
    // ・tidalForceの算出時に距離の３乗で割るので、距離の単位変換をここで行っている
    // ・単位質量あたり（* 1 は省略）
    return (G * MASS_MOON) / (EARTH_RADIUS * EARTH_RADIUS);
  }
}

// 太陽に関わる計算
export class Sun {
  constructor(observerState) {
    this.observerState = observerState;
  }

  #calcLongitude(t) {
    const coefficients = [
      0.0004,
      0.0004,
      0.0005,
      0.0005,
      0.0006,
      0.0007,
      0.0007,
      0.0007,
      0.0013,
      0.0015,
      0.0018,
      0.0018,
      0.002,
      0.02,
      -0.0048 * t,
      1.9147,
    ];
    const degrees = [
      31557 * t + 161,
      29930 * t + 48,
      2281 * t + 221,
      155 * t + 118,
      33718 * t + 316,
      9038 * t + 64,
      3035 * t + 110,
      65929 * t + 45,
      22519 * t + 352,
      45038 * t + 254,
      445267 * t + 208,
      19 * t + 159,
      32964 * t + 158,
      71998.1 * t + 265.1,
      35999.05 * t + 267.52,
      35999.05 * t + 267.52,
    ];
    const length = coefficients.length;
    let longitude = 0;
    for (let i = 0; i < length; i++) {
      longitude =
        longitude + coefficients[i] * Math.cos((degrees[i] * Math.PI) / 180);
    }
    longitude = longitude + 280.4659 + 36000.7695 * t;
    longitude = ((longitude % 360) + 360) % 360;
    return longitude;
  }

  #calcLatitude() {
    return 0;
  }

  #calcDistance(t) {
    const coefficients = [
      0.000005,
      0.000005,
      0.000016,
      0.000016,
      0.000031,
      0.000139,
      -0.000042 * t,
      0.016706,
    ];
    const degrees = [
      33718 * t + 226,
      22519 * t + 233,
      45038 * t + 164,
      32964 * t + 68,
      445267 * t + 298,
      71998 * t + 175,
      35999.05 * t + 177.53,
      35999.05 * t + 177.53,
    ];
    const length = coefficients.length;
    let distance = 0;
    for (let i = 0; i < length; i++) {
      distance =
        distance + coefficients[i] * Math.cos((degrees[i] * Math.PI) / 180);
    }
    distance = distance + 1.00014;
    return distance;
  }

  get getLongitudes() {
    const julianCenturyNumberTs = this.observerState.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const longitudes = [];
    for (let i = 0; i < length; i++) {
      longitudes[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        longitudes[i][j] = this.#calcLongitude(julianCenturyNumberTs[i][j]);
      }
    }
    return longitudes;
  }

  get getLatitudes() {
    const julianCenturyNumberTs = this.observerState.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const latitudes = [];
    for (let i = 0; i < length; i++) {
      latitudes[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        latitudes[i][j] = this.#calcLatitude();
      }
    }
    return latitudes;
  }

  get getDistances() {
    const julianCenturyNumberTs = this.observerState.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const distances = [];
    for (let i = 0; i < length; i++) {
      distances[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        distances[i][j] = this.#calcDistance(julianCenturyNumberTs[i][j]);
      }
    }
    // 単位は天文単位距離。メートルで表すには AU をかける。
    return distances;
  }

  get getCoefficientTidalForce() {
    // TidalForce計算用の係数
    // ・tidalForceの算出時に距離の３乗で割るので、距離の単位変換をここで行っている
    // ・単位質量あたり（* 1 は省略）
    return (G * MASS_SUN * EARTH_RADIUS) / (AU * AU * AU);
  }
}

// 木星に関わる計算
export class Jupiter {
  constructor(observerState, sun) {
    this.observerState = observerState;
    this.sun = sun;
  }

  #calcHeliocentricLongitude(t) {
    const coefficients = [
      0.00003,
      0.00009,
      0.0001,
      0.00012,
      0.00028 * t,
      0.00029,
      0.00035,
      0.00039,
      0.00094,
      0.00224,
      0.00335,
      0.00343,
      0.00397,
      0.00482,
      0.00501,
      0.00607,
      0.00699,
      0.00757,
      0.0212,
      0.02274,
      0.03557,
      0.0437 * t,
      0.05532,
      0.17575,
      5.54603,
    ];
    const degrees = [
      12691 * t + 195,
      10324 * t + 251,
      10902.8 * t + 174,
      7779.9 * t + 258.5,
      9087.8 * t + 197.2,
      9704.4 * t + 270.6,
      8473.4 * t + 241.5,
      12131.7 * t + 345.5,
      7251.8 * t + 221.3,
      1466.26 * t + 54.64,
      1284.47 * t + 244.1,
      6666.05 * t + 259.11,
      4206.81 * t + 294.77,
      4730.71 * t + 273.36,
      5449.93 * t + 206.94,
      4759.11 * t + 88.37,
      2920.69 * t + 198.68,
      9107.13 * t + 327.94,
      1822.117 * t + 73.665,
      2405.806 * t + 135.412,
      596.267 * t + 191.685,
      6071.843 * t + 218.916,
      3624.312 * t + 237.453,
      6083.2578 * t + 309.5012,
      3034.53346 * t + 289.68429,
    ];
    const length = coefficients.length;
    let helioLon = 0;
    for (let i = 0; i < length; i++) {
      helioLon =
        helioLon + coefficients[i] * Math.cos((degrees[i] * Math.PI) / 180);
    }
    helioLon = helioLon + 34.39356 + 3036.08406 * t;
    helioLon = ((helioLon % 360) + 360) % 360;
    return helioLon;
  }

  #calcHeliocentricLatitude(t) {
    const coefficients = [
      0.00006,
      0.00006,
      0.00007,
      0.00011,
      0.0002,
      0.00028,
      0.00031,
      0.00033,
      0.00038,
      0.00045,
      0.00051 * t,
      0.00063,
      0.00072,
      0.00106 * t,
      0.00185 * t,
      0.00347,
      0.02141 * t,
      0.06295,
      0.06299,
      1.30086,
    ];
    const degrees = [
      799 * t + 181,
      8494 * t + 132,
      9699 * t + 191,
      4231.5 * t + 267.9,
      12136.2 * t + 262.6,
      5432.9 * t + 75.7,
      562.9 * t + 266.8,
      4850.1 * t + 0.8,
      1225.1 * t + 214.6,
      3627.8 * t + 122.2,
      180,
      6654.4 * t + 171.6,
      2424.7 * t + 113.1,
      6049.97 * t + 339.44,
      9115.63 * t + 152.84,
      9134.65 * t + 243.22,
      3034.269 * t + 309.356,
      6068.687 * t + 223.544,
      0,
      3034.12633 * t + 203.91874,
    ];
    const length = coefficients.length;
    let helioLat = 0;
    for (let i = 0; i < length; i++) {
      helioLat =
        helioLat + coefficients[i] * Math.cos((degrees[i] * Math.PI) / 180);
    }
    helioLat = ((helioLat % 360) + 360) % 360;
    return helioLat;
  }

  #calcHeliocentricDistance(t) {
    const coefficients = [
      0.000005,
      0.000005,
      0.000009,
      0.000009,
      0.000012,
      0.000016,
      0.000017,
      0.00003 * t,
      0.000057 * t,
      0.000061,
      0.000061,
      0.000069,
      0.000129,
      0.000212,
      0.000224,
      0.000299,
      0.000306,
      0.000309 * t,
      0.000612 * t,
      0.000635,
      0.00088,
      0.002802,
      0.006134,
      0.251681,
    ];
    const degrees = [
      9560 * t + 138,
      10256 * t + 164,
      10896 * t + 84,
      12122 * t + 249,
      7830 * t + 175,
      8482 * t + 167,
      1517 * t + 288,
      180,
      9479 * t + 276,
      4840 * t + 334,
      1190 * t + 169,
      7258 * t + 125,
      6671 * t + 171,
      9113 * t + 233,
      4215 * t + 205,
      5444 * t + 124,
      601 * t + 97,
      6090 * t + 312,
      2968 * t + 19,
      1818 * t + 344,
      2406 * t + 46,
      3624.5 * t + 147.7,
      6066.1 * t + 219,
      3034.534 * t + 199.614,
    ];
    const length = coefficients.length;
    let helioDist = 0;
    for (let i = 0; i < length; i++) {
      helioDist =
        helioDist + coefficients[i] * Math.cos((degrees[i] * Math.PI) / 180);
    }
    helioDist = helioDist + 5.209105;
    return helioDist;
  }

  #calcHelioLons() {
    const julianCenturyNumberTs = this.observerState.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const helioLons = [];
    for (let i = 0; i < length; i++) {
      helioLons[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        helioLons[i][j] = this.#calcHeliocentricLongitude(
          julianCenturyNumberTs[i][j],
        );
      }
    }
    return helioLons;
  }

  #calcHelioLats() {
    const julianCenturyNumberTs = this.observerState.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const helioLats = [];
    for (let i = 0; i < length; i++) {
      helioLats[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        helioLats[i][j] = this.#calcHeliocentricLatitude(
          julianCenturyNumberTs[i][j],
        );
      }
    }
    return helioLats;
  }

  #calcHelioDists() {
    const julianCenturyNumberTs = this.observerState.getJulianCenturyNumberTs;
    const length = julianCenturyNumberTs.length;
    const helioDists = [];
    for (let i = 0; i < length; i++) {
      helioDists[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        helioDists[i][j] = this.#calcHeliocentricDistance(
          julianCenturyNumberTs[i][j],
        );
      }
    }
    return helioDists;
  }

  get #getGeocentricCoords() {
    const originConverter = new OriginConverter(this.sun);
    return originConverter.convertToGeocentricCoords(
      this.#calcHelioLons(),
      this.#calcHelioLats(),
      this.#calcHelioDists(),
    );
  }

  get getLongitudes() {
    return this.#getGeocentricCoords.geoLons;
  }

  get getLatitudes() {
    return this.#getGeocentricCoords.geoLats;
  }

  get getDistances() {
    // 単位は天文単位距離。メートルで表すには AU をかける。
    return this.#getGeocentricCoords.geoDists;
  }
}

// 起潮力の計算
export class TidalForce {
  constructor(celestialBody) {
    this.celestialBody = celestialBody;
  }

  get #getHorizontalCoords() {
    const coordsConverter = new CoordinatesConverter(this.celestialBody);
    const horizontalCoords = coordsConverter.convertToHorizontalCoords();
    return horizontalCoords;
  }

  #calcTidalForce(altitude, distance) {
    const tidalForce =
      this.celestialBody.getCoefficientTidalForce /
      (distance * distance * distance);
    const cos2A = Math.cos((altitude * Math.PI) / 90);
    const sin2A = Math.sin((altitude * Math.PI) / 90);
    const vertical = (0.5 - 1.5 * cos2A) * tidalForce;
    const lateral = 1.5 * sin2A * tidalForce;
    return [vertical, lateral];
  }

  get #getTidalForces() {
    const altitudes = this.#getHorizontalCoords["altitudes"];
    const distances = this.celestialBody.getDistances;
    const length = distances.length;
    const verticals = [];
    const laterals = [];
    for (let i = 0; i < length; i++) {
      verticals[i] = [];
      laterals[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        [verticals[i][j], laterals[i][j]] = this.#calcTidalForce(
          altitudes[i][j],
          distances[i][j],
        );
      }
    }
    return { verticals: verticals, laterals: laterals };
  }

  calcVerticalTidalForces() {
    return this.#getTidalForces["verticals"];
  }

  calcLateralTidalForces() {
    const laterals = this.#getTidalForces["laterals"];
    const celestialBodyAzimuths = this.#getHorizontalCoords["azimuths"];
    const length = laterals.length;
    const strengths = [];
    const azimuths = [];
    for (let i = 0; i < length; i++) {
      strengths[i] = [];
      azimuths[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        if (laterals[i][j] < 0) {
          strengths[i][j] = -laterals[i][j];
          azimuths[i][j] = (celestialBodyAzimuths[i][j] + 180) % 360;
        } else {
          strengths[i][j] = laterals[i][j];
          azimuths[i][j] = celestialBodyAzimuths[i][j];
        }
      }
    }
    return { strengths: strengths, azimuths: azimuths };
  }
}

// 座標系の変換（黄道座標系→赤道座標系→地平座標系（水平座標系））
export class CoordinatesConverter {
  constructor(celestialBody) {
    this.celestialBody = celestialBody;
  }

  #convertEclipticToEquatorial(eclipticLon, eclipticLat, t) {
    const lon = (eclipticLon * Math.PI) / 180;
    const lat = (eclipticLat * Math.PI) / 180;
    const obliquity = ((23.43929 - 0.01300417 * t) * Math.PI) / 180;
    const u = Math.cos(lat) * Math.cos(lon);
    const v =
      Math.cos(lat) * Math.sin(lon) * Math.cos(obliquity) -
      Math.sin(lat) * Math.sin(obliquity);
    const w =
      Math.cos(lat) * Math.sin(lon) * Math.sin(obliquity) +
      Math.sin(lat) * Math.cos(obliquity);
    // ラジアン→度
    let equatorialLon = (Math.atan(v / u) * 180) / Math.PI;
    if (u < 0) {
      equatorialLon = equatorialLon + 180;
    }
    equatorialLon = ((equatorialLon % 360) + 360) % 360;
    // ラジアン→度
    const equatorialLat = (Math.asin(w) * 180) / Math.PI;
    // 単位：度
    return [equatorialLon, equatorialLat];
  }

  #convertToEquatorialCoords() {
    const eclipticLons = this.celestialBody.getLongitudes;
    const eclipticLats = this.celestialBody.getLatitudes;
    const length = eclipticLats.length;
    const ts = this.celestialBody.observerState.getJulianCenturyNumberTs;
    const equatorialLons = [];
    const equatorialLats = [];
    for (let i = 0; i < length; i++) {
      equatorialLons[i] = [];
      equatorialLats[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        [equatorialLons[i][j], equatorialLats[i][j]] =
          this.#convertEclipticToEquatorial(
            eclipticLons[i][j],
            eclipticLats[i][j],
            ts[i][j],
          );
      }
    }
    return { equatorialLons: equatorialLons, equatorialLats: equatorialLats };
  }

  #convertEquatorialToHorizontal(equatorialLat, localHourAngle, localLat) {
    const equLat = (equatorialLat * Math.PI) / 180;
    const lha = (localHourAngle * Math.PI) / 12; // 時→ラジアン。 360 / 24 * Math.PI / 180
    const u =
      Math.sin(equLat) * Math.cos(localLat) -
      Math.cos(equLat) * Math.cos(lha) * Math.sin(localLat);
    const v = -Math.cos(equLat) * Math.sin(lha);
    const w =
      Math.sin(equLat) * Math.sin(localLat) +
      Math.cos(equLat) * Math.cos(lha) * Math.cos(localLat);
    // ラジアン→度
    let azimuth = (Math.atan(v / u) * 180) / Math.PI;
    if (u < 0) {
      azimuth = azimuth + 180;
    }
    azimuth = ((azimuth % 360) + 360) % 360;
    // ラジアン→度
    const altitude = (Math.atan(w / Math.sqrt(u * u + v * v)) * 180) / Math.PI;
    return [azimuth, altitude];
  }

  convertToHorizontalCoords() {
    const equatorialLons = this.#convertToEquatorialCoords()["equatorialLons"];
    const equatorialLats = this.#convertToEquatorialCoords()["equatorialLats"];
    const length = equatorialLats.length;
    const localHourAngles =
      this.celestialBody.observerState.calcLocalHourAngles(equatorialLons);
    const localLat =
      (this.celestialBody.observerState.location["latitude"] * Math.PI) / 180;
    const azimuths = [];
    const altitudes = [];
    for (let i = 0; i < length; i++) {
      azimuths[i] = [];
      altitudes[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        [azimuths[i][j], altitudes[i][j]] = this.#convertEquatorialToHorizontal(
          equatorialLats[i][j],
          localHourAngles[i][j],
          localLat,
        );
      }
    }
    // 単位：度
    return { azimuths: azimuths, altitudes: altitudes };
  }
}

// 日心→地心の変換
export class OriginConverter {
  constructor(sun) {
    this.sun = sun;
  }

  #convertHelioToGeo(sunLon, sunLat, sunDis, helioLon, helioLat, helioDist) {
    const sLon = (sunLon * Math.PI) / 180;
    const sLat = (sunLat * Math.PI) / 180;
    const hLon = (helioLon * Math.PI) / 180;
    const hLat = (helioLat * Math.PI) / 180;
    const a =
      sunDis * Math.cos(sLat) * Math.cos(sLon) +
      helioDist * Math.cos(hLat) * Math.cos(hLon);
    const b =
      sunDis * Math.cos(sLat) * Math.sin(sLon) +
      helioDist * Math.cos(hLat) * Math.sin(hLon);
    const c = sunDis * Math.sin(sLat) + helioDist * Math.sin(hLat);
    // ラジアン→度
    let geoLon = (Math.atan(b / a) * 180) / Math.PI;
    if (a < 0) {
      geoLon = geoLon + 180;
    }
    geoLon = ((geoLon % 360) + 360) % 360;
    // 以下２式で、ラジアン→度
    const geoLat = (Math.atan(c / Math.sqrt(a * a + b * b)) * 180) / Math.PI;
    const geoDist = Math.sqrt(a * a + b * b + c * c);
    return [geoLon, geoLat, geoDist];
  }

  convertToGeocentricCoords(helioLons, helioLats, helioDists) {
    const sunLons = this.sun.getLongitudes;
    const sunLats = this.sun.getLatitudes;
    const sunDists = this.sun.getDistances;
    const length = sunLats.length;
    const geoLons = [];
    const geoLats = [];
    const geoDists = [];
    for (let i = 0; i < length; i++) {
      geoLons[i] = [];
      geoLats[i] = [];
      geoDists[i] = [];
      for (let j = 0; j < HOUR_PER_DAY; j++) {
        [geoLons[i][j], geoLats[i][j], geoDists[i][j]] =
          this.#convertHelioToGeo(
            sunLons[i][j],
            sunLats[i][j],
            sunDists[i][j],
            helioLons[i][j],
            helioLats[i][j],
            helioDists[i][j],
          );
      }
    }
    return { geoLons, geoLats, geoDists };
  }
}
