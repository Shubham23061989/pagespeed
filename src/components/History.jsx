
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { band } from "./ScoreSwatch.jsx";
// import { fetchHistory } from "../lib/backendApi.js";
// import { SHOW_HISTORY_TAB } from "../config.js";

// const CATS = [
//   ["performance", "Perf"],
//   ["accessibility", "A11y"],
//   ["best_practices", "Best Pr."],
//   ["seo", "SEO"],
// ];
// const DEFAULT_VISIBLE = 5; // how many URL cards show by default, before "Show all"

// // "2026-09-18" style key from a record's timestamp, in local time -
// // matches what an <input type="date"> value looks like.
// function dateKey(ts) {
//   const d = new Date(ts);
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// export default function History({ tab, setTab }) {
//   const [serverHistory, setServerHistory] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [statusText, setStatusText] = useState("Loading…");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [query, setQuery] = useState("");
//   const [showAll, setShowAll] = useState(false);

//   const loadHistory = useCallback(async () => {
//     setLoading(true);
//     setStatusText("Fetching history…");
//     try {
//       const data = await fetchHistory();
//       setServerHistory(data);
//       setStatusText(`Last updated: ${new Date().toLocaleString()}`);
//     } catch (err) {
//       setStatusText(`Fetch failed: ${err.message || err}. Check USE_DUMMY_DATA / HISTORY_URL in src/config.js.`);
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     loadHistory();
//   }, [loadHistory]);

//   const allKeys = Object.keys(serverHistory).filter((k) => serverHistory[k] && serverHistory[k].length).sort();

//   // Unique labels for the search box's autocomplete dropdown.
//   const suggestionLabels = useMemo(() => {
//     return [...new Set(allKeys.map((k) => k.split("|")[0]))];
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [serverHistory]);

//   // Text filter (label match) + date filter, applied together.
//   const filteredGroups = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return allKeys
//       .filter((key) => !q || key.split("|")[0].toLowerCase().includes(q))
//       .map((key) => {
//         const records = selectedDate
//           ? serverHistory[key].filter((r) => dateKey(r.ts) === selectedDate)
//           : serverHistory[key];
//         return { key, records: [...records].reverse() };
//       })
//       .filter((g) => g.records.length > 0);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [serverHistory, selectedDate, query]);

//   const isFiltering = query.trim().length > 0;
//   const visibleGroups = isFiltering || showAll ? filteredGroups : filteredGroups.slice(0, DEFAULT_VISIBLE);
//   const hiddenCount = filteredGroups.length - visibleGroups.length;

//   return (
//     <section className="panel active">
//       <div className="toolbar">
//         {/* {SHOW_HISTORY_TAB && (
//           <nav className="tabs-inline">
//             <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
//               Dashboard
//             </button>
//             <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
//               History
//             </button>
//           </nav>
//         )} */}
//         <button className="ghost hiddeen-small" onClick={loadHistory} disabled={loading}>
//           Refresh
//         </button>

//         <div style={{ position: "relative", flex: "0 1 220px" }} className="search-box-wrapper">
//           <input
//             type="text"
//             list="history-url-suggestions"
//             placeholder="Filter by URL…"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onFocus={(e) => e.target.select()}
//             style={{ width: "100%", paddingRight: query ? 28 : undefined }}
//           />
//           {query && (
//             <button
//               type="button"
//               onClick={() => setQuery("")}
//               title="Clear filter"
//               style={{
//                 position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
//                 border: "none", background: "transparent", cursor: "pointer",
//                 color: "var(--ink-faint)", fontSize: 14, lineHeight: 1, padding: 4,
//               }}
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         <datalist id="history-url-suggestions">
//           {suggestionLabels.map((label) => (
//             <option key={label} value={label} />
//           ))}
//         </datalist>
//           <button className="ghost hidden-desktop" onClick={loadHistory} disabled={loading}>
//           Refresh
//         </button>
//         <div className="date-picker-wrap" style={{ marginLeft: "auto" }}>
//           <svg className="cal-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//             <rect x="3" y="5" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
//             <path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//             <circle cx="8" cy="14" r="1.2" fill="currentColor" />
//             <circle cx="12" cy="14" r="1.2" fill="currentColor" />
//             <circle cx="16" cy="14" r="1.2" fill="currentColor" />
//           </svg>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             onClick={(e) => {
//               try {
//                 e.target.showPicker();
//               } catch {
//                 // showPicker() not supported in this browser (e.g. older Safari) -
//                 // the input's own default click-to-open behavior still works.
//               }
//             }}
//           />
//         </div>
//         {selectedDate && (
//           <button className="ghost" onClick={() => setSelectedDate("")}>
//             Clear date
//           </button>
//         )}
//       </div>

