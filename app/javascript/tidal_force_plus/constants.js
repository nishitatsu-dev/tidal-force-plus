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
