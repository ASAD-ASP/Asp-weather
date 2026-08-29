function QuickActions({ onRefresh, onRandom, labels }) {
  return (
    <div className="quick-actions">
      <button className="quick-btn" onClick={onRefresh}>
        <span>🔄</span> {labels.refresh}
      </button>
      <button className="quick-btn" onClick={onRandom}>
        <span>🎲</span> {labels.surprise}
      </button>
    </div>
  );
}

export default QuickActions;
