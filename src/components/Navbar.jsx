import { useSettings } from "../context/SettingsContext";

function Navbar({ onUseLocation, onSelectPanel }) {
  const { t } = useSettings();

  const navItems = [
    { key: "geo", label: t.nav.geo, icon: "📍" },
    { key: "compare", label: t.nav.compare, icon: "⚖️" },
    { key: "about", label: t.nav.about, icon: "ℹ️" },
    { key: "suggestions", label: t.nav.suggestions, icon: "💡" },
    { key: "settings", label: t.nav.settings, icon: "⚙️" },
    { key: "contact", label: t.nav.contact, icon: "✉️" },
  ];

  function handleClick(key) {
    if (key === "geo") {
      onUseLocation();
    } else {
      onSelectPanel(key);
    }
  }

  return (
    <nav className="top-navbar">
      {navItems.map((item) => (
        <button
          key={item.key}
          className="nav-item"
          onClick={() => handleClick(item.key)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navbar;
