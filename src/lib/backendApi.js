import { adaptAemReport, looksLikeAemShape } from "./aemAdapter.js";
import { adaptAemHistory } from "./aemHistoryAdapter.js";
import { DUMMY_AEM_REPORT } from "../data/dummyAemReport.js";
import { DUMMY_AEM_HISTORY } from "../data/dummyAemHistory.js";
import { USE_DUMMY_DATA, REPORT_URL, HISTORY_URL } from "../config.js";

/**
 * Fetches from any given URL and normalizes the response to this
 * dashboard's internal shape, auto-detecting AEM's shape vs this
 * project's own Python backend shape.
 */
export async function fetchBackendReport(url) {
  // Cache-bust: appends a timestamp so the browser (and any proxy in
  // between) always makes a real network request instead of serving a
  // stale cached response when Refresh is pressed repeatedly.
  const bustUrl = url + (url.includes("?") ? "&" : "?") + "_ts=" + Date.now();
  const resp = await fetch(bustUrl, { cache: "no-store" });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text.slice(0, 160)}`);
  }
  const payload = await resp.json();

  if (looksLikeAemShape(payload)) {
    return adaptAemReport(payload);
  }

  return {
    generatedAt: payload.generatedAt,
    rows: payload.rows || [],
    errors: payload.errors || [],
    totalChecked: payload.totalChecked ?? (payload.rows || []).length,
    totalBreaches: payload.totalBreaches ?? 0,
    totalErrors: payload.totalErrors ?? (payload.errors || []).length,
  };
}

/**
 * The single switch point the dashboard actually calls. Controlled
 * entirely by USE_DUMMY_DATA in src/config.js:
 *   true  -> adapts the embedded DUMMY_AEM_REPORT (no network call)
 *   false -> fetches live from REPORT_URL
 * Flip that one flag when the real AEM endpoint is ready - nothing
 * else in the app needs to change.
 */
export async function fetchReport() {
  if (USE_DUMMY_DATA) {
    return adaptAemReport(DUMMY_AEM_REPORT);
  }
  return fetchBackendReport(REPORT_URL);
}

/**
 * Same switch point, for the History page. Controlled by the same
 * USE_DUMMY_DATA flag:
 *   true  -> adapts the embedded DUMMY_AEM_HISTORY (no network call)
 *   false -> fetches live from HISTORY_URL
 * Returns this dashboard's internal history shape:
 * { "label|strategy": [{ts, scores}, ...] }
 */
export async function fetchHistory() {
  if (USE_DUMMY_DATA) {
    return adaptAemHistory(DUMMY_AEM_HISTORY);
  }
  const bustUrl = HISTORY_URL + (HISTORY_URL.includes("?") ? "&" : "?") + "_ts=" + Date.now();
  const resp = await fetch(bustUrl, { cache: "no-store" });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text.slice(0, 160)}`);
  }
  const payload = await resp.json();
  return adaptAemHistory(payload);
}