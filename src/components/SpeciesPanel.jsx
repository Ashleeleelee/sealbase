import T from "../utils/tokens";
import { QUALITY_CFG } from "../utils/statusConfig";

export default function SpeciesPanel() {
  const rows = [
    ["学名",      "Phoca largha"],
    ["中文名",    "西太平洋斑海豹"],
    ["保护级别",  "国家一级（2021年升级）"],
    ["中国种群",  "约 2,000 只（2006–07）"],
    ["主要繁殖地","辽东湾（全球最南端）"],
    ["产崽季节",  "每年 1–2 月"],
    ["成体体重",  "约 85–100 kg"],
  ];
  return (
    <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ background: T.navy, padding: "12px 16px" }}>
        <div style={{ color: "white", fontWeight: 700, fontSize: 13, fontFamily: "'Noto Serif SC',serif" }}>物种信息</div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontStyle: "italic" }}>Phoca largha</div>
      </div>
      <div style={{ padding: "4px 0" }}>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: "flex", borderBottom: `1px solid ${T.bg}`, padding: "8px 16px" }}>
            <span style={{ color: T.faint, fontSize: 11, width: 80, flexShrink: 0 }}>{k}</span>
            <span style={{ color: T.ink, fontSize: 12.5, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 16px", background: T.bg, borderTop: `1px solid ${T.border}` }}>
        <p style={{ color: T.muted, fontSize: 11.5, lineHeight: 1.75, margin: 0 }}>
          斑海豹是唯一在中国海域繁殖的鳍足类动物，2021年由二级升为<strong style={{ color: T.ink }}>一级保护动物</strong>。
        </p>
      </div>
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ color: T.faint, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>数据质量</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(QUALITY_CFG).map(([q, c]) => (
            <div key={q} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: c.color, fontWeight: 700, fontSize: 13 }}>{c.icon}</span>
              <span style={{ color: c.color, fontSize: 12, fontWeight: 600 }}>{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
