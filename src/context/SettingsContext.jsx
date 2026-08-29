import { createContext, useContext, useEffect, useState } from "react";

import { translations } from "../utils/translations";

const SettingsContext = createContext(null);

const STORAGE_KEY = "appSettings";

const defaultSettings = {
  language: "fa",
  tempUnit: "C",
  windUnit: "kmh",
  reduceMotion: false,
};

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return {
        ...defaultSettings,
        ...JSON.parse(saved),
      };
    }

    return defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    const t = translations[settings.language] || translations.fa;

    document.documentElement.dir = t.dir;
    document.documentElement.lang = settings.language;
  }, [settings]);

  function updateSetting(key, value) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const t = translations[settings.language] || translations.fa;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
