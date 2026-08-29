const CITIES_KEY = "savedCities";
const ACTIVE_KEY = "activeCity";
const MAX_ITEMS = 8;

export function getSavedCities() {
  try {
    const data = localStorage.getItem(CITIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function persist(list) {
  localStorage.setItem(CITIES_KEY, JSON.stringify(list));
  return list;
}

export function addSavedCity(city) {
  const current = getSavedCities();
  const idx = current.findIndex(
    (c) => c.name === city.name && c.country === city.country,
  );

  const entry = {
    name: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
    favorite: idx >= 0 ? current[idx].favorite : false,
    lastVisited: Date.now(),
  };

  let updated;
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = entry;
  } else {
    updated = [...current, entry].slice(-MAX_ITEMS);
  }

  return persist(updated);
}

export function toggleFavoriteCity(city) {
  const current = getSavedCities();
  const updated = current.map((c) =>
    c.name === city.name && c.country === city.country
      ? { ...c, favorite: !c.favorite }
      : c,
  );
  return persist(updated);
}

export function removeSavedCity(city) {
  const updated = getSavedCities().filter(
    (c) => !(c.name === city.name && c.country === city.country),
  );
  return persist(updated);
}

export function setActiveCity(city) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(city));
}

export function getActiveCity() {
  try {
    const data = localStorage.getItem(ACTIVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
