export function getWeatherInfo(code) {
  const weatherMap = {
    0: { textKey: "clearSky", category: "sunny", icon: "☀️" },
    1: { textKey: "mainlyClear", category: "sunny", icon: "🌤️" },
    2: { textKey: "partlyCloudy", category: "cloudy", icon: "⛅" },
    3: { textKey: "overcast", category: "cloudy", icon: "☁️" },
    45: { textKey: "fog", category: "cloudy", icon: "🌫️" },
    48: { textKey: "fog", category: "cloudy", icon: "🌫️" },
    51: { textKey: "drizzleLight", category: "rainy", icon: "🌦️" },
    53: { textKey: "drizzleModerate", category: "rainy", icon: "🌧️" },
    55: { textKey: "drizzleDense", category: "rainy", icon: "🌧️" },
    61: { textKey: "rainSlight", category: "rainy", icon: "🌧️" },
    63: { textKey: "rainModerate", category: "rainy", icon: "🌧️" },
    65: { textKey: "rainHeavy", category: "rainy", icon: "🌧️" },
    71: { textKey: "snowSlight", category: "snowy", icon: "🌨️" },
    73: { textKey: "snowModerate", category: "snowy", icon: "❄️" },
    75: { textKey: "snowHeavy", category: "snowy", icon: "❄️" },
    80: { textKey: "showersSlight", category: "rainy", icon: "🌦️" },
    81: { textKey: "showersModerate", category: "rainy", icon: "🌧️" },
    82: { textKey: "showersViolent", category: "rainy", icon: "🌧️" },
    95: { textKey: "thunderstorm", category: "stormy", icon: "⛈️" },
    96: { textKey: "thunderstormHailSlight", category: "stormy", icon: "⛈️" },
    99: { textKey: "thunderstormHailHeavy", category: "stormy", icon: "⛈️" },
  };

  return (
    weatherMap[code] || { textKey: "unknown", category: "sunny", icon: "❓" }
  );
}
