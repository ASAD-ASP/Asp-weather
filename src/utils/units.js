export function convertTemp(celsius, unit) {
  if (unit === "F") return Math.round((celsius * 9) / 5 + 32);
  return Math.round(celsius);
}

export function tempUnitSymbol(unit) {
  return unit === "F" ? "°F" : "°C";
}

export function convertWind(kmh, unit) {
  if (unit === "mph") return Math.round(kmh * 0.621371 * 10) / 10;
  return Math.round(kmh * 10) / 10;
}

export function windUnitSymbol(unit) {
  return unit === "mph" ? "mph" : "km/h";
}
