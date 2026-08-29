import { useState, useEffect } from "react";
import { getAirQuality } from "../utils/api";

function getAqiInfo(aqi, labels) {
  if (aqi == null) return { label: "—", color: "#999" };
  if (aqi <= 50) return { label: labels.good, color: "#7ee787" };
  if (aqi <= 100) return { label: labels.moderate, color: "#ffd93d" };
  if (aqi <= 150) return { label: labels.poor, color: "#ff9f45" };
  return { label: labels.hazardous, color: "#ff5c5c" };
}

function AirQuality({ lat, lon, labels }) {
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lat == null || lon == null) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    getAirQuality(lat, lon)
      .then((data) => {
        if (cancelled) return;
        setAqi(data?.current?.us_aqi ?? null);
      })
      .catch(() => {
        if (!cancelled) setAqi(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  if (loading) return null;

  const info = getAqiInfo(aqi, labels);

  return (
    <div className="air-quality" style={{ "--aqi-color": info.color }}>
      <span className="aqi-dot"></span>
      <span className="aqi-label">{labels.title}:</span>
      <span className="aqi-value">{aqi ?? "—"}</span>
      <span className="aqi-category">{info.label}</span>
    </div>
  );
}

export default AirQuality;
