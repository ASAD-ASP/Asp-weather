import { getWeatherInfo } from "../utils/weatherCodes";
import { convertTemp, tempUnitSymbol } from "../utils/units";
import { useSettings } from "../context/SettingsContext";

function DailyForecast({ weather }) {
  const { settings, t } = useSettings();

  if (!weather) return null;

  const { time, temperature_2m_max, temperature_2m_min, weathercode } =
    weather.daily;
  const days = time.slice(0, 5);
  const unit = tempUnitSymbol(settings.tempUnit);

  return (
    <div className="daily-forecast">
      <h3>{t.forecastTitle}</h3>
      <div className="forecast-list">
        {days.map((dateStr, i) => {
          const date = new Date(dateStr);
          const dayName = i === 0 ? t.todayLabel : t.weekdays[date.getDay()];
          const { icon } = getWeatherInfo(weathercode[i]);

          return (
            <div key={dateStr} className="forecast-day">
              <span className="day-name">{dayName}</span>
              <span className="day-icon">{icon}</span>
              <span className="day-temps">
                <span className="temp-max">
                  {convertTemp(temperature_2m_max[i], settings.tempUnit)}
                  {unit}
                </span>
                <span className="temp-min">
                  {convertTemp(temperature_2m_min[i], settings.tempUnit)}
                  {unit}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyForecast;
