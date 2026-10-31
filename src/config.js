// ====== Flip this ONE flag when AEM's real endpoint is ready ======
// true  = use the embedded dummy data below (DUMMY_AEM_REPORT)
// false = fetch live from REPORT_URL
export const USE_DUMMY_DATA = true;

// The real AEM endpoint - update this whenever AEM shares it.
// Shape is auto-detected (works for AEM's shape or this project's own
// Python backend shape) - see lib/aemAdapter.js.
export const REPORT_URL = "http://localhost:4502/bin/apsite/pagespeed/latest.json";

// The real history endpoint - update this once AEM shares it.
// Same USE_DUMMY_DATA flag above controls this too.
export const HISTORY_URL = "http://localhost:4502/bin/apsite/pagespeed/history.json";

// Show/hide the History tab.

// Show/hide the History tab. Set to false to go back to a single-view
// dashboard with no tab bar at all.
export const SHOW_HISTORY_TAB = true;

// Fixed alert thresholds - a score below these is flagged as a breach.
export const THRESHOLDS = {
  performance: 70,
  accessibility: 80,
  best_practices: 80,
  seo: 80,
};
