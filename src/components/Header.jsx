import { SHOW_HISTORY_TAB } from "../config.js";

export default function Header({ tab, setTab }) {
  return (
    <header className="hero">
      <div className="hero-top">
        <div className="brand">
          <div>
          <img src="/asian-paint-logo.avif" alt="Asian Paints" className="brand-logo" />
          
          <div className="site-brand-wrapper">
            <h1 class="app-heading">Site Speed Deck</h1>
            <span className="subtitle">PageSpeed monitoring for AP</span>
          </div>
          
        </div>
      </div>
      </div>

      {SHOW_HISTORY_TAB && (
        <nav className="tabs">
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
            Dashboard
          </button>
          <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
            History
          </button>
        </nav>
      )}
    </header>
  );
}
