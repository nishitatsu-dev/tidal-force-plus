import {
  HOUR_PER_DAY,
  G,
  MASS_SUN,
  EARTH_RADIUS,
  AU,
} from "tidal_force_plus/constants";

// 太陽に関わる計算
export default class Sun {
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
