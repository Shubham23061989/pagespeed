
// // import { useState, useEffect, useCallback, useMemo } from "react";
// // import ScoreSwatch, { band } from "./ScoreSwatch.jsx";
// // import Sparkline from "./Sparkline.jsx";
// // import MetricsRow from "./MetricsRow.jsx";
// // import { fetchReport } from "../lib/backendApi.js";
// // import { THRESHOLDS } from "../config.js";

// // const CATS = [
// //   ["performance", "performance"],
// //   ["accessibility", "WCAG"],
// //   ["best_practices", "Best Practice"],
// //   ["seo", "SEO"],
// // ];
// // const MAX_HISTORY = 20;
// // const DEFAULT_VISIBLE = 5; // how many URL cards show by default, before "Show all"
// // const STRATEGY_ORDER = { mobile: 0, desktop: 1 };

// // function computeBreaches(row) {
// //   return Object.keys(THRESHOLDS).filter((k) => {
// //     const s = row.scores[k];
// //     return s !== null && s !== undefined && s < THRESHOLDS[k];
// //   });
// // }

// // function meanScore(scores) {
// //   const vals = Object.values(scores).filter((v) => v !== null && v !== undefined);
// //   return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
// // }

// // function worstBandFor(row) {
// //   let worst = "fresh";
// //   Object.values(row.scores).forEach((s) => {
// //     const b = band(s);
// //     if (b === "terracotta") worst = "terracotta";
// //     else if (b === "honey" && worst !== "terracotta") worst = "honey";
// //   });
// //   return worst;
// // }

// // // Combines the per-entry worst bands (mobile + desktop) into one overall
// // // status for the merged card - worst of the two wins.
// // function combineBand(a, b) {
// //   const rank = { fresh: 0, honey: 1, terracotta: 2 };
// //   return rank[b] > rank[a] ? b : a;
// // }

// // export default function Dashboard({ history, setHistory }) {
// //   const [results, setResults] = useState({ rows: [], errors: [] });
// //   const [running, setRunning] = useState(false);
// //   const [statusText, setStatusText] = useState("Loading…");
// //   const [query, setQuery] = useState("");
// //   const [showAll, setShowAll] = useState(false);

// //   function pushHistory(row, nextHistory) {
// //     const key = `${row.label}|${row.strategy}`;
// //     const list = nextHistory[key] ? [...nextHistory[key]] : [];
// //     list.push({ ts: new Date().toISOString(), scores: row.scores });
// //     nextHistory[key] = list.length > MAX_HISTORY ? list.slice(-MAX_HISTORY) : list;
// //   }

// //   const runCheck = useCallback(async () => {
// //     setRunning(true);
// //     setStatusText("Fetching latest report…");
// //     try {
// //       const data = await fetchReport();
// //       const rows = data.rows || [];
// //       const errors = data.errors || [];
// //       const nextHistory = { ...history };
// //       rows.forEach((row) => pushHistory(row, nextHistory));
// //       setResults({ rows, errors });
// //       setHistory(nextHistory);
// //       setStatusText(
// //         `Last updated: ${new Date().toLocaleString()}${
// //           data.generatedAt ? ` (data generated ${new Date(data.generatedAt).toLocaleString()})` : ""
// //         }`
// //       );
// //     } catch (err) {
// //       setStatusText(`Fetch failed: ${err.message || err}. Check USE_DUMMY_DATA / REPORT_URL in src/config.js.`);
// //     }
// //     setRunning(false);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [history]);

// //   // Fetch once on load.
// //   useEffect(() => {
// //     runCheck();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const breachCount = results.rows.filter((r) => computeBreaches(r).length).length;

// //   // Filter by label/URL text (typed or picked from the datalist below).
// //   const filteredRows = useMemo(() => {
// //     const q = query.trim().toLowerCase();
// //     if (!q) return results.rows;
// //     return results.rows.filter(
// //       (r) => r.label.toLowerCase().includes(q) || r.url.toLowerCase().includes(q)
// //     );
// //   }, [results.rows, query]);

// //   // Group mobile + desktop entries for the same URL into ONE card.
// //   const groups = useMemo(() => {
// //     const map = new Map();
// //     filteredRows.forEach((row) => {
// //            const key = `${row.label.toLowerCase()}|${row.url.toLowerCase()}`;
// //       if (!map.has(key)) map.set(key, { key, label: row.label, url: row.url, entries: [] });
// //       map.get(key).entries.push(row);
// //     });
// //     map.forEach((g) => {
// //       g.entries.sort((a, b) => (STRATEGY_ORDER[a.strategy] ?? 2) - (STRATEGY_ORDER[b.strategy] ?? 2));
// //     });
// //     return [...map.values()];
// //   }, [filteredRows]);

// //   const isFiltering = query.trim().length > 0;
// //   const visibleGroups = isFiltering || showAll ? groups : groups.slice(0, DEFAULT_VISIBLE);
// //   const hiddenCount = groups.length - visibleGroups.length;

