const METRICS = [
  ["fcp", "FCP"],
  ["lcp", "LCP"],
  ["tbt", "TBT"],
  ["cls", "CLS"],
  ["si", "SI"],
];
const CWV = new Set(["lcp", "cls"]);

export default function MetricsRow({ metrics }) {
  if (!metrics) return null;
  return (
    <div className="metrics-row">
      {/* {METRICS.map(([key, label]) => (
        <span key={key} className={`metric-chip ${CWV.has(key) ? "cwv" : ""}`}>
          <span className="mk">{label}</span>
          <span className="mv">{metrics[key] || "—"}</span>
        </span>
      ))} */}
    </div>
  );
}
