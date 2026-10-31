const BAND_CHIP = {
  fresh: "Fresh Leaf",
  honey: "Honey Ochre",
  terracotta: "Terracotta Alert",
  na: "No data",
};

export function band(score) {
  if (score === null || score === undefined) return "na";
  if (score >= 90) return "fresh";
  if (score >= 50) return "honey";
  return "terracotta";
}

export default function ScoreSwatch({ label, score }) {
  const b = band(score);
  return (
    <div className={`swatch ${b}`}>
      <div className="score">{score === null || score === undefined ? "—" : score}</div>
      <div className="cat">{label}</div>
      {/* <div className="chip">{BAND_CHIP[b]}</div> */}
    </div>
  );
}
