import { getWeatherInfo } from "../utils/weatherCodes";
import {
  convertTemp,
  tempUnitSymbol,
  convertWind,
  windUnitSymbol,
} from "../utils/units";
import { useSettings } from "../context/SettingsContext";

function getFeelsLike(weather) {
  if (
    !weather?.hourly?.apparent_temperature ||
    !weather?.current_weather?.time
  ) {
    return null;
  }
  const hour = Number(weather.current_weather.time.slice(11, 13));
  return weather.hourly.apparent_temperature[hour] ?? null;
}

function CurrentWeather({ weather, cityName }) {
  const { settings, t } = useSettings();

  if (!weather) return null;

  const { temperature, windspeed } = weather.current_weather;
  const weatherCode = weather.current_weather.weathercode;
  const humidity = weather.hourly.relative_humidity_2m[0];
  const { textKey } = getWeatherInfo(weatherCode);
  const description = t.conditions[textKey] || t.conditions.unknown;

  const displayTemp = convertTemp(temperature, settings.tempUnit);
  const displayWind = convertWind(windspeed, settings.windUnit);
  const unit = tempUnitSymbol(settings.tempUnit);

  const feelsLikeRaw = getFeelsLike(weather);
  const feelsLike =
    feelsLikeRaw != null ? convertTemp(feelsLikeRaw, settings.tempUnit) : null;

  return (
    <div className="current-weather">
      <h2>{cityName}</h2>
      <p className="temperature">
        {displayTemp}
        {unit}
      </p>
      {feelsLike != null && (
        <p className="feels-like">
          {t.feelsLike}: {feelsLike}
          {unit}
        </p>
      )}
      <p className="description">{description}</p>
      <div className="details">
        <span>
          💧 {t.humidity}: {humidity}%
        </span>
        <span>
          💨 {t.windLabel}: {displayWind} {windUnitSymbol(settings.windUnit)}
        </span>
      </div>
    </div>
  );
}

export default CurrentWeather;
