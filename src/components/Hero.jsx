import T from "../utils/tokens";

export default function Hero({ seals }) {
  return (
    <div style={{ background: `linear-gradient(170deg, ${T.navy} 0%, #0C2A3F 60%, #0A3D52 100%)`, padding: "44px 32px 0", borderBottom: `3px solid ${T.teal}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
        <svg viewBox="0 0 1440 72" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,36 C120,60 240,12 360,36 C480,60 600,12 720,36 C840,60 960,12 1080,36 C1200,60 1320,20 1440,36 L1440,72 L0,72 Z" fill="#0E4D6B" opacity="0.9" />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
        <svg viewBox="0 0 1440 52" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,26 C180,48 360,4 540,26 C720,48 900,6 1080,26 C1260,46 1380,16 1440,26 L1440,52 L0,52 Z" fill="#0A3D52" opacity="0.85" />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
        <svg viewBox="0 0 1440 34" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,17 C90,30 180,4 270,17 C360,30 450,4 540,17 C630,30 720,4 810,17 C900,30 990,4 1080,17 C1170,30 1260,6 1350,17 C1395,23 1420,14 1440,17 L1440,34 L0,34 Z" fill="#1B6E8A" opacity="0.5" />
        </svg>
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, paddingBottom: 52 }}>
        <div>
          <div style={{ color: T.tealPale, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, opacity: 0.7 }}>中国 · 非官方社区数据库</div>
          <h1 style={{ color: "white", fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, fontFamily: "'Noto Serif SC',serif", margin: "0 0 12px", lineHeight: 1.2 }}>记录每一只有名字的斑海豹</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14.5, margin: "0 0 6px", lineHeight: 1.8, maxWidth: 520 }}>斑海豹是中国唯一在本土海域繁殖的鳍足类动物，国家一级保护动物。本数据库由爱好者社区协作维护，追踪中国各水族馆及救助机构中的圈养个体。</p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12.5, margin: 0, fontStyle: "italic" }}>让每一只斑海豹都被看见，被记录，被了解。</p>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { n: seals.length, label: "个体档案" },
            { n: seals.filter(s => s.status === "救助中·待放归").length, label: "救助中" },
            { n: seals.filter(s => s.status === "已放归").length, label: "已放归" },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: "white", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{n}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11.5, marginTop: 5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
