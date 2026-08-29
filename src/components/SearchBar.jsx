import { useState, useEffect, useRef } from "react";
import { searchCities, getQuickWeather } from "../utils/api";
import { getWeatherInfo } from "../utils/weatherCodes";
import { useSettings } from "../context/SettingsContext";

const previewGradients = {
  sunny: "linear-gradient(135deg, #4facfe, #ffde59)",
  cloudy: "linear-gradient(135deg, #757f9a, #d7dde8)",
  rainy: "linear-gradient(135deg, #4b6584, #778ca3)",
  stormy: "linear-gradient(135deg, #2c2f3a, #4a4e5c)",
  snowy: "linear-gradient(135deg, #83a4d4, #b6fbff)",
};

function SearchBar({ onSelectCity }) {
  const { t } = useSettings();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const debounceRef = useRef(null);
  const queryRef = useRef("");

  useEffect(() => {
    queryRef.current = query;

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const requestQuery = query;

    debounceRef.current = setTimeout(() => {
      runSearch(requestQuery);
    }, 550);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  async function runSearch(requestQuery) {
    setSearching(true);
    try {
      const cities = await searchCities(requestQuery);

      if (requestQuery !== queryRef.current) return;

      const withPreview = await Promise.all(
        cities.map(async (city) => {
          try {
            const w = await getQuickWeather(city.latitude, city.longitude);
            const info = getWeatherInfo(w.current_weather.weathercode);
            return {
              ...city,
              isDay: w.current_weather.is_day === 1,
              category: info.category,
            };
          } catch {
            return { ...city, isDay: true, category: "sunny" };
          }
        }),
      );

      if (requestQuery !== queryRef.current) return;

      setResults(withPreview);
    } catch {
      if (requestQuery === queryRef.current) setResults([]);
    } finally {
      if (requestQuery === queryRef.current) setSearching(false);
    }
  }

  function handleSelect(city) {
    onSelectCity(city);
    setQuery("");
    setResults([]);
    setShowResults(false);
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 150)}
        placeholder={t.searchPlaceholder}
        className="search-input"
      />
      {searching && <div className="search-loading">{t.searching}</div>}
      {showResults && results.length > 0 && (
        <ul className="search-results">
          {results.map((city) => (
            <li
              key={`${city.latitude}-${city.longitude}`}
              onMouseDown={() => handleSelect(city)}
              style={{
                background:
                  previewGradients[city.category] || previewGradients.sunny,
              }}
            >
              <span className="city-name">
                {city.isDay ? "☀️" : "🌙"} {city.name}
              </span>
              <span className="city-country">{city.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
