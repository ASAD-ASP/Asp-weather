import { useEffect, useState } from "react";
import { useWeather } from "./hooks/useWeather";
import { useGeolocation } from "./hooks/useGeolocation";
import { getWeatherInfo } from "./utils/weatherCodes";
import {
  getSavedCities,
  addSavedCity,
  toggleFavoriteCity,
  setActiveCity,
  getActiveCity,
} from "./utils/savedCities";
import { useSettings } from "./context/SettingsContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import InfoPanel from "./components/InfoPanel";
import CurrentWeather from "./components/CurrentWeather";
import LocalClock from "./components/LocalClock";
import TouristSuggestions from "./components/TouristSuggestions";
import WeatherAlert from "./components/WeatherAlert";
import SoundToggle from "./components/SoundToggle";
import WindMap from "./components/WindMap";
import SunTimes from "./components/SunTimes";
import AirQuality from "./components/AirQuality";
import WeatherSkeleton from "./components/WeatherSkeleton";
import CompareModal from "./components/CompareModal";
import ShareCard from "./components/ShareCard";
import HourlyChart from "./components/HourlyChart";
import DailyForecast from "./components/DailyForecast";
import WeatherBackground from "./components/WeatherBackground";
import "./index.css";

const FALLBACK_COORDS = { lat: 35.6892, lon: 51.389 };

const POPULAR_CITIES = [
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { name: "New York", country: "USA", latitude: 40.7128, longitude: -74.006 },
  { name: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357 },
  { name: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093 },
  { name: "Reykjavik", country: "Iceland", latitude: 64.1466, longitude: -21.9426 },
  { name: "Rio de Janeiro", country: "Brazil", latitude: -22.9068, longitude: -43.1729 },
  { name: "Moscow", country: "Russia", latitude: 55.7558, longitude: 37.6173 },
  { name: "Istanbul", country: "Turkey", latitude: 41.0082, longitude: 28.9784 },
  { name: "Cape Town", country: "South Africa", latitude: -33.9249, longitude: 18.4241 },
];

function App() {
  const { settings, t } = useSettings();
  const { weather, loading, error, loadWeather } = useWeather();
  const { coords, geoLoading } = useGeolocation();
  const [cityName, setCityName] = useState("");
  const [activeCoords, setActiveCoords] = useState(null);
  const [savedCities, setSavedCities] = useState(getSavedCities());
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    const active = getActiveCity();
    if (active) {
      loadWeather(active.latitude, active.longitude);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCityName(active.name);
      setActiveCoords({ lat: active.latitude, lon: active.longitude });
      return;
    }
    if (geoLoading) return;
    const target = coords || FALLBACK_COORDS;
    loadWeather(target.lat, target.lon);
    setCityName(coords ? t.yourLocation : "Tehran");
    setActiveCoords({ lat: target.lat, lon: target.lon });
  }, [coords, geoLoading]);

  function handleUseLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      loadWeather(latitude, longitude);
      setCityName(t.yourLocation);
      setActiveCoords({ lat: latitude, lon: longitude });
      localStorage.removeItem("activeCity");
    });
  }

  function handleSelectCity(city) {
    loadWeather(city.latitude, city.longitude);
    setCityName(city.name);
    setActiveCoords({ lat: city.latitude, lon: city.longitude });
    setActiveCity(city);
    const updated = addSavedCity(city);
    setSavedCities(updated);
  }

  function handleToggleFavorite(city) {
    const updated = toggleFavoriteCity(city);
    setSavedCities(updated);
  }

  function handleRefresh() {
    if (!activeCoords) return;
    loadWeather(activeCoords.lat, activeCoords.lon);
  }

  function handleRandomCity() {
    const random = POPULAR_CITIES[Math.floor(Math.random() * POPULAR_CITIES.length)];
    handleSelectCity(random);
  }

  const category = weather
    ? getWeatherInfo(weather.current_weather.weathercode).category
    : "sunny";
  const isDay = weather ? weather.current_weather.is_day === 1 : true;

  return (
    <>
      <WeatherBackground category={category} isDay={isDay} />
      <SoundToggle category={category} />

      <div className="app-container">
        <Sidebar
          onSelectCity={handleSelectCity}
          savedCities={savedCities}
          activeCityName={cityName}
          category={category}
          isDay={isDay}
          weather={weather}
          onToggleFavorite={handleToggleFavorite}
          onRefresh={handleRefresh}
          onRandom={handleRandomCity}
        />
        <main className="main-content">
          <Navbar onUseLocation={handleUseLocation} onSelectPanel={setActivePanel} />

          <WeatherAlert weather={weather} category={category} />

          <div className="weather-card-wrap">
            <LocalClock weather={weather} labels={t.clock} />
            {(loading || geoLoading) && !weather && <WeatherSkeleton />}
            {error && <p>{error}</p>}
            {weather && (
              <>
                <CurrentWeather weather={weather} cityName={cityName || t.findingLocation} />
                <SunTimes weather={weather} labels={{ sunrise: t.sunrise, sunset: t.sunset }} />
                {activeCoords && (
                  <AirQuality
                    lat={activeCoords.lat}
                    lon={activeCoords.lon}
                    labels={t.airQuality}
                  />
                )}
                <ShareCard
                  weather={weather}
                  cityName={cityName}
                  category={category}
                  isDay={isDay}
                  label={t.share}
                />
              </>
            )}
          </div>

          {activeCoords && (
            <TouristSuggestions
              lat={activeCoords.lat}
              lon={activeCoords.lon}
              language={settings.language}
              title={t.tourist.title}
              loadingText={t.tourist.loading}
              emptyText={t.tourist.empty}
              closeLabel={t.tourist.close}
              key={`${activeCoords.lat}-${activeCoords.lon}`}
            />
          )}

          <HourlyChart weather={weather} />
          <DailyForecast weather={weather} />

          {activeCoords && (
            <WindMap
              lat={activeCoords.lat}
              lon={activeCoords.lon}
              title={t.windMap.title}
              loadingText={t.windMap.loading}
            />
          )}
        </main>
      </div>
      {activePanel === "compare" ? (
        <CompareModal
          onClose={() => setActivePanel(null)}
          currentCityName={cityName}
          currentWeather={weather}
        />
      ) : (
        <InfoPanel type={activePanel} onClose={() => setActivePanel(null)} />
      )}
    </>
  );
}

export default App;