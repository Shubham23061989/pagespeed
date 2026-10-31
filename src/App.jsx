import { useState } from "react";
import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import History from "./components/History.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { SHOW_HISTORY_TAB } from "./config.js";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [history, setHistory] = useLocalStorage("speedDeckHistory.v1", {});

  const showHistory = SHOW_HISTORY_TAB && tab === "history";

  return (
    <div className="shell">
      <Header tab={tab} setTab={setTab} />
      {showHistory ? (
        <History history={history} />
      ) : (
        <Dashboard history={history} setHistory={setHistory} />
      )}
    </div>
  );
}