//       {/* <div className="field-group" style={{ marginBottom: 18 }}>
//         <h3>Past runs</h3>
//         <p className="hint">
//           {statusText}
//           {selectedDate ? " · Showing only runs from the picked date." : ""}
//         </p>
//       </div> */}

//       {!allKeys.length ? (
//         <div className="empty">{loading ? "Loading…" : "No history data yet."}</div>
//       ) : !filteredGroups.length ? (
//         <div className="empty">
//           {selectedDate ? `No runs recorded on ${selectedDate}.` : `No URLs match "${query}".`}
//         </div>
//       ) : (
//         <>
//           {visibleGroups.map(({ key, records }) => {
//             const [label, strategy] = key.split("|");

//             return (
//               <div className="field-group history-card" key={key}>
//                 <div className="history-card-title">
//                   <div className="label">{label}</div>
//                   <span className="strategy-tag">{strategy}</span>
//                 </div>
//                 <table className="history-table">
//                   <thead>
//                     <tr>
//                       <th>When</th>
//                       {CATS.map(([k, l]) => (
//                         <th key={k}>{l}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {records.map((r, i) => (
//                       <tr key={i}>
//                         <td className="when">{new Date(r.ts).toLocaleString()}</td>
//                         {CATS.map(([k]) => {
//                           const s = r.scores[k];
//                           return (
//                             <td key={k} className={`score-${band(s)}`}>
//                               {s === null || s === undefined ? "—" : s}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             );
//           })}

//           {!isFiltering && hiddenCount > 0 && (
//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <button className="ghost" onClick={() => setShowAll(true)}>
//                 Show all ({filteredGroups.length})
//               </button>
//             </div>
//           )}
//           {!isFiltering && showAll && filteredGroups.length > DEFAULT_VISIBLE && (
//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <button className="ghost" onClick={() => setShowAll(false)}>
//                 Show first {DEFAULT_VISIBLE} only
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </section>
//   );
// }
// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { band } from "./ScoreSwatch.jsx";
// import { fetchHistory } from "../lib/backendApi.js";
// import { SHOW_HISTORY_TAB } from "../config.js";

// const CATS = [
//   ["performance", "Perf"],
//   ["accessibility", "A11y"],
//   ["best_practices", "Best Pr."],
//   ["seo", "SEO"],
// ];
// const DEFAULT_VISIBLE = 5; // how many URL cards show by default, before "Show all"
// const MAX_SUGGESTIONS = 8; // cap dropdown length so it stays scannable

// // "2026-09-18" style key from a record's timestamp, in local time -
// // matches what an <input type="date"> value looks like.
// function dateKey(ts) {
//   const d = new Date(ts);
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// export default function History({ tab, setTab }) {
//   const [serverHistory, setServerHistory] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [statusText, setStatusText] = useState("Loading…");
//   const [selectedDate, setSelectedDate] = useState("");

//   // --- URL search / selection state ---
//   const [query, setQuery] = useState("");
//   const [selectedLabel, setSelectedLabel] = useState(null); // null = no URL picked yet
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [showAll, setShowAll] = useState(false);
//   const searchWrapperRef = useRef(null);

//   const loadHistory = useCallback(async () => {
//     setLoading(true);
//     setStatusText("Fetching history…");
//     try {
//       const data = await fetchHistory();
//       setServerHistory(data);
//       setStatusText(`Last updated: ${new Date().toLocaleString()}`);
//     } catch (err) {
//       setStatusText(`Fetch failed: ${err.message || err}. Check USE_DUMMY_DATA / HISTORY_URL in src/config.js.`);
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     loadHistory();
//   }, [loadHistory]);

//   // Close the suggestion dropdown on outside click.
//   useEffect(() => {
//     function handleOutsideClick(e) {
//       if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
//         setIsDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   const allKeys = Object.keys(serverHistory).filter((k) => serverHistory[k] && serverHistory[k].length).sort();

