function formatHM(isoString) {
  if (!isoString) return "--:--";
  return isoString.slice(11, 16);
}

function SunTimes({ weather, labels }) {
  if (!weather?.daily) return null;

  const sunrise = formatHM(weather.daily.sunrise?.[0]);
  const sunset = formatHM(weather.daily.sunset?.[0]);

  return (
    <div className="sun-times">
      <div className="sun-time-item">
        <span className="sun-icon">🌅</span>
        <span className="sun-label">{labels.sunrise}</span>
        <span className="sun-value">{sunrise}</span>
      </div>
      <div className="sun-time-item">
        <span className="sun-icon">🌇</span>
        <span className="sun-label">{labels.sunset}</span>
        <span className="sun-value">{sunset}</span>
      </div>
    </div>
  );
}

export default SunTimes;
