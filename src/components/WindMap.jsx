import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function buildGrid(lat, lon, spacing = 0.6, size = 3) {
  const points = [];
  const half = Math.floor(size / 2);
  for (let i = -half; i <= half; i++) {
    for (let j = -half; j <= half; j++) {
      points.push({ lat: lat + i * spacing, lon: lon + j * spacing });
    }
  }
  return points;
}

async function fetchWindGrid(points) {
  const lats = points.map((p) => p.lat.toFixed(3)).join(",");
  const lons = points.map((p) => p.lon.toFixed(3)).join(",");
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("خطا در دریافت اطلاعات باد");
  const data = await response.json();

  const list = Array.isArray(data) ? data : [data];

  return list.map((item, i) => ({
    lat: points[i].lat,
    lon: points[i].lon,
    speed: item.current_weather?.windspeed ?? 0,
    direction: item.current_weather?.winddirection ?? 0,
  }));
}

function speedColor(speed) {
  if (speed < 15) return "#7ee787";
  if (speed < 35) return "#ffd93d";
  if (speed < 55) return "#ff9f45";
  return "#ff5c5c";
}

function windArrowIcon(speed, direction) {
  const color = speedColor(speed);
  const duration = Math.max(0.6, 2.4 - speed / 40);
  const html = `
    <div class="wind-arrow" style="
      --r: ${direction}deg;
      color: ${color};
      animation-duration: ${duration}s;
    ">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2 L18 14 L12 10.5 L6 14 Z" />
      </svg>
    </div>
  `;
  return L.divIcon({
    html,
    className: "wind-arrow-wrap",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function WindMap({ lat, lon, title, loadingText }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const layerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([lat, lon], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 12,
      subdomains: ["a", "b", "c"],
    }).addTo(mapRef.current);
    
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lat == null || lon == null || !mapRef.current) return;

    let cancelled = false;
    setLoading(true);

    mapRef.current.setView([lat, lon], 7);

    const points = buildGrid(lat, lon);

    fetchWindGrid(points)
      .then((results) => {
        if (cancelled || !mapRef.current) return;

        if (layerRef.current) {
          mapRef.current.removeLayer(layerRef.current);
        }

        const group = L.layerGroup();
        results.forEach((r) => {
          const marker = L.marker([r.lat, r.lon], {
            icon: windArrowIcon(r.speed, r.direction),
            interactive: true,
          });
          marker.bindTooltip(`${Math.round(r.speed)} km/h`, {
            direction: "top",
            offset: [0, -10],
          });
          group.addLayer(marker);
        });
        group.addTo(mapRef.current);
        layerRef.current = group;
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return (
    <div className="wind-map-card">
      <h3>{title}</h3>
      {loading && <div className="wind-map-loading">{loadingText}</div>}
      <div ref={containerRef} className="wind-map-container"></div>
    </div>
  );
}

export default WindMap;
