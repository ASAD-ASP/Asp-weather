import { useState, useEffect, useRef } from "react";
import { searchCities, getWeatherByCoords } from "../utils/api";
import { getWeatherInfo } from "../utils/weatherCodes";
import {
  convertTemp,
  tempUnitSymbol,
  convertWind,
  windUnitSymbol,
} from "../utils/units";
import { useSettings } from "../context/SettingsContext";

function CompareModal({ onClose, currentCityName, currentWeather }) {
  const { settings, t } = useSettings();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [compareCity, setCompareCity] = useState(null);
  const [compareWeather, setCompareWeather] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const cities = await searchCities(query);
        setResults(cities);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  async function handlePick(city) {
    setCompareCity(city);
    setResults([]);
    setQuery("");
    setLoadingCompare(true);
    try {
      const data = await getWeatherByCoords(city.latitude, city.longitude);
      setCompareWeather(data);
    } catch {
      setCompareWeather(null);
    } finally {
      setLoadingCompare(false);
    }
  }

  function renderCard(name, weather) {
    if (!weather) return null;
    const { temperature, windspeed } = weather.current_weather;
    const humidity = weather.hourly.relative_humidity_2m[0];
    const { textKey, icon } = getWeatherInfo(
      weather.current_weather.weathercode,
    );
    const desc = t.conditions[textKey] || t.conditions.unknown;
    const unit = tempUnitSymbol(settings.tempUnit);

    return (
      <div className="compare-card">
        <div className="compare-icon">{icon}</div>
        <div className="compare-name">{name}</div>
        <div className="compare-temp">
          {convertTemp(temperature, settings.tempUnit)}
          {unit}
        </div>
        <div className="compare-desc">{desc}</div>
        <div className="compare-row">💧 {humidity}%</div>
        <div className="compare-row">
          💨 {convertWind(windspeed, settings.windUnit)}{" "}
          {windUnitSymbol(settings.windUnit)}
        </div>
      </div>
    );
  }

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div
        className="panel-box compare-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="panel-close" onClick={onClose}>
          ✕
        </button>
        <div className="panel-icon">⚖️</div>
        <h3>{t.compare.title}</h3>

        <div className="compare-grid">
          {renderCard(currentCityName, currentWeather)}

          {compareWeather ? (
            renderCard(compareCity?.name, compareWeather)
          ) : (
            <div className="compare-placeholder">
              {loadingCompare ? t.loading : t.compare.prompt}
            </div>
          )}
        </div>

        <div className="compare-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="search-input"
          />
          {searching && <div className="search-loading">{t.searching}</div>}
          {results.length > 0 && (
            <ul className="search-results compare-results">
              {results.map((city) => (
                <li
                  key={`${city.latitude}-${city.longitude}`}
                  onMouseDown={() => handlePick(city)}
                >
                  <span>{city.name}</span>
                  <span className="city-country">{city.country}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompareModal;
