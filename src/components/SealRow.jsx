import { useState } from "react";
import T from "../utils/tokens";
import { StatusPill, QualityBadge } from "./Badges";

export default function SealRow({ seal, onClick, isSelected, onShare }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: isSelected ? "#F0F9FF" : hov ? "#F8FAFC" : "white", cursor: "pointer", borderBottom: `1px solid ${T.border}`, transition: "background 0.1s" }}>
      <td onClick={() => onClick(seal)} style={{ padding: "10px 16px", fontWeight: 700, color: isSelected ? T.teal : T.ink, fontSize: 13.5, fontFamily: "'Noto Serif SC',serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {seal.images && seal.images[0] && (
            <img src={seal.images[0]} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
          )}
          {seal.name}
        </div>
      </td>
      <td onClick={() => onClick(seal)} style={{ padding: "10px 16px", color: T.body, fontSize: 12.5 }}>{seal.sex}</td>
      <td onClick={() => onClick(seal)} style={{ padding: "10px 16px", color: T.body, fontSize: 12.5, fontStyle: "italic" }}>P. largha</td>
      <td onClick={() => onClick(seal)} style={{ padding: "10px 16px", color: T.body, fontSize: 12.5 }}>{seal.facility}</td>
      <td onClick={() => onClick(seal)} style={{ padding: "10px 16px" }}><StatusPill status={seal.status} /></td>
      <td onClick={() => onClick(seal)} style={{ padding: "10px 16px" }}><QualityBadge q={seal.dataQuality} /></td>
      <td style={{ padding: "10px 12px", textAlign: "center" }}>
        <button
          onClick={e => { e.stopPropagation(); onShare && onShare(seal); }}
          title="分享名片"
          style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "3px 8px", fontSize: 13, cursor: "pointer", color: T.muted, opacity: hov ? 1 : 0.4, transition: "opacity 0.15s" }}>
          🔗
    
        </button>
      </td>
    </tr>
  );
}


