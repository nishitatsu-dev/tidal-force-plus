const HOUR_PER_DAY = 24;
const TIMES = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export default class CalcResultsPage {
  constructor(calcResultsTbodyTarget) {
    this.calcResultsTbodyTarget = calcResultsTbodyTarget;
  }

  makeNewTable(pageId) {
    const calcResults = this.#getCalcResults();

    for (let row = 0; row < HOUR_PER_DAY; row++) {
      const tr = document.createElement("tr");
      const tdTime = document.createElement("td");
      tdTime.className = "h-10";
      tdTime.textContent = TIMES[row];
      tr.appendChild(tdTime);
      for (let col = 0; col < 8; col++) {
        const td = document.createElement("td");
        td.textContent = calcResults[col][pageId][row];
        tr.appendChild(td);
      }
      this.calcResultsTbodyTarget.appendChild(tr);
    }
  }

  #getCalcResults() {
    const totalDay = sessionStorage.getItem("totalDay");
    const moonVerticals2D = this.#transform1DTo2D(
      sessionStorage.getItem("moonVerticals").split(","),
      HOUR_PER_DAY,
      totalDay,
    );
    const sunVerticals2D = this.#transform1DTo2D(
      sessionStorage.getItem("sunVerticals").split(","),
      HOUR_PER_DAY,
      totalDay,
    );
    const moonAndSunVerticals2D = this.#transform1DTo2D(
      sessionStorage.getItem("moonAndSunVerticals").split(","),
      HOUR_PER_DAY,
      totalDay,
    );
    const jupiterDistances2D = this.#transform1DTo2D(
      sessionStorage.getItem("jupiterDistances").split(","),
      HOUR_PER_DAY,
      totalDay,
    );
    const moonLateralStrengths2D = this.#transform1DTo2D(
      sessionStorage.getItem("moonLateralStrengths").split(","),
      HOUR_PER_DAY,
      totalDay,
    );
    const sunLateralStrengths2D = this.#transform1DTo2D(
      sessionStorage.getItem("sunLateralStrengths").split(","),
      HOUR_PER_DAY,
      totalDay,
    );
    const moonLateralAzimuths2D = this.#transform1DTo2D(
      sessionStorage.getItem("moonLateralAzimuths").split(","),
      HOUR_PER_DAY,
      totalDay,
    );
    const sunLateralAzimuths2D = this.#transform1DTo2D(
      sessionStorage.getItem("sunLateralAzimuths").split(","),
      HOUR_PER_DAY,
      totalDay,
    );

    return [
      moonVerticals2D,
      sunVerticals2D,
      moonAndSunVerticals2D,
      jupiterDistances2D,
      moonLateralStrengths2D,
      sunLateralStrengths2D,
      moonLateralAzimuths2D,
      sunLateralAzimuths2D,
    ];
  }

  #transform1DTo2D(array, step, iteration) {
    const array2D = [];
    for (let i = 0; i < iteration; i++) {
      array2D.push(array.slice(i * step, (i + 1) * step));
    }
    return array2D;
  }
}
