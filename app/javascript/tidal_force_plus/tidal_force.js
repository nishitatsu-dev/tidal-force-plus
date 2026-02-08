import { HOUR_PER_DAY } from "tidal_force_plus/constants";
import CoordinatesConverter from "tidal_force_plus/coordinates_converter";

// 起潮力の計算
export default class TidalForce {
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
