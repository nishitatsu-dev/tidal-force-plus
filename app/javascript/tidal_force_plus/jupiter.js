import { HOUR_PER_DAY } from "tidal_force_plus/constants";
import OriginConverter from "tidal_force_plus/origin_converter";

// 木星に関わる計算
export default class Jupiter {
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
