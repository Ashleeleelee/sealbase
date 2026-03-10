import T from "../utils/tokens";

export default function Timeline({ entries }) {
  if (!entries || entries.length === 0) {
    return <div style={{ color: T.faint, fontSize: 12, padding: "8px 0" }}>暂无更新记录</div>;
  }
  return (
    <div>
      {entries.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal, marginTop: 4 }} />
            {i < entries.length - 1 && <div style={{ width: 1, flex: 1, background: T.border, marginTop: 4 }} />}
          </div>
          <div>
            <div style={{ color: T.faint, fontSize: 10.5, marginBottom: 2 }}>{e.date}</div>
            <div style={{ color: T.body, fontSize: 12.5, lineHeight: 1.65 }}>{e.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
