function getColors(category, isDay) {
  if (category === "snowy") return ["#e0f7ff", "#ffffff", "#b3ecff", "#d9f4ff"];
  if (!isDay) return ["#8ea2c9", "#5f75a5", "#3d4f7d", "#6f86bd"];
  if (category === "sunny") return ["#fff3b0", "#ffd93d", "#ff9f45", "#ffe08a"];
  if (category === "rainy" || category === "stormy")
    return ["#7d97ad", "#3f5a75", "#5b7a99", "#2e4258"];
  return ["#ffffff", "#d7dde8", "#b9c4d4", "#eef2f7"];
}

function AnimatedTitle({ text, category, isDay }) {
  const colors = getColors(category, isDay);
  const mode = isDay ? "day" : "night";

  return (
    <h2
      key={`${category}-${mode}-${text}`}
      className={`animated-title ${category} ${mode}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")}, ${colors[0]})`,
      }}
    >
      {text}
    </h2>
  );
}

export default AnimatedTitle;