// //   // Unique labels for the filter box's autocomplete dropdown.
// //   const suggestionLabels = useMemo(() => {
// //     return [...new Set(results.rows.map((r) => r.label))];
// //   }, [results.rows]);

// //   return (
// //     <section className="panel active">
// //       <div>

      
// //             <div className="toolbar">
// //         <button className="primary" onClick={runCheck} disabled={running}>
// //           Refresh
// //         </button>

// //         <span className="url-count-badge">
// //           <span className="badge-dot" aria-hidden="true" />
// //           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// //             <path
// //               d="M10 13a5 5 0 007.07 0l1.93-1.93a5 5 0 00-7.07-7.07L10.5 5.5M14 11a5 5 0 00-7.07 0L5 12.93a5 5 0 007.07 7.07L13.5 18.5"
// //               stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
// //             />
// //           </svg>
// //           {results.rows.length ? `${groups.length} URL${groups.length === 1 ? "" : "s"} checked` : "—"}
// //         </span>

// //         <div className="search-wrap">
// //           <input
// //             type="text"
// //             list="url-suggestions"
// //             placeholder="Search / select a URL…"
// //             value={query}
// //             onChange={(e) => setQuery(e.target.value)}
// //             onFocus={(e) => e.target.select()}
// //             style={{ width: "100%", paddingRight: query ? 28 : undefined }}
// //           />
// //           {query && (
// //             <button
// //               type="button"
// //               onClick={() => setQuery("")}
// //               title="Clear filter"
// //               style={{
// //                 position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
// //                 border: "none", background: "transparent", cursor: "pointer",
// //                 color: "var(--ink-faint)", fontSize: 14, lineHeight: 1, padding: 4,
// //               }}
// //             >
// //               ✕
// //             </button>
// //           )}
// //         </div>
// //         <datalist id="url-suggestions">
// //           {suggestionLabels.map((label) => (
// //             <option key={label} value={label} />
// //           ))}
// //         </datalist>
// //       </div>
// // </div>
// //       {!results.rows.length && !results.errors.length ? (
// //         <div className="empty">No data yet.</div>
// //       ) : !groups.length ? (
// //         <div className="empty">No URLs match "{query}".</div>
// //       ) : (
// //         <div className="grid">
// //           {visibleGroups.map((group) => {
// //             let overallBand = "fresh";
// //             group.entries.forEach((row) => {
// //               overallBand = combineBand(overallBand, worstBandFor(row));
// //             });

// //             return (
// //               <div className={`card status-${overallBand}`} key={group.key}>
// //                 <div className="head">
// //                   <div>
// //                     <div className="label">{group.label}</div>
// //                     <div className="url">{group.url}</div>
// //                   </div>
// //                 </div>

// //                 {group.entries.map((row, i) => {
// //                   const breaches = computeBreaches(row);
// //                   const histKey = `${row.label}|${row.strategy}`;
// //                   const histRecords = history[histKey] || [];
// //                   const histMeans = histRecords.map((r) => meanScore(r.scores));

// //                   return (
// //                     <div
// //                       key={row.strategy}
// //                       style={i > 0 ? { borderTop: "1px solid var(--line-soft)", paddingTop: 10, marginTop: 2 } : undefined}
// //                     >
// //                       <span className="strategy-tag">{row.strategy}</span>
// //                       <div className="swatches">
// //                         {CATS.map(([k, lbl]) => (
// //                           <ScoreSwatch key={k} label={lbl} score={row.scores[k]} />
// //                         ))}
// //                       </div>
// //                       <MetricsRow metrics={row.metrics} />
// //                       {breaches.length > 0 && (
// //                         <div className="breach-note">Below threshold: {breaches.join(", ")}</div>
// //                       )}
// //                       {/* {histMeans.length >= 2 && (
// //                         <div className="sparkline">
// //                           <Sparkline points={histMeans} />
// //                           <span>last {histMeans.length} runs</span>
// //                         </div>
// //                       )} */}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             );
// //           })}

// //           {results.errors.map((err, i) => (
// //             <div className="card" key={`err-${i}`}>
// //               <div className="head">
// //                 <div>
// //                   <div className="label">{err.label}</div>
// //                   <div className="url">{err.url}</div>
// //                 </div>
// //               </div>
// //               <div className="breach-note">
// //                 Fetch error ({err.strategy}): {err.error}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {!isFiltering && hiddenCount > 0 && (
// //         <div style={{ textAlign: "center", marginTop: 16 }}>
// //           <button className="ghost" onClick={() => setShowAll(true)}>
// //             Show all ({groups.length})
// //           </button>
// //         </div>
// //       )}
// //       {!isFiltering && showAll && groups.length > DEFAULT_VISIBLE && (
// //         <div style={{ textAlign: "center", marginTop: 16 }}>
// //           <button className="ghost" onClick={() => setShowAll(false)}>
// //             Show first {DEFAULT_VISIBLE} only
// //           </button>
// //         </div>
// //       )}
// //     </section>
// //   );
// // }

