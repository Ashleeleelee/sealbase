import { useState } from "react";
import T from "../utils/tokens";
import { StatusPill, QualityBadge } from "./Badges";

export default function SealRow({ seal, onClick, isSelected }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onClick={() => onClick(seal)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: isSelected ? "#F0F9FF" : hov ? "#F8FAFC" : "white", cursor: "pointer", borderBottom: `1px solid ${T.border}`, transition: "background 0.1s" }}>
      <td style={{ padding: "10px 16px", fontWeight: 700, color: isSelected ? T.teal : T.ink, fontSize: 13.5, fontFamily: "'Noto Serif SC',serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {seal.images && seal.images[0] && (
            <img src={seal.images[0]} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
          )}
          {seal.name}
        </div>
      </td>
      <td style={{ padding: "10px 16px", color: T.body, fontSize: 12.5 }}>{seal.sex}</td>
      <td style={{ padding: "10px 16px", color: T.body, fontSize: 12.5, fontStyle: "italic" }}>P. largha</td>
      <td style={{ padding: "10px 16px", color: T.body, fontSize: 12.5 }}>{seal.facility}</td>
      <td style={{ padding: "10px 16px" }}><StatusPill status={seal.status} /></td>
      <td style={{ padding: "10px 16px" }}><QualityBadge q={seal.dataQuality} /></td>
    </tr>
  );
}
