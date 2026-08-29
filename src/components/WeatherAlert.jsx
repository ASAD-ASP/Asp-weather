import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";

function WeatherAlert({ weather, category }) {
  const { t } = useSettings();
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(new Set());
  }, [weather?.current_weather?.time]);

  if (!weather) return null;

  const { temperature, windspeed } = weather.current_weather;
  const alerts = [];

  if (windspeed >= 50) {
    alerts.push({ key: "wind", icon: "💨", text: t.alerts.strongWind });
  }
  if (temperature >= 40) {
    alerts.push({ key: "heat", icon: "🔥", text: t.alerts.extremeHeat });
  }
  if (temperature <= -10) {
    alerts.push({ key: "cold", icon: "🥶", text: t.alerts.extremeCold });
  }
  if (category === "stormy") {
    alerts.push({ key: "storm", icon: "⛈️", text: t.alerts.thunderstorm });
  }

  const visible = alerts.filter((a) => !dismissed.has(a.key));
  if (visible.length === 0) return null;

  return (
    <div className="weather-alerts">
      {visible.map((a) => (
        <div key={a.key} className="weather-alert">
          <span className="alert-icon">{a.icon}</span>
          <span className="alert-text">{a.text}</span>
          <button
            className="alert-dismiss"
            onClick={() => setDismissed((prev) => new Set(prev).add(a.key))}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default WeatherAlert;
