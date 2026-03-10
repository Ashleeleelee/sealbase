import T from "../utils/tokens";

function getDailyIndex(total) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % total;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

const STATUS_STYLE = {
  "圈养展示":      { bg: "#EFF6FF", color: "#1D4ED8" },
  "救助中·待放归": { bg: "#ECFDF5", color: "#059669" },
  "已放归":        { bg: "#F8FAFC", color: "#64748B" },
  "繁育中":        { bg: "#FFFBEB", color: "#D97706" },
};

export default function DailyModal({ seals, onClose, onViewSeal }) {
  const hasData = seals && seals.length > 0;
  const seal = hasData ? seals[getDailyIndex(seals.length)] : null;
  const statusStyle = seal ? (STATUS_STYLE[seal.status] || { bg: "#F8FAFC", color: "#64748B" }) : {};

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.6)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 16, maxWidth: 460, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" }}>

        <div style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #0c3a5e 100%)", padding: "22px 26px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10.5, letterSpacing: "0.1em", marginBottom: 5 }}>TODAY'S SEAL · {todayStr()}</div>
            <div style={{ color: "white", fontSize: 18, fontWeight: 700, fontFamily: "'Noto Serif SC',serif" }}>🦭 今日一豹</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.6)", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 15 }}>×</button>
        </div>

        <div style={{ padding: "24px 26px 26px" }}>
          {!hasData ? (
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <div style={{ fontSize: 52, marginBottom: 14, opacity: 0.2 }}>🦭</div>
              <div style={{ color: "#0F172A", fontSize: 15, fontWeight: 700, fontFamily: "'Noto Serif SC',serif", marginBottom: 8 }}>更多海豹正在赶来……</div>
              <p style={{ color: "#64748B", fontSize: 13, lineHeight: 1.8, margin: "0 0 20px" }}>
                每当数据库收录新的斑海豹档案，<br />
                「今日一豹」将按日期为你随机推送一只——<br />
                同一天所有访客看到同一只。
              </p>
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 14px", color: "#78350F", fontSize: 12, lineHeight: 1.7 }}>
                🌊 成为第一个贡献者，你提交的个体<br />将有机会成为「今日一豹」的主角！
              </div>
            </div>
          ) : (
            <div>
              <div style={{ background: "#F8FAFC", borderRadius: 10, height: 180, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                {seal.images && seal.images.length > 0
                  ? <img src={seal.images[0]} alt={seal.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ textAlign: "center" }}><div style={{ fontSize: 52, opacity: 0.15 }}>🦭</div><div style={{ color: "#94A3B8", fontSize: 11.5, marginTop: 6 }}>暂无照片</div></div>
                }
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontFamily: "'Noto Serif SC',serif", color: "#0F172A" }}>{seal.name}</h2>
                {seal.sex && seal.sex !== "未知" && <span style={{ color: "#64748B", fontSize: 16 }}>{seal.sex === "雌" ? "♀" : "♂"}</span>}
                <span style={{ background: statusStyle.bg, color: statusStyle.color, fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 600, marginLeft: "auto" }}>{seal.status}</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 14, color: "#64748B", fontSize: 12.5 }}>
                <span>🏛</span><span>{seal.facility}</span>
                {seal.city && <><span style={{ color: "#E2E8F0" }}>·</span><span>{seal.city}</span></>}
              </div>
              {seal.notes && (
                <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px 14px", color: "#334155", fontSize: 13, lineHeight: 1.8, marginBottom: 16, borderLeft: "3px solid #0891B2" }}>
                  {seal.notes}
                </div>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                {seal.arrived_year && <div style={{ background: "#F8FAFC", borderRadius: 7, padding: "7px 12px", fontSize: 12 }}><span style={{ color: "#94A3B8" }}>入馆：</span><span style={{ color: "#0F172A", fontWeight: 600 }}>{seal.arrived_year} 年</span></div>}
                {seal.source && <div style={{ background: "#F8FAFC", borderRadius: 7, padding: "7px 12px", fontSize: 12 }}><span style={{ color: "#94A3B8" }}>来源：</span><span style={{ color: "#0F172A", fontWeight: 600 }}>{seal.source}</span></div>}
                {seal.status === "已放归" && seal.release_location && <div style={{ background: "#ECFDF5", borderRadius: 7, padding: "7px 12px", fontSize: 12 }}><span style={{ color: "#059669" }}>🌊 放归于 {seal.release_location}</span></div>}
              </div>
              <button onClick={() => { onViewSeal(seal); onClose(); }} style={{ width: "100%", background: "#0891B2", border: "none", borderRadius: 8, padding: 12, color: "white", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                查看完整档案 →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
