import { HOUR_PER_DAY } from "tidal_force_plus/constants";

// 日心→地心の変換
export default class OriginConverter {
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