// // import { useState, useEffect, useCallback, useMemo } from "react";
// // import ScoreSwatch, { band } from "./ScoreSwatch.jsx";
// // import Sparkline from "./Sparkline.jsx";
// // import MetricsRow from "./MetricsRow.jsx";
// // import { fetchReport } from "../lib/backendApi.js";
// // import { THRESHOLDS } from "../config.js";

// // const CATS = [
// //   ["performance", "Perf"],
// //   ["accessibility", "A11y"],
// //   ["best_practices", "Best Pr."],
// //   ["seo", "SEO"],
// // ];
// // const MAX_HISTORY = 20;
// // const DEFAULT_VISIBLE = 10; // how many cards show by default, before filtering or "Show all"

// // function computeBreaches(row) {
// //   return Object.keys(THRESHOLDS).filter((k) => {
// //     const s = row.scores[k];
// //     return s !== null && s !== undefined && s < THRESHOLDS[k];
// //   });
// // }

// // function meanScore(scores) {
// //   const vals = Object.values(scores).filter((v) => v !== null && v !== undefined);
// //   return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
// // }

// // export default function Dashboard({ history, setHistory }) {
// //   const [results, setResults] = useState({ rows: [], errors: [] });
// //   const [running, setRunning] = useState(false);
// //   const [statusText, setStatusText] = useState("Loading…");
// //   const [query, setQuery] = useState("");
// //   const [showAll, setShowAll] = useState(false);

// //   function pushHistory(row, nextHistory) {
// //     const key = `${row.label}|${row.strategy}`;
// //     const list = nextHistory[key] ? [...nextHistory[key]] : [];
// //     list.push({ ts: new Date().toISOString(), scores: row.scores });
// //     nextHistory[key] = list.length > MAX_HISTORY ? list.slice(-MAX_HISTORY) : list;
// //   }

// //   const runCheck = useCallback(async () => {
// //     setRunning(true);
// //     setStatusText("Fetching latest report…");
// //     try {
// //       const data = await fetchReport();
// //       const rows = data.rows || [];
// //       const errors = data.errors || [];
// //       const nextHistory = { ...history };
// //       rows.forEach((row) => pushHistory(row, nextHistory));
// //       setResults({ rows, errors });
// //       setHistory(nextHistory);
// //       setStatusText(
// //         `Last updated: ${new Date().toLocaleString()}${
// //           data.generatedAt ? ` (data generated ${new Date(data.generatedAt).toLocaleString()})` : ""
// //         }`
// //       );
// //     } catch (err) {
// //       setStatusText(`Fetch failed: ${err.message || err}. Check USE_DUMMY_DATA / REPORT_URL in src/config.js.`);
// //     }
// //     setRunning(false);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [history]);

// //   // Fetch once on load.
// //   useEffect(() => {
// //     runCheck();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const breachCount = results.rows.filter((r) => computeBreaches(r).length).length;

// //   // Filter by label/URL text; when no filter is active, cap the initial
// //   // view to DEFAULT_VISIBLE cards so 100 configured URLs don't turn into
// //   // 100 tiles on load. Typing a filter (or pressing "Show all") lifts the cap.
// //   const filteredRows = useMemo(() => {
// //     const q = query.trim().toLowerCase();
// //     if (!q) return results.rows;
// //     return results.rows.filter(
// //       (r) => r.label.toLowerCase().includes(q) || r.url.toLowerCase().includes(q)
// //     );
// //   }, [results.rows, query]);

// //   const isFiltering = query.trim().length > 0;
// //   const visibleRows = isFiltering || showAll ? filteredRows : filteredRows.slice(0, DEFAULT_VISIBLE);
// //   const hiddenCount = filteredRows.length - visibleRows.length;

// //   return (
// //     <section className="panel active">
// //       <div className="toolbar">
// //         <button className="primary" onClick={runCheck} disabled={running}>
// //           Refresh
// //         </button>
// //         <input
// //           type="text"
// //           placeholder="Filter by URL or label…"
// //           value={query}
// //           onChange={(e) => setQuery(e.target.value)}
// //           style={{ minWidth: 220 }}
// //         />
// //         <span className="status">{statusText}</span>
// //       </div>

// //       <div className="stat-ribbon">
// //         <div className="stat-item accent">
// //           <div className="n">{results.rows.length || "—"}</div>
// //           <div className="l">URLs checked</div>
// //         </div>
// //         <div className={`stat-item ${breachCount > 0 ? "warn" : results.rows.length ? "ok" : ""}`}>
// //           <div className="n">{results.rows.length ? breachCount : "—"}</div>
// //           <div className="l">Threshold breaches</div>
// //         </div>
// //         <div className={`stat-item ${results.errors.length > 0 ? "warn" : ""}`}>
// //           <div className="n">{results.rows.length || results.errors.length ? results.errors.length : "—"}</div>
// //           <div className="l">Fetch errors</div>
// //         </div>
// //       </div>

