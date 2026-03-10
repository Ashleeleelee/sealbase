import T from "../utils/tokens";
import { STATUS_META, QUALITY_CFG } from "../utils/statusConfig";

export function StatusPill({ status }) {
  const s = STATUS_META[status] || { dot: T.faint, bg: "#F1F5F9", text: T.muted };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px", borderRadius: 99, background: s.bg, color: s.text, fontSize: 11.5, fontWeight: 600, border: `1px solid ${s.dot}25` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

export function QualityBadge({ q }) {
  const c = QUALITY_CFG[q] || QUALITY_CFG["待核实"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: c.color, fontWeight: 600 }}>
      {c.icon} {q}
    </span>
  );
}

export function FieldRow({ label, value }) {
  const empty = !value || value === "—";
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, padding: "9px 0" }}>
      <span style={{ color: T.muted, fontSize: 12, width: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ color: empty ? T.faint : T.ink, fontSize: 13, fontWeight: 500 }}>{value || "—"}</span>
    </div>
  );
}
