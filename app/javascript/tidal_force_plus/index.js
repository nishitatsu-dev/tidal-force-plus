import { LOCATION } from "tidal_force_plus/constants";
import ObserverState from "tidal_force_plus/observer_state";
import Moon from "tidal_force_plus/moon";
import Sun from "tidal_force_plus/sun";
import TidalForce from "tidal_force_plus/tidal_force";
import Jupiter from "tidal_force_plus/jupiter";

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