// //       {!results.rows.length && !results.errors.length ? (
// //         <div className="empty">No data yet.</div>
// //       ) : !filteredRows.length ? (
// //         <div className="empty">No URLs match "{query}".</div>
// //       ) : (
// //         <div className="grid">
// //           {visibleRows.map((row) => {
// //             const breaches = computeBreaches(row);
// //             const key = `${row.label}|${row.strategy}`;
// //             const histRecords = history[key] || [];
// //             const histMeans = histRecords.map((r) => meanScore(r.scores));
// //             let worstBand = "fresh";
// //             Object.values(row.scores).forEach((s) => {
// //               const b = band(s);
// //               if (b === "terracotta") worstBand = "terracotta";
// //               else if (b === "honey" && worstBand !== "terracotta") worstBand = "honey";
// //             });
// //             return (
// //               <div className={`card status-${worstBand}`} key={key}>
// //                 <div className="head">
// //                   <div>
// //                     <div className="label">{row.label}</div>
// //                     <div className="url">{row.url}</div>
// //                   </div>
// //                   <span className="strategy-tag">{row.strategy}</span>
// //                 </div>
// //                 <div className="swatches">
// //                   {CATS.map(([k, lbl]) => (
// //                     <ScoreSwatch key={k} label={lbl} score={row.scores[k]} />
// //                   ))}
// //                 </div>
// //                 <MetricsRow metrics={row.metrics} />
// //                 {breaches.length > 0 && (
// //                   <div className="breach-note">Below threshold: {breaches.join(", ")}</div>
// //                 )}
// //                 {/* {histMeans.length >= 2 && (
// //                   <div className="sparkline">
// //                     <Sparkline points={histMeans} />
// //                     <span>last {histMeans.length} runs</span>
// //                   </div>
// //                 )} */}
// //               </div>
// //             );
// //           })}

// //           {results.errors.map((err, i) => (
// //             <div className="card" key={`err-${i}`}>
// //               <div className="head">
// //                 <div>
// //                   <div className="label">{err.label}</div>
// //                   <div className="url">{err.url}</div>
// //                 </div>
// //               </div>
// //               <div className="breach-note">
// //                 Fetch error ({err.strategy}): {err.error}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {!isFiltering && hiddenCount > 0 && (
// //         <div style={{ textAlign: "center", marginTop: 16 }}>
// //           <button className="ghost" onClick={() => setShowAll(true)}>
// //             Show all ({filteredRows.length})
// //           </button>
// //         </div>
// //       )}
// //       {!isFiltering && showAll && filteredRows.length > DEFAULT_VISIBLE && (
// //         <div style={{ textAlign: "center", marginTop: 16 }}>
// //           <button className="ghost" onClick={() => setShowAll(false)}>
// //             Show first {DEFAULT_VISIBLE} only
// //           </button>
// //         </div>
// //       )}
// //     </section>
// //   );
// // }
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import ScoreSwatch, { band } from "./ScoreSwatch.jsx";
// import Sparkline from "./Sparkline.jsx";
// import MetricsRow from "./MetricsRow.jsx";
// import { fetchReport } from "../lib/backendApi.js";
// import { THRESHOLDS } from "../config.js";

// const CATS = [
//   ["performance", "performance"],
//   ["accessibility", "WCAG"],
//   ["best_practices", "Best Practice"],
//   ["seo", "SEO"],
// ];
// const MAX_HISTORY = 20;
// const DEFAULT_VISIBLE = 4; // how many URL cards show by default, before "Show all"
// const STRATEGY_ORDER = { mobile: 0, desktop: 1 };
// const MAX_SUGGESTIONS = 8; // cap dropdown length so it stays scannable

// function computeBreaches(row) {
//   return Object.keys(THRESHOLDS).filter((k) => {
//     const s = row.scores[k];
//     return s !== null && s !== undefined && s < THRESHOLDS[k];
//   });
// }

// function meanScore(scores) {
//   const vals = Object.values(scores).filter((v) => v !== null && v !== undefined);
//   return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
// }

// function worstBandFor(row) {
//   let worst = "fresh";
//   Object.values(row.scores).forEach((s) => {
//     const b = band(s);
//     if (b === "terracotta") worst = "terracotta";
//     else if (b === "honey" && worst !== "terracotta") worst = "honey";
//   });
//   return worst;
// }

// // Combines the per-entry worst bands (mobile + desktop) into one overall
// // status for the merged card - worst of the two wins.
// function combineBand(a, b) {
//   const rank = { fresh: 0, honey: 1, terracotta: 2 };
//   return rank[b] > rank[a] ? b : a;
// }

// export default function Dashboard({ history, setHistory }) {
//   const [results, setResults] = useState({ rows: [], errors: [] });
//   const [running, setRunning] = useState(false);
//   const [statusText, setStatusText] = useState("Loading…");
//   const [query, setQuery] = useState("");
//   const [showAll, setShowAll] = useState(false);

//   // --- URL search dropdown state (same pattern as History.jsx) ---
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const searchWrapperRef = useRef(null);

