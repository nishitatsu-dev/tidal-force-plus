export default class CalcResultsFormatter {
  constructor(exponent, precision) {
    this.exponent = exponent;
    this.precision = precision;
  }

  format(values) {
    return values.map((value) =>
      (value * this.#multiplier).toPrecision(this.precision),
    );
  }

  formatPrecision(values) {
    return values.map((value) =>
      value.toPrecision(this.precision),
    );
  }

  get #multiplier() {
    return Math.pow(10, this.exponent);
  }
}
