const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export async function searchCities(cityName) {
  const url =
    `${NOMINATIM_URL}?q=${encodeURIComponent(cityName)}` +
    `&format=json&limit=5&addressdetails=1&accept-language=fa`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("خطا در جستجوی شهر");

  const data = await response.json();

  return data.map((item) => {
    const addr = item.address || {};
    const name =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      item.display_name.split(",")[0];

    return {
      name,
      country: addr.country || "",
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    };
  });
}

export async function getQuickWeather(lat, lon) {
  const url = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("خطا در گرفتن پیش‌نمایش هوا");
  return response.json();
}

export async function getWeatherByCoords(lat, lon) {
  const url =
    `${WEATHER_URL}?latitude=${lat}&longitude=${lon}` +
    `&current_weather=true` +
    `&hourly=temperature_2m,relative_humidity_2m,apparent_temperature` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset` +
    `&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("خطا در گرفتن اطلاعات آب‌وهوا");
  return response.json();
}

export async function getAirQuality(lat, lon) {
  const url = `${AIR_QUALITY_URL}?latitude=${lat}&longitude=${lon}&current=us_aqi`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("خطا در گرفتن کیفیت هوا");
  return response.json();
}