//   function pushHistory(row, nextHistory) {
//     const key = `${row.label}|${row.strategy}`;
//     const list = nextHistory[key] ? [...nextHistory[key]] : [];
//     list.push({ ts: new Date().toISOString(), scores: row.scores });
//     nextHistory[key] = list.length > MAX_HISTORY ? list.slice(-MAX_HISTORY) : list;
//   }

//   const runCheck = useCallback(async () => {
//     setRunning(true);
//     setStatusText("Fetching latest report…");
//     try {
//       const data = await fetchReport();
//       const rows = data.rows || [];
//       const errors = data.errors || [];
//       const nextHistory = { ...history };
//       rows.forEach((row) => pushHistory(row, nextHistory));
//       setResults({ rows, errors });
//       setHistory(nextHistory);
//       setStatusText(
//         `Last updated: ${new Date().toLocaleString()}${
//           data.generatedAt ? ` (data generated ${new Date(data.generatedAt).toLocaleString()})` : ""
//         }`
//       );
//     } catch (err) {
//       setStatusText(`Fetch failed: ${err.message || err}. Check USE_DUMMY_DATA / REPORT_URL in src/config.js.`);
//     }
//     setRunning(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [history]);

//   // Fetch once on load.
//   useEffect(() => {
//     runCheck();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

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

//   const breachCount = results.rows.filter((r) => computeBreaches(r).length).length;

//   // Filter by label/URL text (typed, or picked from the dropdown below).
//   const filteredRows = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return results.rows;
//     return results.rows.filter(
//       (r) => r.label.toLowerCase().includes(q) || r.url.toLowerCase().includes(q)
//     );
//   }, [results.rows, query]);

//   // Group mobile + desktop entries for the same URL into ONE card.
//   const groups = useMemo(() => {
//     const map = new Map();
//     filteredRows.forEach((row) => {
//       const key = `${row.label.toLowerCase()}|${row.url.toLowerCase()}`;
//       if (!map.has(key)) map.set(key, { key, label: row.label, url: row.url, entries: [] });
//       map.get(key).entries.push(row);
//     });
//     map.forEach((g) => {
//       g.entries.sort((a, b) => (STRATEGY_ORDER[a.strategy] ?? 2) - (STRATEGY_ORDER[b.strategy] ?? 2));
//     });
//     return [...map.values()];
//   }, [filteredRows]);

//   const isFiltering = query.trim().length > 0;
//   const visibleGroups = isFiltering || showAll ? groups : groups.slice(0, DEFAULT_VISIBLE);
//   const hiddenCount = groups.length - visibleGroups.length;

//   // Unique labels for the dropdown.
//   const suggestionLabels = useMemo(() => {
//     return [...new Set(results.rows.map((r) => r.label))];
//   }, [results.rows]);

//   // Every label matching what's typed (before capping) - used to know
//   // how many are being hidden by the cap below.
//   const allMatchingLabels = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return q ? suggestionLabels.filter((l) => l.toLowerCase().includes(q)) : suggestionLabels;
//   }, [query, suggestionLabels]);

//   // What actually renders in the dropdown - capped so a large URL list
//   // doesn't turn into an unusable wall of text.
//   const matchingSuggestions = useMemo(
//     () => allMatchingLabels.slice(0, MAX_SUGGESTIONS),
//     [allMatchingLabels]
//   );
//   const extraMatchCount = allMatchingLabels.length - matchingSuggestions.length;

//   function handleQueryChange(value) {
//     setQuery(value);
//     setIsDropdownOpen(true);
//   }

//   function pickSuggestion(label) {
//     setQuery(label);
//     setIsDropdownOpen(false);
//   }

//   function clearQuery() {
//     setQuery("");
//     setIsDropdownOpen(false);
//   }

//   return (
//     <section className="panel active">
//       <div>
//         <div className="toolbar">
//           <button className="primary" onClick={runCheck} disabled={running}>
//             Refresh
//           </button>

//           <span className="url-count-badge">
//             <span className="badge-dot" aria-hidden="true" />
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//               <path
//                 d="M10 13a5 5 0 007.07 0l1.93-1.93a5 5 0 00-7.07-7.07L10.5 5.5M14 11a5 5 0 00-7.07 0L5 12.93a5 5 0 007.07 7.07L13.5 18.5"
//                 stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
//               />
//             </svg>
//             {results.rows.length ? `${groups.length} URL${groups.length === 1 ? "" : "s"} checked` : "—"}
//           </span>

//           <div ref={searchWrapperRef} className="search-wrap" style={{ position: "relative" }}>
//             <input
//               type="text"
//               placeholder="Type to search a URL…"
//               value={query}
//               onChange={(e) => handleQueryChange(e.target.value)}
//               onFocus={() => setIsDropdownOpen(true)}
//               style={{ width: "100%", paddingRight: query ? 28 : undefined }}
//             />
//             {query && (
//               <button
//                 type="button"
//                 onClick={clearQuery}
//                 title="Clear filter"
//                 style={{
//                   position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
//                   border: "none", background: "transparent", cursor: "pointer",
//                   color: "var(--ink-faint)", fontSize: 14, lineHeight: 1, padding: 4,
//                 }}
//               >
//                 ✕
//               </button>
//             )}

