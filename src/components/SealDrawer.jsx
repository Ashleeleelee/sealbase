import { useState } from "react";
import T from "../utils/tokens";
import { StatusPill, QualityBadge } from "./Badges";

export default function SealDrawer({ seal, onClose, onSupplement }) {
  const [tab, setTab] = useState("info");
  if (!seal) return null;

  const fields = [
    ["个体名称", seal.name],
    ["性别", seal.sex],
    ["饲养机构", seal.facility],
    ["所在城市", [seal.city, seal.province].filter(Boolean).join("，")],
    ["个体来源", seal.source],
    ["入馆年份", seal.arrivedYear],
    seal.status === "已放归" && ["放归时间", seal.releaseDate],
    seal.status === "已放归" && ["放归地点", seal.releaseLocation],
  ].filter(Boolean);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", flexDirection: "column" }}>
      {/* 背景遮罩 */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(13,27,42,0.5)", backdropFilter: "blur(4px)",
      }} />

      {/* 抽屉主体 */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "white", borderRadius: "16px 16px 0 0",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
      }}>
        {/* 拖动指示条 */}
        <div style={{ padding: "10px 0 0", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{
          background: T.navy, margin: "10px 12px 0", borderRadius: 10,
          padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h2 style={{ margin: 0, color: "white", fontSize: 18, fontFamily: "'Noto Serif SC',serif", fontWeight: 700 }}>{seal.name}</h2>
              <StatusPill status={seal.status} />
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontStyle: "italic" }}>
              Phoca largha · {seal.facility}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button onClick={() => onSupplement(seal)} style={{
              background: T.teal, border: "none", color: "white",
              fontSize: 11.5, fontWeight: 700, padding: "5px 11px",
              borderRadius: 6, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
            }}>+ 补充</button>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.1)", border: "none",
              color: "rgba(255,255,255,0.6)", width: 28, height: 28,
              borderRadius: 6, cursor: "pointer", fontSize: 16,
            }}>×</button>
          </div>
        </div>

        {/* 标签栏 */}
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, padding: "0 12px", marginTop: 4 }}>
          {[["info", "档案"], ["timeline", `历史${seal.timeline?.length ? ` (${seal.timeline.length})` : ""}`]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              background: "none", border: "none",
              borderBottom: tab === id ? `2px solid ${T.teal}` : "2px solid transparent",
              padding: "10px 14px 10px", marginBottom: -1,
              color: tab === id ? T.teal : T.muted,
              fontSize: 13, fontWeight: tab === id ? 700 : 400,
              cursor: "pointer", fontFamily: "inherit",
            }}>{label}</button>
          ))}
        </div>

        {/* 内容区 */}
        <div style={{ overflowY: "auto", padding: "16px 16px 32px", flex: 1 }}>
          {tab === "info" && (
            <>
              <div style={{ background: T.bg, borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                {fields.map(([k, v]) => (
                  <div key={k} style={{
                    display: "flex", borderBottom: `1px solid ${T.border}`,
                    padding: "10px 14px", alignItems: "flex-start",
                  }}>
                    <span style={{ color: T.muted, fontSize: 12, width: 80, flexShrink: 0 }}>{k}</span>
                    <span style={{ color: v ? T.ink : T.faint, fontSize: 13, fontWeight: 500, flex: 1 }}>{v || "—"}</span>
                  </div>
                ))}
              </div>
              {seal.notes && (
                <div style={{
                  background: T.bg, border: `1px solid ${T.border}`,
                  borderRadius: 8, padding: "12px 14px", marginBottom: 10,
                }}>
                  <div style={{ color: T.faint, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>备注</div>
                  <p style={{ color: T.body, fontSize: 13, lineHeight: 1.75, margin: 0 }}>{seal.notes}</p>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ color: T.faint, fontSize: 11 }}>数据质量</span>
                <QualityBadge q={seal.dataQuality} />
              </div>
              {seal.dataQuality === "已核实（官方报道）" && (
                <div style={{
                  marginTop: 12, background: "#EFF6FF", border: "1px solid #BFDBFE",
                  borderRadius: 8, padding: "10px 12px", display: "flex", gap: 8,
                }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>🔒</span>
                  <div style={{ fontSize: 11.5, color: "#1D4ED8", lineHeight: 1.65 }}>
                    基础信息已通过官方报道核实，<strong>不可直接修改</strong>。点击「+ 补充」可添加时间线动态、图片或提交纠错申请。
                  </div>
                </div>
              )}
            </>
          )}
          {tab === "timeline" && (
            seal.timeline?.length > 0
              ? seal.timeline.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal, marginTop: 3 }} />
                      {i < seal.timeline.length - 1 && (
                        <div style={{ width: 1, flex: 1, background: T.border, marginTop: 4 }} />
                      )}
                    </div>
                    <div>
                      <div style={{ color: T.faint, fontSize: 11, marginBottom: 3 }}>{e.date}</div>
                      <div style={{ color: T.body, fontSize: 13, lineHeight: 1.65 }}>{e.text}</div>
                    </div>
                  </div>
                ))
              : <div style={{ textAlign: "center", padding: "32px 0", color: T.faint, fontSize: 13 }}>暂无历史记录</div>
          )}
        </div>
      </div>
    </div>
  );
}
