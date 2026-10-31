// import { deriveLabel } from "./aemAdapter.js";

// /**
//  * Converts AEM's history endpoint response into this dashboard's
//  * internal history shape: { "label|strategy": [{ts, scores}, ...] }
//  * (same shape already used for the browser's local run history, so
//  * the History page needs no further changes to consume this).
//  *
//  * ASSUMED shape (best guess, based on the /latest.json report shape -
//  * adjust this file once the real endpoint's response is confirmed):
//  * [
//  *   {
//  *     "runId": "...", "startedAt": "...", "completedAt": "...",
//  *     "results": [
//  *       { "url": "...", "strategy": "DESKTOP", "performanceScore": 65.0,
//  *         "accessibilityScore": 90.0, "bestPracticesScore": 96.0, "seoScore": 92.0,
//  *         "status": "SUCCESS", "errorMessage": "" },
//  *       ...
//  *     ]
//  *   },
//  *   ... more runs ...
//  * ]
//  */
// export function adaptAemHistory(runsArray) {
//   const history = {};
//   if (!Array.isArray(runsArray)) return history;

//   runsArray.forEach((run) => {
//     const ts = run.completedAt || run.startedAt || new Date().toISOString();
//     (run.results || []).forEach((r) => {
//       if (r.status && r.status !== "SUCCESS") return;
//       const label = deriveLabel(r.url);
//       const strategy = (r.strategy || run.strategy || "").toLowerCase();
//       const key = `${label}|${strategy}`;

//       if (!history[key]) history[key] = [];
//       history[key].push({
//         ts,
//         scores: {
//           performance: r.performanceScore != null ? Math.round(r.performanceScore) : null,
//           accessibility: r.accessibilityScore != null ? Math.round(r.accessibilityScore) : null,
//           best_practices: r.bestPracticesScore != null ? Math.round(r.bestPracticesScore) : null,
//           seo: r.seoScore != null ? Math.round(r.seoScore) : null,
//         },
//       });
//     });
//   });

//   // Oldest-first within each key, capped to the last 20 runs.
//   Object.keys(history).forEach((key) => {
//     history[key].sort((a, b) => new Date(a.ts) - new Date(b.ts));
//     if (history[key].length > 20) history[key] = history[key].slice(-20);
//   });

//   return history;
// }

import { deriveLabel } from "./aemAdapter.js";

/**
 * Converts AEM's history endpoint response into this dashboard's
 * internal history shape: { "label|strategy": [{ts, scores}, ...] }
 * (same shape already used for the browser's local run history, so
 * the History page needs no further changes to consume this).
 *
 * CONFIRMED real shape (from AEM's actual endpoint):
 * {
 *   <someArrayKey>: [   // exact wrapper key not yet confirmed - auto-detected below
 *     {
 *       "reportId": "...", "runId": "...", "strategy": "DESKTOP",
 *       "generatedAt": "2026-09-18T12:02:29.861Z",
 *       "summary": { "totalUrls": 3, "successfulUrls": 3, "failedUrls": 0, "status": "SUCCESS" },
 *       "results": [
 *         { "url": "...", "strategy": "DESKTOP", "performanceScore": 65.0,
 *           "accessibilityScore": 90.0, "bestPracticesScore": 96.0, "seoScore": 92.0,
 *           "status": "SUCCESS", "errorMessage": "" },
 *         ...
 *       ]
 *     },
 *     ... more runs ...
 *   ],
 *   "count": 4, "limit": 10, "availableRuns": 4, "skippedRuns": 0
 * }
 *
 * Still accepts a bare array too, so this keeps working if the
 * wrapper ever gets simplified.
 */
export function adaptAemHistory(payload) {
  const history = {};

  const runsArray = Array.isArray(payload)
    ? payload
    : Object.values(payload || {}).find(Array.isArray) || [];

  if (!runsArray.length) return history;

  runsArray.forEach((run) => {
    // generatedAt is what the real endpoint actually sends - kept
    // startedAt/completedAt as fallbacks in case that ever changes.
    const ts = run.generatedAt || run.completedAt || run.startedAt || new Date().toISOString();

    (run.results || []).forEach((r) => {
      if (r.status && r.status !== "SUCCESS") return;
      const label = deriveLabel(r.url);
      const strategy = (r.strategy || run.strategy || "").toLowerCase();
      const key = `${label}|${strategy}`;

      if (!history[key]) history[key] = [];
      history[key].push({
        ts,
        scores: {
          performance: r.performanceScore != null ? Math.round(r.performanceScore) : null,
          accessibility: r.accessibilityScore != null ? Math.round(r.accessibilityScore) : null,
          best_practices: r.bestPracticesScore != null ? Math.round(r.bestPracticesScore) : null,
          seo: r.seoScore != null ? Math.round(r.seoScore) : null,
        },
      });
    });
  });

  // Oldest-first within each key, capped to the last 20 runs.
  Object.keys(history).forEach((key) => {
    history[key].sort((a, b) => new Date(a.ts) - new Date(b.ts));
    if (history[key].length > 20) history[key] = history[key].slice(-20);
  });

  return history;
}