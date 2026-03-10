import T from "../utils/tokens";

const STATUS_COLOR = {
  "圈养展示":      { bg: "#EFF6FF", color: "#1D4ED8", bar: "#3B82F6" },
  "救助中·待放归": { bg: "#ECFDF5", color: "#059669", bar: "#10B981" },
  "已放归":        { bg: "#F1F5F9", color: "#64748B", bar: "#94A3B8" },
  "繁育中":        { bg: "#FFFBEB", color: "#D97706", bar: "#F59E0B" },
};

// 空状态占位
function EmptyChart({ label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 140, gap: 8 }}>
      <div style={{ fontSize: 28, opacity: 0.15 }}>🦭</div>
      <div style={{ color: T.faint, fontSize: 12 }}>{label}</div>
    </div>
  );
}

// 卡片容器
function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: "18px 20px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: T.ink, fontSize: 13, fontWeight: 700 }}>{title}</div>
        {subtitle && <div style={{ color: T.faint, fontSize: 11.5, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

// 1. 各园区个体数量 — 横向柱状图
function FacilityBarChart({ seals }) {
  const data = Object.entries(
    seals.reduce((acc, s) => { acc[s.facility] = (acc[s.facility] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 8);

  if (!data.length) return <EmptyChart label="暂无园区数据" />;
  const max = data[0][1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map(([name, count]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 110, fontSize: 11.5, color: T.body, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            title={name}>{name}</div>
          <div style={{ flex: 1, background: T.bg, borderRadius: 4, height: 18, overflow: "hidden" }}>
            <div style={{
              width: `${(count / max) * 100}%`, height: "100%",
              background: `linear-gradient(90deg, ${T.teal}, #0EA5E9)`,
              borderRadius: 4, transition: "width 0.6s ease",
              display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
            }}>
              {count / max > 0.3 && <span style={{ color: "white", fontSize: 10.5, fontWeight: 700 }}>{count}</span>}
            </div>
          </div>
          {count / max <= 0.3 && <span style={{ color: T.muted, fontSize: 11, width: 14 }}>{count}</span>}
        </div>
      ))}
    </div>
  );
}

// 2. 状态分布 — 横向堆叠 + 图例
function StatusChart({ seals }) {
  if (!seals.length) return <EmptyChart label="暂无状态数据" />;

  const counts = seals.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});
  const total = seals.length;
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      {/* 堆叠条 */}
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 28, marginBottom: 14 }}>
        {entries.map(([status, count]) => (
          <div key={status} title={`${status}: ${count}`} style={{
            width: `${(count / total) * 100}%`,
            background: STATUS_COLOR[status]?.bar || T.teal,
            transition: "width 0.6s ease",
          }} />
        ))}
      </div>
      {/* 图例 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {entries.map(([status, count]) => (
          <div key={status} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: STATUS_COLOR[status]?.bar || T.teal, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: T.body }}>{status}</span>
            <span style={{ fontSize: 12, color: T.faint }}>({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. 雌雄比例 — SVG 圆环图
function SexDonutChart({ seals }) {
  const counts = { 雌: 0, 雄: 0, 未知: 0 };
  seals.forEach(s => { if (s.sex in counts) counts[s.sex]++; });
  const total = seals.length;
  if (!total) return <EmptyChart label="暂无性别数据" />;

  const COLORS = { 雌: "#EC4899", 雄: "#3B82F6", 未知: "#CBD5E1" };
  const r = 44, cx = 60, cy = 60, stroke = 14;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const slices = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([label, value]) => {
      const pct = value / total;
      const dash = pct * circ;
      const slice = { label, value, pct, dash, offset };
      offset += dash;
      return slice;
    });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={120} height={120} style={{ flexShrink: 0 }}>
        {/* 背景圆 */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.bg} strokeWidth={stroke} />
        {slices.map(s => (
          <circle key={s.label} cx={cx} cy={cy} r={r} fill="none"
            stroke={COLORS[s.label]}
            strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={-(s.offset - circ / 4)}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={18} fontWeight={700} fill={T.ink}>{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={10} fill={T.faint}>总计</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {slices.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS[s.label], flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: T.body, width: 28 }}>{s.label}</span>
            <span style={{ fontSize: 12.5, color: T.ink, fontWeight: 700 }}>{s.value}</span>
            <span style={{ fontSize: 11, color: T.faint }}>({Math.round(s.pct * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. 入馆年份趋势 — 折线图 SVG
function YearTrendChart({ seals }) {
  const withYear = seals.filter(s => s.arrived_year && /^\d{4}$/.test(s.arrived_year));
  if (withYear.length < 2) return <EmptyChart label="需至少 2 条有入馆年份的记录" />;

  const counts = withYear.reduce((acc, s) => {
    acc[s.arrived_year] = (acc[s.arrived_year] || 0) + 1;
    return acc;
  }, {});
  const years = Object.keys(counts).sort();
  const values = years.map(y => counts[y]);
  const max = Math.max(...values);

  const W = 280, H = 100, PAD = { t: 10, b: 24, l: 24, r: 10 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const xStep = years.length > 1 ? innerW / (years.length - 1) : innerW;

  const pts = years.map((y, i) => ({
    x: PAD.l + i * xStep,
    y: PAD.t + innerH - (values[i] / max) * innerH,
    label: y, value: values[i],
  }));

  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `M${pts[0].x},${PAD.t + innerH} ` + pts.map(p => `L${p.x},${p.y}`).join(" ") + ` L${pts[pts.length - 1].x},${PAD.t + innerH} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* 面积填充 */}
      <path d={area} fill={`${T.teal}18`} />
      {/* 折线 */}
      <polyline points={polyline} fill="none" stroke={T.teal} strokeWidth={2} strokeLinejoin="round" />
      {/* 数据点 */}
      {pts.map(p => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r={4} fill="white" stroke={T.teal} strokeWidth={2} />
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={9} fill={T.teal} fontWeight={700}>{p.value}</text>
          <text x={p.x} y={H - 6} textAnchor="middle" fontSize={9} fill={T.faint}>{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// 主导出组件
export default function StatsCharts({ seals }) {
  if (!seals || seals.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ color: T.ink, fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: "'Noto Serif SC',serif" }}>
        数据统计
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <ChartCard title="各园区个体数量" subtitle="最多显示前 8 个园区">
          <FacilityBarChart seals={seals} />
        </ChartCard>
        <ChartCard title="性别比例">
          <SexDonutChart seals={seals} />
        </ChartCard>
        <ChartCard title="个体状态分布">
          <StatusChart seals={seals} />
        </ChartCard>
        <ChartCard title="入馆年份趋势" subtitle="仅统计有年份记录的个体">
          <YearTrendChart seals={seals} />
        </ChartCard>
      </div>
    </div>
  );
}