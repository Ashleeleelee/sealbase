import { useState, useEffect } from "react";
import T from "../utils/tokens";
import { supabase } from "../lib/supabase";

const ACTION_LABELS = {
  update_quality: "修改数据质量",
  delete_seal: "删除个体",
  revert: "撤回操作",
};

export default function AdminPanel({ seals, onSealUpdate, isMobile }) {
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState("pending"); // "pending" | "logs"
  const [loading, setLoading] = useState(false);
  const [reverting, setReverting] = useState(null);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from("admin_logs").select("*").order("created_at", { ascending: false }).limit(50);
    setLogs(data || []);
  };

  const writeLog = async (action, seal, before, after, note = "") => {
    await supabase.from("admin_logs").insert([{
      action, target_id: seal.id, target_name: seal.name,
      before, after, note,
    }]);
    fetchLogs();
  };

  const handleSetQuality = async (seal, newQuality) => {
    setLoading(seal.id + newQuality);
    const before = { data_quality: seal.data_quality };
    const after = { data_quality: newQuality };
    const { error } = await supabase.from("seals").update(after).eq("id", seal.id);
    if (error) { alert("操作失败"); setLoading(null); return; }
    await writeLog("update_quality", seal, before, after,
      `${seal.data_quality} → ${newQuality}`);
    onSealUpdate(seal.id, after);
    setLoading(null);
  };

  const handleRevert = async (log) => {
    if (!log.before || !log.target_id) return;
    setReverting(log.id);
    const { error } = await supabase.from("seals").update(log.before).eq("id", log.target_id);
    if (error) { alert("撤回失败"); setReverting(null); return; }
    await writeLog("revert", { id: log.target_id, name: log.target_name },
      log.after, log.before, `撤回：${ACTION_LABELS[log.action] || log.action}`);
    onSealUpdate(log.target_id, log.before);
    setReverting(null);
  };

  const pending = seals.filter(s => s.data_quality === "待核实");
  const flagged = seals.filter(s => s.data_quality === "存疑");

  const tabBtn = (id, label, count) => (
    <button onClick={() => setTab(id)} style={{
      background: "none", border: "none",
      borderBottom: tab === id ? `2px solid #DC2626` : "2px solid transparent",
      padding: "9px 16px 10px", marginBottom: -1,
      color: tab === id ? "#DC2626" : T.muted,
      fontSize: 13, fontWeight: tab === id ? 700 : 400,
      cursor: "pointer", fontFamily: "inherit",
    }}>
      {label}
      {count > 0 && <span style={{ marginLeft: 5, background: tab === id ? "#DC2626" : T.border, color: tab === id ? "white" : T.muted, fontSize: 10, padding: "1px 6px", borderRadius: 99 }}>{count}</span>}
    </button>
  );

  const QualityBtn = ({ seal, quality, label, color, bg }) => (
    <button
      disabled={seal.data_quality === quality || loading === seal.id + quality}
      onClick={() => handleSetQuality(seal, quality)}
      style={{
        background: seal.data_quality === quality ? bg : "white",
        border: `1px solid ${seal.data_quality === quality ? color : T.border}`,
        color: seal.data_quality === quality ? color : T.muted,
        borderRadius: 6, padding: "4px 10px", fontSize: 11.5,
        cursor: seal.data_quality === quality ? "default" : "pointer",
        fontFamily: "inherit", fontWeight: seal.data_quality === quality ? 700 : 400,
        opacity: loading === seal.id + quality ? 0.5 : 1,
      }}>
      {loading === seal.id + quality ? "…" : label}
    </button>
  );

  const SealRow = ({ seal }) => (
    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.bg}`, display: "flex", alignItems: "center", gap: 12, flexWrap: isMobile ? "wrap" : "nowrap" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: T.ink }}>{seal.name}</span>
          <span style={{ color: T.faint, fontSize: 12 }}>{seal.facility}</span>
        </div>
        <div style={{ color: T.muted, fontSize: 11.5 }}>
          confirmations: {seal.confirmations || 0} · 来源: {seal.source_ref || "—"}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <QualityBtn seal={seal} quality="已核实（官方报道）" label="✓ 通过" color={T.green} bg={T.greenPale} />
        <QualityBtn seal={seal} quality="存疑" label="! 存疑" color="#DC2626" bg="#FEF2F2" />
        <QualityBtn seal={seal} quality="待核实" label="○ 待核实" color={T.amber} bg={T.amberPale} />
      </div>
    </div>
  );

  return (
    <div>
      {/* 管理员模式横幅 */}
      <div style={{ background: "#FEF2F2", border: `1px solid #FECACA`, borderRadius: 8, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>🔐</span>
        <div>
          <span style={{ color: "#DC2626", fontWeight: 700, fontSize: 13 }}>管理员模式</span>
          <span style={{ color: "#EF4444", fontSize: 12, marginLeft: 10 }}>所有操作均被记录，可撤回</span>
        </div>
      </div>

      <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
        {/* Tab 栏 */}
        <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 8px", display: "flex" }}>
          {tabBtn("pending", "待审核", pending.length)}
          {tabBtn("flagged", "存疑记录", flagged.length)}
          {tabBtn("logs", "操作日志", 0)}
        </div>

        {/* 待审核 */}
        {tab === "pending" && (
          pending.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: T.faint, fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}>✓</div>
              没有待审核的记录
            </div>
          ) : (
            <div>{pending.map(s => <SealRow key={s.id} seal={s} />)}</div>
          )
        )}

        {/* 存疑记录 */}
        {tab === "flagged" && (
          flagged.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: T.faint, fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}>!</div>
              没有存疑记录
            </div>
          ) : (
            <div>{flagged.map(s => <SealRow key={s.id} seal={s} />)}</div>
          )
        )}

        {/* 操作日志 */}
        {tab === "logs" && (
          logs.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: T.faint, fontSize: 13 }}>
              暂无操作记录
            </div>
          ) : (
            <div>
              {logs.map(log => (
                <div key={log.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.bg}`, display: "flex", alignItems: "center", gap: 12, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11.5, background: log.action === "revert" ? "#F3F4F6" : "#FEF2F2", color: log.action === "revert" ? T.muted : "#DC2626", padding: "1px 7px", borderRadius: 99, fontWeight: 600 }}>
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 13, color: T.ink }}>{log.target_name}</span>
                    </div>
                    <div style={{ color: T.muted, fontSize: 12 }}>{log.note}</div>
                    <div style={{ color: T.faint, fontSize: 11, marginTop: 2 }}>
                      {new Date(log.created_at).toLocaleString("zh-CN")}
                    </div>
                  </div>
                  {log.action !== "revert" && log.before && (
                    <button
                      disabled={reverting === log.id}
                      onClick={() => handleRevert(log)}
                      style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 12px", fontSize: 12, color: T.muted, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                      {reverting === log.id ? "撤回中…" : "↩ 撤回"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
