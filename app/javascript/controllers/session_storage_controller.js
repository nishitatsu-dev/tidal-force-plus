import { Controller } from "@hotwired/stimulus"
import * as tidalForcePlus from "tidal_force_plus";
import DatasetBuilder from "dataset_builder";
import CalcResultsFormatter from "calc_results_formatter";

// Connects to data-controller="session-storage"
export default class extends Controller {
  static targets = ["locationSelect", "firstDateField", "lastDateField"];

  setItem() {
    const location = this.locationSelectTarget.value;
    const firstDate = this.firstDateFieldTarget.value;
    const lastDate = this.lastDateFieldTarget.value;
    const main = new tidalForcePlus.Main(firstDate, lastDate, location);

    this.#setBasicParams(main, firstDate, lastDate);
    this.#setTidalForcePlus(main);
  }

  #setBasicParams(main, firstDate, lastDate) {
    const totalDay = main.getTotalDay;
    const datasetBuilder = new DatasetBuilder(firstDate, totalDay);
    const xAxisData = datasetBuilder.buildXAxisData();

    sessionStorage.setItem("firstDay", firstDate);
    sessionStorage.setItem("lastDay", lastDate);
    sessionStorage.setItem("totalDay", totalDay);
    sessionStorage.setItem("xAxisData", xAxisData);
  }

  #setTidalForcePlus(main) {
    const moonTidalForces = main.getMoonTidalForces;
    const sunTidalForces = main.getSunTidalForces;
    const jupiterDistances = main.getJupiterDistances;

    const moonVerticals = moonTidalForces.verticals.flat();
    const sunVerticals = sunTidalForces.verticals.flat();
    const moonAndSunVerticals = moonVerticals.map((v, i) => v + sunVerticals[i]);

    const moonLateralStrengths = moonTidalForces.laterals.strengths.flat();
    const moonLateralAzimuths = moonTidalForces.laterals.azimuths.flat();
    const sunLateralStrengths = sunTidalForces.laterals.strengths.flat();
    const sunLateralAzimuths = sunTidalForces.laterals.azimuths.flat();

    const formatter = new CalcResultsFormatter(6, 4);
    sessionStorage.setItem("moonVerticals", formatter.format(moonVerticals));
    sessionStorage.setItem("sunVerticals", formatter.format(sunVerticals));
    sessionStorage.setItem("moonAndSunVerticals", formatter.format(moonAndSunVerticals));
    sessionStorage.setItem("jupiterDistances", formatter.formatPrecision(jupiterDistances.flat()));

    sessionStorage.setItem("moonLateralStrengths", formatter.format(moonLateralStrengths));
    sessionStorage.setItem("moonLateralAzimuths", formatter.formatPrecision(moonLateralAzimuths));
    sessionStorage.setItem("sunLateralStrengths", formatter.format(sunLateralStrengths));
    sessionStorage.setItem("sunLateralAzimuths", formatter.formatPrecision(sunLateralAzimuths));
  }
}
