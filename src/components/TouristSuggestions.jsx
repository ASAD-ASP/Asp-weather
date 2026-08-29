import { useState, useEffect } from "react";

const wikiLangMap = {
  fa: "fa",
  en: "en",
  ar: "ar",
  fr: "fr",
  es: "es",
};

async function fetchNearbyAttractions(lat, lon, langCode) {
  const wiki = wikiLangMap[langCode] || "en";
  const url =
    `https://${wiki}.wikipedia.org/w/api.php?action=query&generator=geosearch` +
    `&ggscoord=${lat}|${lon}&ggsradius=10000&ggslimit=6` +
    `&prop=pageimages|extracts&exintro=1&explaintext=1&exchars=110` +
    `&pithumbsize=300&format=json&origin=*`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("خطا در دریافت پیشنهادها");
  const data = await response.json();

  if (!data.query || !data.query.pages) return [];

  return Object.values(data.query.pages)
    .filter((p) => p.thumbnail)
    .map((p) => ({
      id: p.pageid,
      title: p.title,
      extract: p.extract,
      thumbnail: p.thumbnail?.source,
      url: `https://${wiki}.wikipedia.org/?curid=${p.pageid}`,
    }));
}

function TouristSuggestions({
  lat,
  lon,
  language,
  title,
  loadingText,
  emptyText,
  closeLabel,
}) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lat == null || lon == null) return;

    let cancelled = false;
    setVisible(true);
    setLoading(true);
    setPlaces([]);

    fetchNearbyAttractions(lat, lon, language)
      .then((results) => {
        if (!cancelled) setPlaces(results);
      })
      .catch(() => {
        if (!cancelled) setPlaces([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon, language]);

  if (!visible) return null;

  return (
    <div className="tourist-notification">
      <div className="tourist-header">
        <span>🧭 {title}</span>
        <button className="tourist-close" onClick={() => setVisible(false)}>
          {closeLabel}
        </button>
      </div>

      {loading && <div className="tourist-loading">{loadingText}</div>}

      {!loading && places.length === 0 && (
        <div className="tourist-loading">{emptyText}</div>
      )}

      {!loading && places.length > 0 && (
        <div className="tourist-scroll">
          {places.map((place, i) => (
            <a
              key={place.id}
              href={place.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tourist-card"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <img src={place.thumbnail} alt={place.title} loading="lazy" />
              <div className="tourist-card-body">
                <strong>{place.title}</strong>
                <p>{place.extract}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default TouristSuggestions;
