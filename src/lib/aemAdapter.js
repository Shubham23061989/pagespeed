/**
 * Converts the AEM Sling servlet's JSON shape into the shape the rest
 * of this dashboard already expects (same shape mockFetch/livePsiFetch
 * produce). Keeping this conversion in one place means every other
 * component (Dashboard, History, EmailPreview) needs zero changes.
 *
 * AEM's shape (as shared by the AEM dev):
 * {
 *   "runId": "...", "strategy": "DESKTOP", "startedAt": "...", "completedAt": "...",
 *   "durationMs": 123456,
 *   "summary": { "totalUrls": 1, "successfulUrls": 1, "failedUrls": 0, "status": "SUCCESS" },
 *   "results": [
 *     {
 *       "url": "https://www.asianpaints.com/", "strategy": "DESKTOP",
 *       "performanceScore": 65.0, "accessibilityScore": 90.0,
 *       "bestPracticesScore": 96.0, "seoScore": 92.0,
 *       "largestContentfulPaintMs": 2800.0, "cumulativeLayoutShift": 0.04,
 *       "status": "SUCCESS", "errorMessage": ""
 *     }
 *   ]
 * }
 */

// AEM's payload has no friendly "label" - derive a readable one from the
// URL's last path segment (falls back to the hostname for a bare domain).
export function deriveLabel(url) {
  if (!url) return "Unknown page";
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    if (!path) return u.hostname;
    const parts = path.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || u.hostname;
    return last
      .replace(/\.\w+$/, "") // drop a trailing .html etc
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return url;
  }
}

function roundOrNull(v) {
  return v === null || v === undefined ? null : Math.round(v);
}

// AEM gives LCP in raw milliseconds and CLS as a raw decimal - format
// them the way PSI's own displayValue strings look, so MetricsRow.jsx
// (built for those strings) needs no special-casing.
function formatLcp(ms) {
  if (ms === null || ms === undefined) return null;
  return (ms / 1000).toFixed(1) + " s";
}
function formatCls(v) {
  if (v === null || v === undefined) return null;
  return v.toFixed(2);
}

export function adaptAemReport(aem) {
  const results = aem.results || [];
  const rows = [];
  const errors = [];

  results.forEach((r) => {
    const strategy = (r.strategy || aem.strategy || "").toLowerCase();
    const label = deriveLabel(r.url);

    if (r.status && r.status !== "SUCCESS") {
      errors.push({
        label,
        url: r.url,
        strategy,
        error: r.errorMessage || "Unknown error from AEM",
      });
      return;
    }

    rows.push({
      label,
      url: r.url,
      strategy,
      scores: {
        performance: roundOrNull(r.performanceScore),
        accessibility: roundOrNull(r.accessibilityScore),
        best_practices: roundOrNull(r.bestPracticesScore),
        seo: roundOrNull(r.seoScore),
      },
      // AEM only sends LCP + CLS today - fcp/tbt/si show as "—" in the
      // UI (MetricsRow already handles missing values gracefully).
      metrics: {
        fcp: null,
        lcp: formatLcp(r.largestContentfulPaintMs),
        tbt: null,
        cls: formatCls(r.cumulativeLayoutShift),
        si: null,
      },
    });
  });

  const summary = aem.summary || {};
  return {
    generatedAt: aem.completedAt || aem.startedAt || new Date().toISOString(),
    rows,
    errors,
    totalChecked: summary.successfulUrls ?? rows.length,
    totalBreaches: 0, // recomputed downstream from state.thresholds, not from this payload
    totalErrors: summary.failedUrls ?? errors.length,
  };
}

// True if a payload looks like AEM's shape (has "results") rather than
// this project's own Python backend shape (has "rows").
export function looksLikeAemShape(payload) {
  return payload && Array.isArray(payload.results) && !Array.isArray(payload.rows);
}
