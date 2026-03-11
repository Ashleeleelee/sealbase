import T from "../utils/tokens";

export default function StatsStrip({ seals, facilities, isMobile }) {
  const stats = [
    { n: seals.length, label: "个体档案", sub: "含待核实条目" },
    { n: seals.filter(s => s.data_quality === "已核实（官方报道）").length, label: "已核实", sub: "有官方来源支撑" },
    { n: seals.filter(s => Array.isArray(s.images) && s.images.some(u => u?.startsWith("http"))).length, label: "有图片记录", sub: "含照片个体" },
    { n: facilities.filter(f => f.steward).length, label: "园区已认领", sub: "有数据负责人" },
  ];

  return (
    <div style={{ background: "white", borderBottom: `1px solid ${T.border}`, overflow: "hidden" }}>
      <div style={{
        maxWidth: 1120, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        padding: isMobile ? "0 14px" : "0",
      }}>
        {stats.map(({ n, label, sub }, i) => (
          <div key={label} style={{
            padding: isMobile ? "12px 8px" : "16px 22px",
            borderRight: isMobile
              ? (i % 2 === 0 ? `1px solid ${T.bg}` : "none")
              : (i < 3 ? `1px solid ${T.bg}` : "none"),
            borderBottom: isMobile && i < 2 ? `1px solid ${T.bg}` : "none",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: T.teal }}>{n}</span>
              <span style={{ color: T.ink, fontSize: isMobile ? 11.5 : 13.5, fontWeight: 700 }}>{label}</span>
            </div>
            <div style={{ color: T.faint, fontSize: 10.5, marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
