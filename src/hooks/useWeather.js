import { useCallback, useState } from "react";
import { getWeatherByCoords } from "../utils/api";

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadWeather = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCoords(lat, lon);
      setWeather(data);
    } catch (err) {
      setError(err?.message || "خطا در دریافت اطلاعات هوا");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    weather,
    loading,
    error,
    loadWeather,
  };
}
