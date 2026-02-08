import { HOUR_PER_DAY } from "tidal_force_plus/constants";

// 座標系の変換（黄道座標系→赤道座標系→地平座標系（水平座標系））
export default class CoordinatesConverter {
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