//   // Unique URL labels, for the dropdown.
//   const suggestionLabels = useMemo(() => {
//     return [...new Set(allKeys.map((k) => k.split("|")[0]))];
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [serverHistory]);

//   // What shows in the dropdown right now - filtered by whatever's typed,
//   // capped so a large URL list doesn't turn into an unusable wall of text.
//   const matchingSuggestions = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const pool = q ? suggestionLabels.filter((l) => l.toLowerCase().includes(q)) : suggestionLabels;
//     return pool.slice(0, MAX_SUGGESTIONS);
//   }, [query, suggestionLabels]);

//   function handleQueryChange(value) {
//     setQuery(value);
//     setIsDropdownOpen(true);
//     // Typing again after a URL was picked means they're starting a new search -
//     // don't keep the old selection's data pinned to the screen.
//     if (selectedLabel) setSelectedLabel(null);
//   }

//   function pickSuggestion(label) {
//     setSelectedLabel(label);
//     setQuery(label);
//     setIsDropdownOpen(false);
//   }

//   function clearSelection() {
//     setSelectedLabel(null);
//     setQuery("");
//     setIsDropdownOpen(false);
//   }

//   // Only groups for the picked URL show, once one's picked. Before that,
//   // it behaves like the old default view (first N cards / show all).
//   const filteredGroups = useMemo(() => {
//     return allKeys
//       .filter((key) => !selectedLabel || key.split("|")[0] === selectedLabel)
//       .map((key) => {
//         const records = selectedDate
//           ? serverHistory[key].filter((r) => dateKey(r.ts) === selectedDate)
//           : serverHistory[key];
//         return { key, records: [...records].reverse() };
//       })
//       .filter((g) => g.records.length > 0);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [serverHistory, selectedDate, selectedLabel]);

//   const isFiltering = !!selectedLabel;
//   const visibleGroups = isFiltering || showAll ? filteredGroups : filteredGroups.slice(0, DEFAULT_VISIBLE);
//   const hiddenCount = filteredGroups.length - visibleGroups.length;

//   return (
//     <section className="panel active">
//       <div className="toolbar">
//         {/* {SHOW_HISTORY_TAB && (
//           <nav className="tabs-inline">
//             <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
//               Dashboard
//             </button>
//             <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
//               History
//             </button>
//           </nav>
//         )} */}
//         <button className="ghost hiddeen-small" onClick={loadHistory} disabled={loading}>
//           Refresh
//         </button>

//         <div ref={searchWrapperRef} style={{ position: "relative", flex: "0 1 260px" }} className="search-box-wrapper">
//           <input
//             type="text"
//             placeholder="Type to search a URL…"
//             value={query}
//             onChange={(e) => handleQueryChange(e.target.value)}
//             onFocus={() => setIsDropdownOpen(true)}
//             style={{ width: "100%", paddingRight: query ? 28 : undefined }}
//           />
//           {query && (
//             <button
//               type="button"
//               onClick={clearSelection}
//               title="Clear filter"
//               style={{
//                 position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
//                 border: "none", background: "transparent", cursor: "pointer",
//                 color: "var(--ink-faint)", fontSize: 14, lineHeight: 1, padding: 4,
//               }}
//             >
//               ✕
//             </button>
//           )}

//           {isDropdownOpen && matchingSuggestions.length > 0 && (
//             <ul
//               className="url-suggestion-list"
//               style={{
//                 position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20,
//                 background: "var(--panel-bg, #fff)", border: "1px solid var(--border, #ddd)",
//                 borderRadius: 8, margin: 0, padding: 4, listStyle: "none",
//                 maxHeight: 240, overflowY: "auto", boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
//               }}
//             >
//               {matchingSuggestions.map((label) => (
//                 <li
//                   key={label}
//                   className="url-suggestion-item"
//                   onClick={() => pickSuggestion(label)}
//                   style={{
//                     padding: "8px 10px", cursor: "pointer", borderRadius: 6,
//                     fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg, #f0f0f2)")}
//                   onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//                 >
//                   {label}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//           <button className="ghost hidden-desktop" onClick={loadHistory} disabled={loading}>
//           Refresh
//         </button>
//         <div className="date-picker-wrap" style={{ marginLeft: "auto" }}>
//           <svg className="cal-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//             <rect x="3" y="5" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
//             <path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//             <circle cx="8" cy="14" r="1.2" fill="currentColor" />
//             <circle cx="12" cy="14" r="1.2" fill="currentColor" />
//             <circle cx="16" cy="14" r="1.2" fill="currentColor" />
//           </svg>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             onClick={(e) => {
//               try {
//                 e.target.showPicker();
//               } catch {
//                 // showPicker() not supported in this browser (e.g. older Safari) -
//                 // the input's own default click-to-open behavior still works.
//               }
//             }}
//           />
//         </div>
//         {selectedDate && (
//           <button className="ghost" onClick={() => setSelectedDate("")}>
//             Clear date
//           </button>
//         )}
//       </div>

