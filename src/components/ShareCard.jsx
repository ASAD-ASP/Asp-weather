import { useRef } from "react";
import html2canvas from "html2canvas";
import { getWeatherInfo } from "../utils/weatherCodes";
import { convertTemp, tempUnitSymbol } from "../utils/units";
import { useSettings } from "../context/SettingsContext";

const gradients = {
  "sunny-day": "linear-gradient(135deg, #4facfe, #ffde59)",
  "sunny-night": "linear-gradient(135deg, #0d1b3e, #4a5a8f)",
  "cloudy-day": "linear-gradient(135deg, #6b7a93, #d7dde0)",
  "cloudy-night": "linear-gradient(135deg, #151d33, #3d4a6b)",
  "rainy-day": "linear-gradient(135deg, #4b6584, #778ca3)",
  "rainy-night": "linear-gradient(135deg, #10192b, #34455c)",
  "stormy-day": "linear-gradient(135deg, #383d4a, #52586a)",
  "stormy-night": "linear-gradient(135deg, #1c1c26, #3a3a4a)",
  "snowy-day": "linear-gradient(135deg, #83a4d4, #b6fbff)",
  "snowy-night": "linear-gradient(135deg, #0f1b30, #2d4566)",
};

function ShareCard({ weather, cityName, category, isDay, label }) {
  const { settings, t } = useSettings();
  const exportRef = useRef(null);

  async function handleShare() {
    if (!weather || !exportRef.current) return;

    const node = exportRef.current;
    node.style.display = "flex";

    try {
      const canvas = await html2canvas(node, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `weather-${cityName}.png`, {
          type: "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: cityName,
              text: `${cityName} — ${Math.round(weather.current_weather.temperature)}°`,
            });
          } catch {
            downloadBlob(blob, `weather-${cityName}.png`);
          }
        } else {
          downloadBlob(blob, `weather-${cityName}.png`);
        }
      }, "image/png");
    } finally {
      node.style.display = "none";
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!weather) return null;

  const { textKey, icon } = getWeatherInfo(weather.current_weather.weathercode);
  const description = t.conditions[textKey] || t.conditions.unknown;
  const temp = convertTemp(
    weather.current_weather.temperature,
    settings.tempUnit,
  );
  const unit = tempUnitSymbol(settings.tempUnit);
  const mode = isDay ? "day" : "night";
  const bg = gradients[`${category}-${mode}`] || gradients["sunny-day"];

  return (
    <>
      <button className="share-btn" onClick={handleShare}>
        📤 {label}
      </button>

      {/* نسخه‌ی مخفی مخصوص خروجی عکس */}
      <div className="export-card" ref={exportRef} style={{ background: bg }}>
        <div className="export-icon">{icon}</div>
        <div className="export-city">{cityName}</div>
        <div className="export-temp">
          {temp}
          {unit}
        </div>
        <div className="export-desc">{description}</div>
        <div className="export-footer">Weather App</div>
      </div>
    </>
  );
}

export default ShareCard;
