import { useState } from "react";
import T from "../utils/tokens";
import { StatusPill, QualityBadge, FieldRow } from "./Badges";
import ImageGallery from "./ImageGallery";
import Timeline from "./Timeline";

export default function SealDetail({ seal, onClose, onShare }) {
  const [tab, setTab] = useState("info");

  const tabBtn = (id, label, badge) => (
    <button onClick={() => setTab(id)} style={{ background: "none", border: "none", borderBottom: tab === id ? `2px solid ${T.teal}` : "2px solid transparent", padding: "8px 14px 9px", marginBottom: -1, color: tab === id ? T.teal : T.muted, fontSize: 12.5, fontWeight: tab === id ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>
      {label}{badge ? <span style={{ marginLeft: 4, background: T.tealPale, color: T.teal, fontSize: 10, padding: "0 5px", borderRadius: 99 }}>{badge}</span> : null}
    </button>
  );

  if (!seal) {
    return (
      <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.25 }}>🦭</div>
        <div style={{ color: T.faint, fontSize: 13 }}>选择左侧列表中的个体查看详情</div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ background: T.navy, padding: "18px 22px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <h2 style={{ margin: 0, color: "white", fontSize: 20, fontFamily: "'Noto Serif SC',serif", fontWeight: 700 }}>{seal.name}</h2>
            <StatusPill status={seal.status} />
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontStyle: "italic" }}>Phoca largha · {seal.facility}</div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.6)", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 15 }}>×</button>
      </div>
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 16px", display: "flex" }}>
        {tabBtn("info", "档案")}
        {tabBtn("images", "图集", seal.images && seal.images.length > 0 ? seal.images.length : null)}
        {tabBtn("timeline", "历史", seal.timeline && seal.timeline.length > 0 ? seal.timeline.length : null)}
      </div>
      <div style={{ padding: "18px 22px" }}>
        {tab === "info" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: T.faint, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>基本数据</div>
              <FieldRow label="个体名称" value={seal.name} />
              <FieldRow label="性别" value={seal.sex} />
              <FieldRow label="估计年龄" value={seal.ageEst} />
              <FieldRow label="体重" value={seal.weight} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: T.faint, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>圈养信息</div>
              <FieldRow label="饲养机构" value={seal.facility} />
              <FieldRow label="所在城市" value={[seal.city, seal.province].filter(Boolean).join("，")} />
              <FieldRow label="个体来源" value={seal.source} />
              <FieldRow label="入馆年份" value={seal.arrived_year} />
              <FieldRow label="芯片编号" value={seal.microchip} />
              {seal.status === "已放归" && <FieldRow label="放归时间" value={seal.release_date} />}
              {seal.status === "已放归" && <FieldRow label="放归地点" value={seal.release_location} />}
            </div>
            <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 7, padding: "12px 14px", marginBottom: 10 }}>
              <p style={{ color: T.body, fontSize: 12.5, lineHeight: 1.8, margin: 0 }}>{seal.notes || "暂无备注"}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ color: T.faint, fontSize: 11 }}>来源：{seal.source_ref || "—"}</span>
              <QualityBadge q={seal.data_quality} />
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: T.faint, fontSize: 11 }}>最近更新：{seal.lastUpdated || "—"}</span>
              <button onClick={() => onShare && onShare(seal)} style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "white", border: `1.5px solid ${T.teal}`, borderRadius: 7,
                padding: "6px 14px", color: T.teal, fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit"
              }}>
                🪄 分享名片
              </button>
            </div>
          </div>
        )}
        {tab === "images" && <ImageGallery images={seal.images || []} />}
        {tab === "timeline" && <Timeline entries={seal.timeline || []} />}
      </div>
    </div>
  );
}