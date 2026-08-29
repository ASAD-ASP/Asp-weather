import SearchBar from "./SearchBar";
import CitySlider from "./CitySlider";
import AnimatedTitle from "./AnimatedTitle";
import LocalClock from "./LocalClock";
import ProfileCard from "./ProfileCard";
import StatsBar from "./StatsBar";
import QuickActions from "./QuickActions";
import { useSettings } from "../context/SettingsContext";

const edgeColors = {
  "sunny-day": "#ffde59",
  "sunny-night": "#4a5a8f",
  "cloudy-day": "#a9b8cc",
  "cloudy-night": "#3d4a6b",
  "rainy-day": "#778ca3",
  "rainy-night": "#34455c",
  "stormy-day": "#52586a",
  "stormy-night": "#3a3a4a",
  "snowy-day": "#b6fbff",
  "snowy-night": "#2d4566",
};

function Sidebar({
  onSelectCity,
  savedCities,
  activeCityName,
  category,
  isDay,
  weather,
  onToggleFavorite,
  onRefresh,
  onRandom,
  onRemove,
}) {
  const { t } = useSettings();
  const mode = isDay ? "day" : "night";
  const edgeColor = edgeColors[`${category}-${mode}`] || "#ffffff";

  const lastCity = [...savedCities].sort(
    (a, b) => (b.lastVisited || 0) - (a.lastVisited || 0),
  )[0];

  return (
    <aside className="sidebar" style={{ "--sidebar-edge": edgeColor }}>
      <div className="mobile-only-clock">
        <LocalClock weather={weather} labels={t.clock} />
      </div>

      <ProfileCard
        title={t.sidebarExtra.profileTitle}
        subtitle={t.sidebarExtra.profileSubtitle}
      />

      <AnimatedTitle text={t.sidebarTitle} category={category} isDay={isDay} />
      <SearchBar onSelectCity={onSelectCity} />

      <QuickActions
        onRefresh={onRefresh}
        onRandom={onRandom}
        labels={{
          refresh: t.sidebarExtra.refresh,
          surprise: t.sidebarExtra.surprise,
        }}
      />

      <StatsBar
        count={savedCities.length}
        lastCityName={lastCity?.name}
        labels={{
          savedCount: t.sidebarExtra.savedCount,
          lastVisited: t.sidebarExtra.lastVisited,
        }}
      />

      <CitySlider
        cities={savedCities}
        activeCityName={activeCityName}
        onSelect={onSelectCity}
        onToggleFavorite={onToggleFavorite}
        onRemove={onRemove}
        myCitiesLabel={t.myCities}
      />
    </aside>
  );
}

export default Sidebar;
