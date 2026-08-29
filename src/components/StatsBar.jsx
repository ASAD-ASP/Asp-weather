function StatsBar({ count, lastCityName, labels }) {
  if (count === 0) return null;

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-value">{count}</span>
        <span className="stat-label">{labels.savedCount}</span>
      </div>
      {lastCityName && (
        <div className="stat-item">
          <span className="stat-value">{lastCityName}</span>
          <span className="stat-label">{labels.lastVisited}</span>
        </div>
      )}
    </div>
  );
}

export default StatsBar;
