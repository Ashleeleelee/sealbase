import T from "../utils/tokens";

export default function StatsStrip({ seals, facilities }) {
  const stats = [
    { n: seals.length, label: "个体档案", sub: "含待核实条目" },
    { n: seals.filter(s => s.dataQuality === "已核实（官方报道）").length, label: "已核实", sub: "有官方来源支撑" },
    { n: seals.filter(s => s.images && s.images.length > 0).length, label: "有图片记录", sub: "含照片个体" },
    { n: facilities.filter(f => f.steward).length, label: "园区已认领", sub: "有数据负责人" },
  ];
  return (
    <div style={{ background: "white", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex" }}>
        {stats.map(({ n, label, sub }, i) => (
          <div key={label} style={{ flex: 1, padding: "16px 22px", borderRight: i < 3 ? `1px solid ${T.bg}` : undefined }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: T.teal }}>{n}</span>
              <span style={{ color: T.ink, fontSize: 13.5, fontWeight: 700 }}>{label}</span>
            </div>
            <div style={{ color: T.faint, fontSize: 11, marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