//       {/* <div className="field-group" style={{ marginBottom: 18 }}>
//         <h3>Past runs</h3>
//         <p className="hint">
//           {statusText}
//           {selectedDate ? " · Showing only runs from the picked date." : ""}
//         </p>
//       </div> */}

//       {!allKeys.length ? (
//         <div className="empty">{loading ? "Loading…" : "No history data yet."}</div>
//       ) : !filteredGroups.length ? (
//         <div className="empty">
//           {selectedDate ? `No runs recorded on ${selectedDate}.` : `No data for "${selectedLabel || query}".`}
//         </div>
//       ) : (
//         <>
//           {visibleGroups.map(({ key, records }) => {
//             const [label, strategy] = key.split("|");

//             return (
//               <div className="field-group history-card" key={key}>
//                 <div className="history-card-title">
//                   <div className="label">{label}</div>
//                   <span className="strategy-tag">{strategy}</span>
//                 </div>
//                 <table className="history-table">
//                   <thead>
//                     <tr>
//                       <th>When</th>
//                       {CATS.map(([k, l]) => (
//                         <th key={k}>{l}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {records.map((r, i) => (
//                       <tr key={i}>
//                         <td className="when">{new Date(r.ts).toLocaleString()}</td>
//                         {CATS.map(([k]) => {
//                           const s = r.scores[k];
//                           return (
//                             <td key={k} className={`score-${band(s)}`}>
//                               {s === null || s === undefined ? "—" : s}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             );
//           })}

//           {!isFiltering && hiddenCount > 0 && (
//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <button className="ghost" onClick={() => setShowAll(true)}>
//                 Show all ({filteredGroups.length})
//               </button>
//             </div>
//           )}
//           {!isFiltering && showAll && filteredGroups.length > DEFAULT_VISIBLE && (
//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <button className="ghost" onClick={() => setShowAll(false)}>
//                 Show first {DEFAULT_VISIBLE} only
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </section>
//   );
// }

// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { band } from "./ScoreSwatch.jsx";
// import { fetchHistory } from "../lib/backendApi.js";
// import { SHOW_HISTORY_TAB } from "../config.js";

// const CATS = [
//   ["performance", "Perf"],
//   ["accessibility", "A11y"],
//   ["best_practices", "Best Pr."],
//   ["seo", "SEO"],
// ];
// const DEFAULT_VISIBLE = 5; // how many URL cards show by default, before "Show all"
// const MAX_SUGGESTIONS = 8; // cap dropdown length so it stays scannable
// const STRATEGY_ORDER = ["desktop", "mobile"]; // preferred display order within a card

// // "2026-09-18" style key from a record's timestamp, in local time -
// // matches what an <input type="date"> value looks like.
// function dateKey(ts) {
//   const d = new Date(ts);
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// export default function History({ tab, setTab }) {
//   const [serverHistory, setServerHistory] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [statusText, setStatusText] = useState("Loading…");
//   const [selectedDate, setSelectedDate] = useState("");

//   // --- URL search / selection state ---
//   const [query, setQuery] = useState("");
//   const [selectedLabel, setSelectedLabel] = useState(null); // null = no URL picked yet
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [showAll, setShowAll] = useState(false);
//   const searchWrapperRef = useRef(null);

//   const loadHistory = useCallback(async () => {
//     setLoading(true);
//     setStatusText("Fetching history…");
//     try {
//       const data = await fetchHistory();
//       setServerHistory(data);
//       setStatusText(`Last updated: ${new Date().toLocaleString()}`);
//     } catch (err) {
//       setStatusText(`Fetch failed: ${err.message || err}. Check USE_DUMMY_DATA / HISTORY_URL in src/config.js.`);
//     }
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     loadHistory();
//   }, [loadHistory]);

