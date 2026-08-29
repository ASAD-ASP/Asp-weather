import { useEffect, useState } from "react";
import { getQuickWeather } from "../utils/api";
import { getWeatherInfo } from "../utils/weatherCodes";

function CitySlider({
  cities,
  activeCityName,
  onSelect,
  onToggleFavorite,
  onRemove,
  myCitiesLabel,
}) {
  const [weatherMap, setWeatherMap] = useState({});

  useEffect(() => {
    if (!cities || cities.length === 0) return;

    const missing = cities.filter(
      (c) => !weatherMap[`${c.latitude}-${c.longitude}`],
    );
    if (missing.length === 0) return;

    let cancelled = false;

    Promise.all(
      missing.map(async (c) => {
        const key = `${c.latitude}-${c.longitude}`;
        try {
          const w = await getQuickWeather(c.latitude, c.longitude);
          const info = getWeatherInfo(w.current_weather.weathercode);
          return [
            key,
            {
              temp: Math.round(w.current_weather.temperature),
              icon: info.icon,
            },
          ];
        } catch {
          return [key, null];
        }
      }),
    ).then((entries) => {
      if (cancelled) return;
      setWeatherMap((prev) => {
        const next = { ...prev };
        entries.forEach(([key, val]) => {
          if (val) next[key] = val;
        });
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  if (!cities || cities.length === 0) return null;

  const sorted = [...cities].sort(
    (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0),
  );

  return (
    <div className="city-slider-wrap">
      <h4>{myCitiesLabel}</h4>
      <div className="city-slider">
        {sorted.map((city) => {
          const key = `${city.latitude}-${city.longitude}`;
          const w = weatherMap[key];
          return (
            <div
              key={key}
              className={`city-chip ${activeCityName === city.name ? "active" : ""}`}
            >
              <button className="city-chip-main" onClick={() => onSelect(city)}>
                {w && <span className="chip-icon">{w.icon}</span>}
                <span className="chip-name">{city.name}</span>
                {w && <span className="chip-temp">{w.temp}°</span>}
              </button>

              <button
                className={`chip-fav ${city.favorite ? "on" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(city);
                }}
                aria-label="toggle favorite"
              >
                {city.favorite ? "★" : "☆"}
              </button>
              <button
                className="chip-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(city);
                }}
                aria-label="remove city"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CitySlider;
