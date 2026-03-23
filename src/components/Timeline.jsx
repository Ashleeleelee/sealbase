import T from "../utils/tokens";

export default function Timeline({ entries }) {
  if (!entries || entries.length === 0) {
    return <div style={{ color: T.faint, fontSize: 12, padding: "8px 0" }}>暂无更新记录</div>;
  }
  return (
    <div>
      {entries.map((e, i) => {
        const isTransfer = e.type === "transfer";
        return (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: isTransfer ? 2 : "50%", background: isTransfer ? T.amber : T.teal, marginTop: 4 }} />
              {i < entries.length - 1 && <div style={{ width: 1, flex: 1, background: T.border, marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: T.faint, fontSize: 10.5, marginBottom: 2 }}>{e.date}</div>
              {isTransfer ? (
                <div style={{ background: T.amberPale, border: `1px solid #FDE68A`, borderRadius: 6, padding: "7px 10px" }}>
                  <div style={{ color: T.amber, fontSize: 11, fontWeight: 700, marginBottom: 3 }}>🏠 园区发生更改</div>
                  <div style={{ color: "#78350F", fontSize: 12.5, fontWeight: 600 }}>
                    {e.fromFacility} <span style={{ color: T.amber, margin: "0 4px" }}>→</span> {e.toFacility}
                  </div>
                  {e.text && <div style={{ color: T.body, fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>{e.text}</div>}
                </div>
              ) : (
                <div style={{ color: T.body, fontSize: 12.5, lineHeight: 1.65 }}>{e.text}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