//   // Close the suggestion dropdown on outside click.
//   useEffect(() => {
//     function handleOutsideClick(e) {
//       if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
//         setIsDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   const allKeys = Object.keys(serverHistory).filter((k) => serverHistory[k] && serverHistory[k].length).sort();

//   // Unique URL labels, for the dropdown.
//   const suggestionLabels = useMemo(() => {
//     return [...new Set(allKeys.map((k) => k.split("|")[0]))];
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [serverHistory]);

//   // What shows in the dropdown right now - filtered by whatever's typed,
//   // capped so a large URL list doesn't turn into an unusable wall of text.
//   const matchingSuggestions = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const pool = q ? suggestionLabels.filter((l) => l.toLowerCase().includes(q)) : suggestionLabels;
//     return pool.slice(0, MAX_SUGGESTIONS);
//   }, [query, suggestionLabels]);

//   function handleQueryChange(value) {
//     setQuery(value);
//     setIsDropdownOpen(true);
//     // Typing again after a URL was picked means they're starting a new search -
//     // don't keep the old selection's data pinned to the screen.
//     if (selectedLabel) setSelectedLabel(null);
//   }

//   function pickSuggestion(label) {
//     setSelectedLabel(label);
//     setQuery(label);
//     setIsDropdownOpen(false);
//   }

//   function clearSelection() {
//     setSelectedLabel(null);
//     setQuery("");
//     setIsDropdownOpen(false);
//   }

//   // Group by URL label first, then by strategy underneath it - so a URL
//   // that has both DESKTOP and MOBILE data gets ONE card with both tables,
//   // instead of two separate cards.
//   const filteredGroups = useMemo(() => {
//     const byLabel = {};

//     allKeys
//       .filter((key) => !selectedLabel || key.split("|")[0] === selectedLabel)
//       .forEach((key) => {
//         const [label, strategy] = key.split("|");
//         const records = selectedDate
//           ? serverHistory[key].filter((r) => dateKey(r.ts) === selectedDate)
//           : serverHistory[key];
//         if (!records.length) return;

//         if (!byLabel[label]) byLabel[label] = {};
//         byLabel[label][strategy] = [...records].reverse();
//       });

//     return Object.entries(byLabel).map(([label, strategies]) => {
//       const strategyKeys = Object.keys(strategies).sort(
//         (a, b) => STRATEGY_ORDER.indexOf(a.toLowerCase()) - STRATEGY_ORDER.indexOf(b.toLowerCase())
//       );
//       return { label, strategyKeys, strategies };
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [serverHistory, selectedDate, selectedLabel]);

//   const isFiltering = !!selectedLabel;
//   const visibleGroups = isFiltering || showAll ? filteredGroups : filteredGroups.slice(0, DEFAULT_VISIBLE);
//   const hiddenCount = filteredGroups.length - visibleGroups.length;

//   return (
//     <section className="panel active">
//       <div className="toolbar">
//         {/* {SHOW_HISTORY_TAB && (
//           <nav className="tabs-inline">
//             <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
//               Dashboard
//             </button>
//             <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
//               History
//             </button>
//           </nav>
//         )} */}
//         <button className="ghost hiddeen-small" onClick={loadHistory} disabled={loading}>
//           Refresh
//         </button>

//         <div ref={searchWrapperRef} style={{ position: "relative", flex: "0 1 260px" }} className="search-box-wrapper">
//           <input
//             type="text"
//             placeholder="Type to search a URL…"
//             value={query}
//             onChange={(e) => handleQueryChange(e.target.value)}
//             onFocus={() => setIsDropdownOpen(true)}
//             style={{ width: "100%", paddingRight: query ? 28 : undefined }}
//           />
//           {query && (
//             <button
//               type="button"
//               onClick={clearSelection}
//               title="Clear filter"
//               style={{
//                 position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
//                 border: "none", background: "transparent", cursor: "pointer",
//                 color: "var(--ink-faint)", fontSize: 14, lineHeight: 1, padding: 4,
//               }}
//             >
//               ✕
//             </button>
//           )}

