import { useState } from "react";
import T from "../utils/tokens";

export default function SupplementModal({ seal, onClose, onSubmit }) {
  const isLocked = seal.dataQuality === "已核实（官方报道）";
  const [eventDate, setEventDate] = useState("");
  const [eventText, setEventText] = useState("");
  const [comment, setComment] = useState("");
  const [dispute, setDispute] = useState("");

  const inp = {
    width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 8,
    padding: "10px 12px", fontSize: 13.5, outline: "none", color: T.ink,
    background: "white", fontFamily: "inherit", boxSizing: "border-box",
  };
  const lbl = { display: "block", color: T.muted, fontSize: 12, fontWeight: 600, marginBottom: 5 };
  const sec = { color: T.ink, fontWeight: 700, fontSize: 13, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 };

  const handleSubmit = () => {
    const updates = { ...seal };
    if (eventDate && eventText) {
      updates.timeline = [...(seal.timeline || []), { date: eventDate, text: eventText }];
    }
    onSubmit(updates);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(13,27,42,0.6)", backdropFilter: "blur(6px)",
      zIndex: 500, display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        background: "white", borderRadius: "16px 16px 0 0", width: "100%",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
      }}>
        {/* 顶部把手 + 标题 */}
        <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2 }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingBottom: 12, borderBottom: `1px solid ${T.border}`,
          }}>
            <div>
              <div style={{ color: T.ink, fontWeight: 700, fontSize: 15 }}>补充 · {seal.name}</div>
              <div style={{ color: T.faint, fontSize: 11.5, marginTop: 2 }}>
                {isLocked ? "基础信息已锁定，可补充动态 / 评论 / 纠错" : "可补充动态与评论"}
              </div>
            </div>
            <button onClick={onClose} style={{
              background: T.bg, border: `1px solid ${T.border}`,
              borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 17, color: T.muted,
            }}>×</button>
          </div>
        </div>

        {/* 滚动内容 */}
        <div style={{ overflowY: "auto", padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          {isLocked && (
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "10px 12px", display: "flex", gap: 8 }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>🔒</span>
              <div style={{ fontSize: 12, color: "#1D4ED8", lineHeight: 1.65 }}>
                <strong>名称、性别、机构、状态</strong>等基础字段已锁定。如有错误，请使用下方纠错申请。
              </div>
            </div>
          )}

          {/* 时间线动态 */}
          <div>
            <div style={sec}><span>📅</span>添加时间线动态</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <label style={lbl}>日期</label>
                <input value={eventDate} onChange={e => setEventDate(e.target.value)} placeholder="例：2024-03" style={inp} />
              </div>
              <div>
                <label style={lbl}>事件描述</label>
                <textarea
                  value={eventText} onChange={e => setEventText(e.target.value)}
                  placeholder="例：体检显示体重增至86kg，状态良好..."
                  rows={3} style={{ ...inp, resize: "none", lineHeight: 1.6 }}
                />
              </div>
            </div>
          </div>

          {/* 上传图片（占位） */}
          <div>
            <div style={sec}><span>🖼</span>上传图片</div>
            <div style={{
              border: `2px dashed ${T.border}`, borderRadius: 8, padding: "22px 0",
              textAlign: "center", color: T.faint, fontSize: 12.5,
            }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>📷</div>
              点击或拖拽上传（功能开发中）
            </div>
          </div>

          {/* 评论 */}
          <div>
            <div style={sec}><span>💬</span>留言 / 评论</div>
            <textarea
              value={comment} onChange={e => setComment(e.target.value)}
              placeholder="你的观察记录、探访印象，或对该个体的补充说明..."
              rows={3} style={{ ...inp, resize: "none", lineHeight: 1.6 }}
            />
          </div>

          {/* 纠错（仅已核实个体） */}
          {isLocked && (
            <div style={{ border: `1px solid #FDE68A`, borderRadius: 8, padding: "12px 13px", background: T.amberPale }}>
              <div style={{ color: "#92400E", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>⚑ 提交纠错申请</div>
              <textarea
                value={dispute} onChange={e => setDispute(e.target.value)}
                placeholder="如有数据错误，请说明具体问题及你的信息来源..."
                rows={2} style={{ ...inp, resize: "none", lineHeight: 1.6, background: "white" }}
              />
              <div style={{ color: T.amber, fontSize: 11, marginTop: 5 }}>纠错申请将提交给维护者审核，通过后更新记录</div>
            </div>
          )}

          <button onClick={handleSubmit} style={{
            background: T.teal, border: "none", borderRadius: 10, padding: "14px 0",
            color: "white", fontSize: 14.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>
            提交补充
          </button>
        </div>
      </div>
    </div>
  );
}
