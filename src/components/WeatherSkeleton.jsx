function WeatherSkeleton() {
  return (
    <div className="skeleton-weather">
      <div className="skeleton-bar skeleton-city"></div>
      <div className="skeleton-bar skeleton-temp"></div>
      <div className="skeleton-bar skeleton-desc"></div>
      <div className="skeleton-row">
        <div className="skeleton-bar skeleton-chip"></div>
        <div className="skeleton-bar skeleton-chip"></div>
      </div>
    </div>
  );
}

export default WeatherSkeleton;
