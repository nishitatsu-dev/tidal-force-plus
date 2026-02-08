import {
  HOUR_PER_DAY,
  G,
  MASS_MOON,
  EARTH_RADIUS,
} from "tidal_force_plus/constants";

// 月に関わる計算
export default class Moon {
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
