import { useSettings } from "../context/SettingsContext";
import { languageList } from "../utils/translations";

const staticPanels = {
  about: {
    title: "درباره ما",
    icon: "ℹ️",
    body: [
      "این وب‌سایت یک پروژه‌ی نمونه‌کار هواشناسی است که با React و Vite ساخته شده.",
      "اطلاعات آب‌وهوا از سرویس رایگان Open-Meteo دریافت می‌شود و به‌صورت زنده به‌روزرسانی می‌شود.",
      "هدف این پروژه، نمایش مهارت در طراحی رابط کاربری، انیمیشن، و اتصال به API است.",
    ],
  },
  suggestions: {
    title: "پیشنهادات",
    icon: "💡",
    body: [
      "به‌زودی امکان ثبت پیشنهاد و بازخورد شما برای بهبود سایت اضافه خواهد شد.",
      "ایده‌هایی مثل نقشه‌ی هوا، هشدارهای آب‌وهوایی و مقایسه‌ی چند شهر در برنامه‌ی توسعه قرار دارند.",
    ],
  },
};

const contactLinks = [
  {
    key: "instagram",
    label: "mmd.asp.li",
    href: "https://instagram.com/mmd.asp.li",
    color: "#e1306c",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.85 3.9 2.31 7.15 2.16 8.42 2.1 8.8 2.16 12 2.16zm0 5.11a4.73 4.73 0 100 9.46 4.73 4.73 0 000-9.46zm0 7.8a3.07 3.07 0 110-6.14 3.07 3.07 0 010 6.14zm5.4-8a1.1 1.1 0 100-2.2 1.1 1.1 0 000 2.2z" />
      </svg>
    ),
  },
  {
    key: "telegram",
    label: "AsadAmo",
    href: "https://t.me/AsadAmo",
    color: "#29a9eb",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M21.9 4.4L2.7 11.9c-1.2.5-1.2 1.2-.2 1.5l4.9 1.5 1.9 5.8c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.7l3-14.2c.3-1.2-.5-1.7-1.6-1.4zM8.4 14l9-5.7c.4-.3.8-.1.5.2l-7.6 6.9-.3 3.2-1.6-4.6z" />
      </svg>
    ),
  },
  {
    key: "phone",
    label: "09993434858",
    href: "tel:09993434858",
    color: "#4caf50",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .8-.3 1.1l-2.2 2.1z" />
      </svg>
    ),
  },
];

function InfoPanel({ type, onClose }) {
  const { settings, updateSetting, t } = useSettings();

  if (!type) return null;

  if (type === "contact") {
    return (
      <div className="panel-overlay" onClick={onClose}>
        <div className="panel-box" onClick={(e) => e.stopPropagation()}>
          <button className="panel-close" onClick={onClose}>
            ✕
          </button>
          <div className="panel-icon">✉️</div>
          <h3>{t.nav.contact}</h3>
          <div className="contact-links">
            {contactLinks.map((c) => (
              <a
                key={c.key}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                style={{ "--link-color": c.color }}
              >
                <span className="contact-icon">{c.icon}</span>
                <span>{c.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "settings") {
    return (
      <div className="panel-overlay" onClick={onClose}>
        <div
          className="panel-box settings-box"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="panel-close" onClick={onClose}>
            ✕
          </button>
          <div className="panel-icon">⚙️</div>
          <h3>{t.settingsPanel.title}</h3>

          <div className="settings-group">
            <span className="settings-label">{t.settingsPanel.language}</span>
            <div className="settings-options">
              {languageList.map((lang) => (
                <button
                  key={lang.code}
                  className={`settings-chip ${settings.language === lang.code ? "active" : ""}`}
                  onClick={() => updateSetting("language", lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-group">
            <span className="settings-label">{t.settingsPanel.tempUnit}</span>
            <div className="settings-options">
              <button
                className={`settings-chip ${settings.tempUnit === "C" ? "active" : ""}`}
                onClick={() => updateSetting("tempUnit", "C")}
              >
                °C
              </button>
              <button
                className={`settings-chip ${settings.tempUnit === "F" ? "active" : ""}`}
                onClick={() => updateSetting("tempUnit", "F")}
              >
                °F
              </button>
            </div>
          </div>

          <div className="settings-group">
            <span className="settings-label">{t.settingsPanel.windUnit}</span>
            <div className="settings-options">
              <button
                className={`settings-chip ${settings.windUnit === "kmh" ? "active" : ""}`}
                onClick={() => updateSetting("windUnit", "kmh")}
              >
                km/h
              </button>
              <button
                className={`settings-chip ${settings.windUnit === "mph" ? "active" : ""}`}
                onClick={() => updateSetting("windUnit", "mph")}
              >
                mph
              </button>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-toggle-row">
              <div>
                <span className="settings-label">
                  {t.settingsPanel.reduceMotion}
                </span>
                <p className="settings-desc">
                  {t.settingsPanel.reduceMotionDesc}
                </p>
              </div>
              <button
                className={`switch ${settings.reduceMotion ? "on" : ""}`}
                onClick={() =>
                  updateSetting("reduceMotion", !settings.reduceMotion)
                }
              >
                <span className="switch-knob"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const content = staticPanels[type];
  if (!content) return null;

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel-box" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>
          ✕
        </button>
        <div className="panel-icon">{content.icon}</div>
        <h3>{content.title}</h3>
        {content.body.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default InfoPanel;
