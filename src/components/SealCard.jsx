import { useState } from "react";
import T from "../utils/tokens";
import { StatusPill, QualityBadge } from "./Badges";

export default function SealCard({ seal, onTap }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onClick={() => onTap(seal)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: pressed ? "#F0F9FF" : "white",
        borderBottom: `1px solid ${T.border}`,
        padding: "14px 16px", cursor: "pointer",
        transition: "background 0.1s", display: "flex", gap: 12, alignItems: "flex-start",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 8, background: T.tealPale,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontSize: 20,
      }}>🦭</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, color: T.ink, fontFamily: "'Noto Serif SC',serif" }}>{seal.name}</span>
          <StatusPill status={seal.status} />
        </div>
        <div style={{ color: T.muted, fontSize: 12, marginBottom: 4 }}>{seal.facility} · {seal.province}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: T.faint, fontSize: 11.5 }}>{seal.sex} · {seal.arrivedYear}年入馆</span>
          <QualityBadge q={seal.dataQuality} />
        </div>
      </div>
    </div>
  );
}