//           {isDropdownOpen && matchingSuggestions.length > 0 && (
//             <ul
//               className="url-suggestion-list"
//               style={{
//                 position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20,
//                 background: "var(--panel-bg, #fff)", border: "1px solid var(--border, #ddd)",
//                 borderRadius: 8, margin: 0, padding: 4, listStyle: "none",
//                 maxHeight: 240, overflowY: "auto", boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
//               }}
//             >
//               {matchingSuggestions.map((label) => (
//                 <li
//                   key={label}
//                   className="url-suggestion-item"
//                   onClick={() => pickSuggestion(label)}
//                   style={{
//                     padding: "8px 10px", cursor: "pointer", borderRadius: 6,
//                     fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg, #f0f0f2)")}
//                   onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//                 >
//                   {label}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//           <button className="ghost hidden-desktop" onClick={loadHistory} disabled={loading}>
//           Refresh
//         </button>
//         <div className="date-picker-wrap" style={{ marginLeft: "auto" }}>
//           <svg className="cal-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//             <rect x="3" y="5" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
//             <path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//             <circle cx="8" cy="14" r="1.2" fill="currentColor" />
//             <circle cx="12" cy="14" r="1.2" fill="currentColor" />
//             <circle cx="16" cy="14" r="1.2" fill="currentColor" />
//           </svg>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             onClick={(e) => {
//               try {
//                 e.target.showPicker();
//               } catch {
//                 // showPicker() not supported in this browser (e.g. older Safari) -
//                 // the input's own default click-to-open behavior still works.
//               }
//             }}
//           />
//         </div>
//         {selectedDate && (
//           <button className="ghost" onClick={() => setSelectedDate("")}>
//             Clear date
//           </button>
//         )}
//       </div>

//       {/* <div className="field-group" style={{ marginBottom: 18 }}>
//         <h3>Past runs</h3>
//         <p className="hint">
//           {statusText}
//           {selectedDate ? " · Showing only runs from the picked date." : ""}
//         </p>
//       </div> */}

//       {!allKeys.length ? (
//         <div className="empty">{loading ? "Loading…" : "No history data yet."}</div>
//       ) : !filteredGroups.length ? (
//         <div className="empty">
//           {selectedDate ? `No runs recorded on ${selectedDate}.` : `No data for "${selectedLabel || query}".`}
//         </div>
//       ) : (
//         <>
//           {visibleGroups.map(({ label, strategyKeys, strategies }) => (
//             <div className="field-group history-card" key={label}>
//               <div className="history-card-title">
//                 <div className="label">{label}</div>
//               </div>

//               {strategyKeys.map((strategy) => (
//                 <div key={strategy} className="history-strategy-block" style={{ marginTop: 10 }}>
//                   <span className="strategy-tag" style={{ display: "inline-block", marginBottom: 6 }}>
//                     {strategy}
//                   </span>
//                   <table className="history-table">
//                     <thead>
//                       <tr>
//                         <th>When</th>
//                         {CATS.map(([k, l]) => (
//                           <th key={k}>{l}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {strategies[strategy].map((r, i) => (
//                         <tr key={i}>
//                           <td className="when">{new Date(r.ts).toLocaleString()}</td>
//                           {CATS.map(([k]) => {
//                             const s = r.scores[k];
//                             return (
//                               <td key={k} className={`score-${band(s)}`}>
//                                 {s === null || s === undefined ? "—" : s}
//                               </td>
//                             );
//                           })}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ))}
//             </div>
//           ))}

//           {!isFiltering && hiddenCount > 0 && (
//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <button className="ghost" onClick={() => setShowAll(true)}>
//                 Show all ({filteredGroups.length})
//               </button>
//             </div>
//           )}
//           {!isFiltering && showAll && filteredGroups.length > DEFAULT_VISIBLE && (
//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <button className="ghost" onClick={() => setShowAll(false)}>
//                 Show first {DEFAULT_VISIBLE} only
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </section>
//   );
// }

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { band } from "./ScoreSwatch.jsx";
import { fetchHistory } from "../lib/backendApi.js";
import { SHOW_HISTORY_TAB } from "../config.js";

const CATS = [
  ["performance", "Perf"],
  ["accessibility", "A11y"],
  ["best_practices", "Best Pr."],
  ["seo", "SEO"],
];
const DEFAULT_VISIBLE = 5; // how many URL cards show by default, before "Show all"
const MAX_SUGGESTIONS = 8; // cap dropdown length so it stays scannable
const STRATEGY_ORDER = ["desktop", "mobile"]; // preferred display order within a card