//             {isDropdownOpen && matchingSuggestions.length > 0 && (
//               <ul
//                 className="url-suggestion-list"
//                 style={{
//                   position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20,
//                   background: "var(--panel-bg, #fff)", border: "1px solid var(--border, #ddd)",
//                   borderRadius: 8, margin: 0, padding: 4, listStyle: "none",
//                   maxHeight: 240, overflowY: "auto", boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
//                 }}
//               >
//                 {matchingSuggestions.map((label) => (
//                   <li
//                     key={label}
//                     className="url-suggestion-item"
//                     onClick={() => pickSuggestion(label)}
//                     style={{
//                       padding: "8px 10px", cursor: "pointer", borderRadius: 6,
//                       fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//                     }}
//                     onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover-bg, #f0f0f2)")}
//                     onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//                   >
//                     {label}
//                   </li>
//                 ))}
//                 {extraMatchCount > 0 && (
//                   <li
//                     style={{
//                       padding: "6px 10px", fontSize: 12, color: "var(--ink-faint, #888)",
//                       cursor: "default", borderTop: "1px solid var(--border, #eee)", marginTop: 2,
//                     }}
//                   >
//                     +{extraMatchCount} more — keep typing to narrow
//                   </li>
//                 )}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>

//       {!results.rows.length && !results.errors.length ? (
//         <div className="empty">No data yet.</div>
//       ) : !groups.length ? (
//         <div className="empty">No URLs match "{query}".</div>
//       ) : (
//         <div className="grid">
//           {visibleGroups.map((group) => {
//             let overallBand = "fresh";
//             group.entries.forEach((row) => {
//               overallBand = combineBand(overallBand, worstBandFor(row));
//             });

//             return (
//               <div className={`card status-${overallBand}`} key={group.key}>
//                 <div className="head">
//                   <div>
//                     <div className="label">{group.label}</div>
//                     <div className="url">{group.url}</div>
//                   </div>
//                 </div>

//                 {group.entries.map((row, i) => {
//                   const breaches = computeBreaches(row);
//                   const histKey = `${row.label}|${row.strategy}`;
//                   const histRecords = history[histKey] || [];
//                   const histMeans = histRecords.map((r) => meanScore(r.scores));

//                   return (
//                     <div
//                       key={row.strategy}
//                       style={i > 0 ? { borderTop: "1px solid var(--line-soft)", paddingTop: 10, marginTop: 2 } : undefined}
//                     >
//                       <span className="strategy-tag">{row.strategy}</span>
//                       <div className="swatches">
//                         {CATS.map(([k, lbl]) => (
//                           <ScoreSwatch key={k} label={lbl} score={row.scores[k]} />
//                         ))}
//                       </div>
//                       <MetricsRow metrics={row.metrics} />
//                       {breaches.length > 0 && (
//                         <div className="breach-note">Below threshold: {breaches.join(", ")}</div>
//                       )}
//                       {/* {histMeans.length >= 2 && (
//                         <div className="sparkline">
//                           <Sparkline points={histMeans} />
//                           <span>last {histMeans.length} runs</span>
//                         </div>
//                       )} */}
//                     </div>
//                   );
//                 })}
//               </div>
//             );
//           })}

//           {results.errors.map((err, i) => (
//             <div className="card" key={`err-${i}`}>
//               <div className="head">
//                 <div>
//                   <div className="label">{err.label}</div>
//                   <div className="url">{err.url}</div>
//                 </div>
//               </div>
//               <div className="breach-note">
//                 Fetch error ({err.strategy}): {err.error}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {!isFiltering && hiddenCount > 0 && (
//         <div style={{ textAlign: "center", marginTop: 16 }}>
//           <button className="ghost" onClick={() => setShowAll(true)}>
//             Show all ({groups.length})
//           </button>
//         </div>
//       )}
//       {!isFiltering && showAll && groups.length > DEFAULT_VISIBLE && (
//         <div style={{ textAlign: "center", marginTop: 16 }}>
//           <button className="ghost" onClick={() => setShowAll(false)}>
//             Show first {DEFAULT_VISIBLE} only
//           </button>
//         </div>
//       )}
//     </section>
//   );
// }

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { band } from "./ScoreSwatch.jsx";
import { fetchReport, fetchHistory } from "../lib/backendApi.js";

const CATS = [
  ["performance", "Perf"],
  ["accessibility", "A11y"],
  ["best_practices", "Best Pr."],
  ["seo", "SEO"],
];
const STRATEGY_ORDER = ["desktop", "mobile"];
const MAX_SUGGESTIONS = 8; // cap dropdown length so it stays scannable
const DEFAULT_VISIBLE = 5; // how many historical cards show by default, before "Show all"

