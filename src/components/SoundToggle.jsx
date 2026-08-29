import { useState } from "react";
import { useAmbientSound } from "../hooks/useAmbientSound";

function SoundToggle({ category }) {
  const [enabled, setEnabled] = useState(false);
  useAmbientSound(category, enabled);

  return (
    <button
      className={`sound-toggle ${enabled ? "on" : ""}`}
      onClick={() => setEnabled((v) => !v)}
      aria-label="ambient sound toggle"
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}

export default SoundToggle;