// "2026-09-18" style key from a record's timestamp, in local time -
// matches what an <input type="date"> value looks like.
function dateKey(ts) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function History({ tab, setTab }) {
  const [serverHistory, setServerHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("Loading…");
  const [selectedDate, setSelectedDate] = useState("");

  // --- URL search / selection state ---
  const [query, setQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(null); // null = no URL picked yet
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const searchWrapperRef = useRef(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setStatusText("Fetching history…");
    try {
      const data = await fetchHistory();
      setServerHistory(data);
      setStatusText(`Last updated: ${new Date().toLocaleString()}`);
    } catch (err) {
      setStatusText(`Fetch failed: ${err.message || err}. Check USE_DUMMY_DATA / HISTORY_URL in src/config.js.`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Close the suggestion dropdown on outside click.
  useEffect(() => {
    function handleOutsideClick(e) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const allKeys = Object.keys(serverHistory).filter((k) => serverHistory[k] && serverHistory[k].length).sort();

  // Unique URL labels, for the dropdown.
  const suggestionLabels = useMemo(() => {
    return [...new Set(allKeys.map((k) => k.split("|")[0]))];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverHistory]);

  // Every label matching what's typed (before capping) - used to know
  // how many are being hidden by the cap below.
  const allMatchingLabels = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? suggestionLabels.filter((l) => l.toLowerCase().includes(q)) : suggestionLabels;
  }, [query, suggestionLabels]);

  // What actually renders in the dropdown - capped so a large URL list
  // doesn't turn into an unusable wall of text.
  const matchingSuggestions = useMemo(
    () => allMatchingLabels.slice(0, MAX_SUGGESTIONS),
    [allMatchingLabels]
  );
  const extraMatchCount = allMatchingLabels.length - matchingSuggestions.length;

  function handleQueryChange(value) {
    setQuery(value);
    setIsDropdownOpen(true);
    // Typing again after a URL was picked means they're starting a new search -
    // don't keep the old selection's data pinned to the screen.
    if (selectedLabel) setSelectedLabel(null);
  }

  function pickSuggestion(label) {
    setSelectedLabel(label);
    setQuery(label);
    setIsDropdownOpen(false);
  }

  function clearSelection() {
    setSelectedLabel(null);
    setQuery("");
    setIsDropdownOpen(false);
  }

  // Group by URL label first, then by strategy underneath it - so a URL
  // that has both DESKTOP and MOBILE data gets ONE card with both tables
  // (rendered side-by-side), instead of two separate cards.
  const filteredGroups = useMemo(() => {
    const byLabel = {};

    allKeys
      .filter((key) => !selectedLabel || key.split("|")[0] === selectedLabel)
      .forEach((key) => {
        const [label, strategy] = key.split("|");
        const records = selectedDate
          ? serverHistory[key].filter((r) => dateKey(r.ts) === selectedDate)
          : serverHistory[key];
        if (!records.length) return;

        if (!byLabel[label]) byLabel[label] = {};
        byLabel[label][strategy] = [...records].reverse();
      });

    return Object.entries(byLabel).map(([label, strategies]) => {
      const strategyKeys = Object.keys(strategies).sort(
        (a, b) => STRATEGY_ORDER.indexOf(a.toLowerCase()) - STRATEGY_ORDER.indexOf(b.toLowerCase())
      );
      return { label, strategyKeys, strategies };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverHistory, selectedDate, selectedLabel]);

  const isFiltering = !!selectedLabel;
  const visibleGroups = isFiltering || showAll ? filteredGroups : filteredGroups.slice(0, DEFAULT_VISIBLE);
  const hiddenCount = filteredGroups.length - visibleGroups.length;

  return (
    <section className="panel active">
      <div className="toolbar">
        {/* {SHOW_HISTORY_TAB && (
          <nav className="tabs-inline">
            <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
              Dashboard
            </button>
            <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
              History
            </button>
          </nav>
        )} */}
        <button className="ghost hiddeen-small" onClick={loadHistory} disabled={loading}>
          Refresh
        </button>

        <div ref={searchWrapperRef} style={{ position: "relative", flex: "0 1 260px" }} className="search-box-wrapper">
          <input
            type="text"
            placeholder="Type to search a URL…"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            style={{ width: "100%", paddingRight: query ? 28 : undefined }}
          />
          {query && (
            <button
              type="button"
              onClick={clearSelection}
              title="Clear filter"
              style={{
                position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                border: "none", background: "transparent", cursor: "pointer",
                color: "var(--ink-faint)", fontSize: 14, lineHeight: 1, padding: 4,
              }}
            >
              ✕
            </button>
          )}

          {isDropdownOpen && matchingSuggestions.length > 0 && (
            <ul
              className="url-suggestion-list"
              style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20,
                background: "var(--panel-bg, #fff)", border: "1px solid var(--border, #ddd)",
                borderRadius: 8, margin: 0, padding: 4, listStyle: "none",
                maxHeight: 240, overflowY: "auto", boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              }}
            >
              {matchingSuggestions.map((label) => (
                <li
                  key={label}
                  className="url-suggestion-item"
                  onClick={() => pickSuggestion(label)}
                  style={{
                    padding: "8px 10px", cursor: "pointer", borderRadius: 6,
                    fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg, #f0f0f2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {label}
                </li>
              ))}
              {extraMatchCount > 0 && (
                <li
                  style={{
                    padding: "6px 10px", fontSize: 12, color: "var(--ink-faint, #888)",
                    cursor: "default", borderTop: "1px solid var(--border, #eee)", marginTop: 2,
                  }}
                >
                  +{extraMatchCount} more — keep typing to narrow
                </li>
              )}
            </ul>
          )}
        </div>

          <button className="ghost hidden-desktop" onClick={loadHistory} disabled={loading}>
          Refresh
        </button>
        <div className="date-picker-wrap" style={{ marginLeft: "auto" }}>
          <svg className="cal-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="8" cy="14" r="1.2" fill="currentColor" />
            <circle cx="12" cy="14" r="1.2" fill="currentColor" />
            <circle cx="16" cy="14" r="1.2" fill="currentColor" />
          </svg>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            onClick={(e) => {
              try {
                e.target.showPicker();
              } catch {
                // showPicker() not supported in this browser (e.g. older Safari) -
                // the input's own default click-to-open behavior still works.
              }
            }}
          />
        </div>
        {selectedDate && (
          <button className="ghost" onClick={() => setSelectedDate("")}>
            Clear date
          </button>
        )}
      </div>

      {/* <div className="field-group" style={{ marginBottom: 18 }}>
        <h3>Past runs</h3>
        <p className="hint">
          {statusText}
          {selectedDate ? " · Showing only runs from the picked date." : ""}
        </p>
      </div> */}

      {!allKeys.length ? (
        <div className="empty">{loading ? "Loading…" : "No history data yet."}</div>
      ) : !filteredGroups.length ? (
        <div className="empty">
          {selectedDate ? `No runs recorded on ${selectedDate}.` : `No data for "${selectedLabel || query}".`}
        </div>
      ) : (
        <>
          {visibleGroups.map(({ label, strategyKeys, strategies }) => (
            <div className="field-group history-card" key={label}>
              <div className="history-card-title">
                <div className="label">{label}</div>
              </div>

              <div
                className="history-strategy-row"
                style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 10 }}
              >
                {strategyKeys.map((strategy) => (
                  <div
                    key={strategy}
                    className="history-strategy-block"
                    style={{ flex: "1 1 320px", minWidth: 280 }}
                  >
                    <span className="strategy-tag" style={{ display: "inline-block", marginBottom: 6 }}>
                      {strategy}
                    </span>
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>When</th>
                          {CATS.map(([k, l]) => (
                            <th key={k}>{l}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {strategies[strategy].map((r, i) => (
                          <tr key={i}>
                            <td className="when">{new Date(r.ts).toLocaleString()}</td>
                            {CATS.map(([k]) => {
                              const s = r.scores[k];
                              return (
                                <td key={k} className={`score-${band(s)}`}>
                                  {s === null || s === undefined ? "—" : s}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!isFiltering && hiddenCount > 0 && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button className="ghost" onClick={() => setShowAll(true)}>
                Show all ({filteredGroups.length})
              </button>
            </div>
          )}
          {!isFiltering && showAll && filteredGroups.length > DEFAULT_VISIBLE && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button className="ghost" onClick={() => setShowAll(false)}>
                Show first {DEFAULT_VISIBLE} only
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}