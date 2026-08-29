import { useState, useEffect } from "react";

function formatTime(date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
}

function formatCalendar(date, calendar) {
  return new Intl.DateTimeFormat(`en-u-ca-${calendar}`, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function LocalClock({ weather, labels }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!weather || weather.utc_offset_seconds === undefined) return null;

  // ساعت UTC فعلی مرورگر + آفست همان شهر = ساعت محلی همان شهر
  const shifted = new Date(now + weather.utc_offset_seconds * 1000);

  return (
    <div className="local-clock">
      <div className="clock-time">{formatTime(shifted)}</div>
      <div className="clock-dates">
        <span>
          📅 {labels.gregorian}: {formatCalendar(shifted, "gregory")}
        </span>
        <span>
          🌙 {labels.persian}: {formatCalendar(shifted, "persian")}
        </span>
        <span>
          ☪️ {labels.islamic}: {formatCalendar(shifted, "islamic")}
        </span>
      </div>
    </div>
  );
}

export default LocalClock;