// Light tint colors for the compact score chips, keyed off band() -
// same semantic meaning as the score-fresh/honey/terracotta classes
// used elsewhere, just with a background/border added for the chip look.
const CHIP_COLORS = {
  fresh: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.45)" },
  honey: { bg: "rgba(245,158,11,0.14)", border: "rgba(245,158,11,0.5)" },
  terracotta: { bg: "rgba(239,68,68,0.13)", border: "rgba(239,68,68,0.5)" },
};

// "2026-09-18" style key from a record's timestamp, in local time -
// matches what an <input type="date"> value looks like.
function dateKey(ts) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function ScoreChip({ label, score }) {
  const b = band(score);
  const colors = CHIP_COLORS[b] || CHIP_COLORS.fresh;
  return (
    <span
      className={`score-${b}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 9px", borderRadius: 999, fontSize: 12, fontWeight: 600,
        background: colors.bg, border: `1px solid ${colors.border}`, whiteSpace: "nowrap",
      }}
    >
      <span style={{ opacity: 0.75, fontWeight: 500 }}>{label}</span>
      {score === null || score === undefined ? "—" : score}
    </span>
  );
}

export default function Dashboard() {
  // --- Latest / live report ---
  const [liveRows, setLiveRows] = useState([]);
  const [liveErrors, setLiveErrors] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveStatusText, setLiveStatusText] = useState("Loading…");

  // --- Historical data (fetched once, filtered locally by date) ---
  const [historyMap, setHistoryMap] = useState({});
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyStatusText, setHistoryStatusText] = useState("Loading…");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAll, setShowAll] = useState(false);

  // --- Shared URL search (filters both sections) ---
  const [query, setQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchWrapperRef = useRef(null);

  const loadLive = useCallback(async () => {
    setLiveLoading(true);
    setLiveStatusText("Fetching latest report…");
    try {
      const data = await fetchReport();
      setLiveRows(data.rows || []);
      setLiveErrors(data.errors || []);
      setLiveStatusText(`Last updated: ${new Date().toLocaleString()}`);
    } catch (err) {
      setLiveStatusText(`Fetch failed: ${err.message || err}. Check USE_DUMMY_DATA / REPORT_URL in src/config.js.`);
    }
    setLiveLoading(false);
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryStatusText("Fetching history…");
    try {
      const data = await fetchHistory();
      setHistoryMap(data || {});
      setHistoryStatusText(`Last updated: ${new Date().toLocaleString()}`);
    } catch (err) {
      setHistoryStatusText(`Fetch failed: ${err.message || err}. Check USE_DUMMY_DATA / HISTORY_URL in src/config.js.`);
    }
    setHistoryLoading(false);
  }, []);

  // Load both on mount.
  useEffect(() => {
    loadLive();
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // One Refresh button re-fetches both sections. Disabled while either
  // is already loading, so a click can't fire a second request on top
  // of one still in flight.
  const anyLoading = liveLoading || historyLoading;
  function handleRefresh() {
    loadLive();
    loadHistory();
  }

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

  // ---- Latest report, grouped by URL (DESKTOP/MOBILE side by side) ----
  const liveGroups = useMemo(() => {
    const byLabel = {};
    liveRows.forEach((row) => {
      if (!byLabel[row.label]) byLabel[row.label] = { label: row.label, scores: {} };
      byLabel[row.label].scores[(row.strategy || "").toUpperCase()] = row.scores;
    });
    return Object.values(byLabel).map((g) => ({
      ...g,
      strategyKeys: Object.keys(g.scores).sort(
        (a, b) => STRATEGY_ORDER.indexOf(a.toLowerCase()) - STRATEGY_ORDER.indexOf(b.toLowerCase())
      ),
    }));
  }, [liveRows]);

  // ---- Historical runs, grouped by URL, filtered to the picked date (if any) ----
  const historyGroups = useMemo(() => {
    const byLabel = {};
    Object.keys(historyMap).forEach((key) => {
      const [label, strategy] = key.split("|");
      const records = selectedDate
        ? (historyMap[key] || []).filter((r) => dateKey(r.ts) === selectedDate)
        : historyMap[key] || [];
      if (!records.length) return;
      if (!byLabel[label]) byLabel[label] = { label, strategies: {} };
      byLabel[label].strategies[strategy.toUpperCase()] = [...records].reverse();
    });
    return Object.values(byLabel).map((g) => ({
      ...g,
      strategyKeys: Object.keys(g.strategies).sort(
        (a, b) => STRATEGY_ORDER.indexOf(a.toLowerCase()) - STRATEGY_ORDER.indexOf(b.toLowerCase())
      ),
    }));
  }, [historyMap, selectedDate]);

  // Shared URL search applies to both sections.
  const filteredLiveGroups = useMemo(
    () => liveGroups.filter((g) => !selectedLabel || g.label === selectedLabel),
    [liveGroups, selectedLabel]
  );
  const filteredHistoryGroups = useMemo(
    () => historyGroups.filter((g) => !selectedLabel || g.label === selectedLabel),
    [historyGroups, selectedLabel]
  );

  const isFiltering = !!selectedLabel;
  const visibleHistoryGroups = isFiltering || showAll ? filteredHistoryGroups : filteredHistoryGroups.slice(0, DEFAULT_VISIBLE);
  const hiddenHistoryCount = filteredHistoryGroups.length - visibleHistoryGroups.length;

  // ---- Search dropdown data (labels pulled from both sections) ----
  const suggestionLabels = useMemo(() => {
    const labels = new Set([...liveGroups.map((g) => g.label), ...historyGroups.map((g) => g.label)]);
    return [...labels];
  }, [liveGroups, historyGroups]);

  const allMatchingLabels = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? suggestionLabels.filter((l) => l.toLowerCase().includes(q)) : suggestionLabels;
  }, [query, suggestionLabels]);
  const matchingSuggestions = useMemo(() => allMatchingLabels.slice(0, MAX_SUGGESTIONS), [allMatchingLabels]);
  const extraMatchCount = allMatchingLabels.length - matchingSuggestions.length;

  function handleQueryChange(value) {
    setQuery(value);
    setIsDropdownOpen(true);
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

  return (
    <section className="panel active">
      <div className="toolbar">
        <button className="primary" onClick={handleRefresh} disabled={anyLoading}>
          {anyLoading ? "Refreshing…" : "Refresh"}
        </button>

        <span className="url-count-badge">
          <span className="badge-dot" aria-hidden="true" />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M10 13a5 5 0 007.07 0l1.93-1.93a5 5 0 00-7.07-7.07L10.5 5.5M14 11a5 5 0 00-7.07 0L5 12.93a5 5 0 007.07 7.07L13.5 18.5"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          {liveGroups.length ? `${liveGroups.length} URL${liveGroups.length === 1 ? "" : "s"} checked` : "—"}
        </span>

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
      </div>

      {/* ---------------- Latest Report (compact, one row per URL) ---------------- */}
      <h3 style={{ margin: "18px 0 4px" }}>Latest Report</h3>
      <p className="hint" style={{ marginBottom: 12 }}>{liveStatusText}</p>

      {liveLoading && !liveGroups.length ? (
        <div className="empty">Loading…</div>
      ) : !filteredLiveGroups.length ? (
        <div className="empty">{selectedLabel || query ? `No data for "${selectedLabel || query}".` : "No data yet."}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredLiveGroups.map((group) => (
            <div
              className="field-group history-card"
              key={group.label}
              style={{
                display: "flex", alignItems: "center", flexWrap: "wrap",
                gap: "10px 20px", padding: "10px 16px",
              }}
            >
              <div className="label" style={{ fontWeight: 600, minWidth: 160, flex: "0 0 auto" }}>
                {group.label}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", flex: "1 1 auto" }}>
                {group.strategyKeys.map((strategy) => (
                  <div key={strategy} style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span
                      className="strategy-tag"
                      style={{ fontSize: 10, padding: "2px 6px", display: "inline-block" }}
                    >
                      {strategy}
                    </span>
                    {CATS.map(([k, l]) => (
                      <ScoreChip key={k} label={l} score={group.scores[strategy][k]} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {liveErrors.map((err, i) => (
            <div
              className="field-group history-card"
              key={`err-${i}`}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}
            >
              <div className="label" style={{ fontWeight: 600 }}>{err.label}</div>
              <div className="breach-note" style={{ margin: 0 }}>
                Fetch error ({err.strategy}): {err.error}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- Historical Data ---------------- */}
      <h3 style={{ margin: "28px 0 4px" }}>Historical Data</h3>
      <div className="toolbar" style={{ marginBottom: 4 }}>
        <div className="date-picker-wrap">
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
                // showPicker() not supported in this browser - default click behavior still works.
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
      <p className="hint" style={{ marginBottom: 12 }}>
        {historyStatusText}
        {selectedDate ? ` · Showing runs from ${selectedDate}` : ""}
      </p>

      {historyLoading && !historyGroups.length ? (
        <div className="empty">Loading…</div>
      ) : !filteredHistoryGroups.length ? (
        <div className="empty">
          {selectedDate
            ? `No runs recorded on ${selectedDate}.`
            : selectedLabel || query
            ? `No data for "${selectedLabel || query}".`
            : "No history data yet."}
        </div>
      ) : (
        <>
          {visibleHistoryGroups.map((group) => (
            <div className="field-group history-card" key={group.label}>
              <div className="history-card-title">
                <div className="label">{group.label}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 10 }}>
                {group.strategyKeys.map((strategy) => (
                  <div key={strategy} style={{ flex: "1 1 320px", minWidth: 280 }}>
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
                        {group.strategies[strategy].map((r, i) => (
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

          {!isFiltering && hiddenHistoryCount > 0 && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button className="ghost" onClick={() => setShowAll(true)}>
                Show all ({filteredHistoryGroups.length})
              </button>
            </div>
          )}
          {!isFiltering && showAll && filteredHistoryGroups.length > DEFAULT_VISIBLE && (
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