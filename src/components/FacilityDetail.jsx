import { useState, useEffect } from "react";
import T from "../utils/tokens";
import { supabase } from "../lib/supabase";
import FacilityObserveModal from "./FacilityObserveModal";

// 星星显示（只读）
function Stars({ value, size = 14 }) {
  const v = Math.round(value || 0);
  return (
    <span style={{ color: "#F59E0B", fontSize: size, letterSpacing: 1 }}>
      {"★".repeat(v)}{"☆".repeat(5 - v)}
    </span>
  );
}

// 单项评分行
function ScoreRow({ label, value, count }) {
  if (!value) return null;
  const pct = (value / 5) * 100;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ color: T.body, fontSize: 12.5 }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Stars value={value} size={12} />
          <span style={{ color: T.ink, fontSize: 12.5, fontWeight: 700 }}>{value.toFixed(1)}</span>
          <span style={{ color: T.faint, fontSize: 11 }}>/ 5</span>
        </div>
      </div>
      <div style={{ height: 5, background: T.border, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: T.teal, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

export default function FacilityDetail({ facility, seals, onClose, onViewSeal, isMobile }) {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showObserveModal, setShowObserveModal] = useState(false);
  const [lightbox, setLightbox] = useState(null); // 图片大图预览

  const facilitySeals = seals.filter(s => s.facility === facility.name);

  useEffect(() => {
    fetchObservations();
  }, [facility.name]);

  const fetchObservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("facility_observations")
      .select("*")
      .eq("facility", facility.name)
      .order("created_at", { ascending: false });
    if (error) console.error("拉取观察记录失败:", error);
    else setObservations(data || []);
    setLoading(false);
  };

  // 计算汇总数据
  const obsWithWater = observations.filter(o => o.score_water);
  const obsWithSpace = observations.filter(o => o.score_space);
  const obsWithCond = observations.filter(o => o.score_condition);
  const avgWater = obsWithWater.length ? obsWithWater.reduce((s, o) => s + o.score_water, 0) / obsWithWater.length : null;
  const avgSpace = obsWithSpace.length ? obsWithSpace.reduce((s, o) => s + o.score_space, 0) / obsWithSpace.length : null;
  const avgCond = obsWithCond.length ? obsWithCond.reduce((s, o) => s + o.score_condition, 0) / obsWithCond.length : null;
  const overallAvg = [avgWater, avgSpace, avgCond].filter(Boolean);
  const overallScore = overallAvg.length ? overallAvg.reduce((a, b) => a + b, 0) / overallAvg.length : null;

  // 目测数量取最小值（"至少有这么多"）
  const countObs = observations.filter(o => o.seal_count > 0);
  const minCount = countObs.length ? Math.min(...countObs.map(o => o.seal_count)) : null;

  // 所有图片汇总
  const allImages = observations.flatMap(o => o.images || []).filter(Boolean);

  // 最近观察时间
  const lastObs = observations[0]?.created_at;
  const lastObsDate = lastObs ? new Date(lastObs).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }) : null;

  return (
    <>
      {showObserveModal && (
        <FacilityObserveModal
          facility={facility.name}
          onClose={() => setShowObserveModal(false)}
          onSubmit={fetchObservations}
        />
      )}

      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <img src={lightbox} alt="" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 8, objectFit: "contain" }} />
          <button onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", color: "white", width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
      )}

      {/* 遮罩 */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.45)", backdropFilter: "blur(4px)", zIndex: 250 }} />

      {/* 详情面板 */}
      <div style={{
        position: "fixed",
        ...(isMobile
          ? { bottom: 0, left: 0, right: 0, borderRadius: "16px 16px 0 0", maxHeight: "92vh" }
          : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", borderRadius: 14, maxWidth: 640, width: "calc(100% - 40px)", maxHeight: "88vh" }),
        background: "white",
        zIndex: 260,
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>

        {/* 拖动把手（手机端） */}
        {isMobile && <div style={{ width: 36, height: 4, background: T.border, borderRadius: 99, margin: "12px auto 0" }} />}

        {/* 头部 */}
        <div style={{ padding: isMobile ? "16px 18px 14px" : "24px 28px 18px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: isMobile ? 16 : 18, color: T.ink, fontFamily: "'Noto Serif SC',serif" }}>{facility.name}</h2>
              <div style={{ color: T.muted, fontSize: 12 }}>
                {facility.seals[0]?.province && facility.seals[0]?.city
                  ? `${facility.seals[0].province} · ${facility.seals[0].city}`
                  : facility.seals[0]?.province || "—"}
                {lastObsDate && <span style={{ marginLeft: 10, color: T.faint }}>最近观察：{lastObsDate}</span>}
              </div>
            </div>
            <button onClick={onClose}
              style={{ background: T.bg, border: "none", color: T.muted, width: 30, height: 30, borderRadius: 6, cursor: "pointer", fontSize: 16, flexShrink: 0 }}>×</button>
          </div>

          {/* 综合评分概览 */}
          {overallScore !== null && (
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "center", background: T.teal, borderRadius: 10, padding: "8px 16px", color: "white" }}>
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{overallScore.toFixed(1)}</div>
                <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>综合评分</div>
              </div>
              <div style={{ flex: 1 }}>
                <Stars value={overallScore} size={16} />
                <div style={{ color: T.muted, fontSize: 11.5, marginTop: 3 }}>
                  基于 {observations.length} 条观察记录
                  {minCount !== null && <span style={{ marginLeft: 8 }}>· 至少 <strong>{minCount}</strong> 只</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: isMobile ? "16px 18px" : "20px 28px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* 板块1：环境评分详情 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.ink }}>🌊 生存环境评分</h3>
              <span style={{ color: T.faint, fontSize: 11 }}>由访客实地评分汇总</span>
            </div>

            {loading ? (
              <div style={{ color: T.faint, fontSize: 13, padding: "16px 0" }}>加载中…</div>
            ) : observations.length === 0 ? (
              <div style={{ background: T.bg, borderRadius: 8, padding: "20px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>📊</div>
                <div style={{ color: T.body, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>暂无观察记录</div>
                <div style={{ color: T.faint, fontSize: 12 }}>成为第一个提交观察记录的人</div>
              </div>
            ) : (
              <div style={{ background: T.bg, borderRadius: 8, padding: "14px 16px" }}>
                <ScoreRow label="水质 / 水体清洁度" value={avgWater} count={obsWithWater.length} />
                <ScoreRow label="活动空间 / 展池大小" value={avgSpace} count={obsWithSpace.length} />
                <ScoreRow label="个体状态 / 精神面貌" value={avgCond} count={obsWithCond.length} />
                {minCount !== null && (
                  <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: T.body, fontSize: 12.5 }}>目测数量（保守估计）</span>
                    <span style={{ color: T.ink, fontWeight: 700, fontSize: 14 }}>至少 {minCount} 只</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 板块2：现场图片 */}
          {allImages.length > 0 && (
            <div>
              <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: T.ink }}>📷 现场照片</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 6 }}>
                {allImages.slice(0, 9).map((url, i) => (
                  <div key={i} onClick={() => setLightbox(url)}
                    style={{ aspectRatio: "1", borderRadius: 6, overflow: "hidden", cursor: "pointer", background: T.bg, position: "relative" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {i === 8 && allImages.length > 9 && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700 }}>
                        +{allImages.length - 9}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 板块3：提交按钮 */}
          <button onClick={() => setShowObserveModal(true)}
            style={{ background: T.teal, border: "none", borderRadius: 9, padding: "12px 0", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
            📝 提交我的观察记录
          </button>

          {/* 板块4：该园区个体列表 */}
          <div>
            <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: T.ink }}>
              🦭 已录入个体
              <span style={{ color: T.faint, fontSize: 11.5, fontWeight: 400, marginLeft: 8 }}>{facilitySeals.length} 条记录</span>
            </h3>

            {facilitySeals.length === 0 ? (
              <div style={{ background: T.bg, borderRadius: 8, padding: "16px", textAlign: "center" }}>
                <div style={{ color: T.faint, fontSize: 12.5 }}>暂无该园区的个体记录</div>
              </div>
            ) : (
              <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
                {facilitySeals.map((s, i) => (
                  <div key={s.id}
                    onClick={() => onViewSeal && onViewSeal(s)}
                    onMouseEnter={e => { if (onViewSeal) e.currentTarget.style.background = '#F0FDFF'; }}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    style={{ padding: "12px 14px", borderBottom: i < facilitySeals.length - 1 ? `1px solid ${T.bg}` : "none", display: "flex", alignItems: "center", gap: 10, cursor: onViewSeal ? 'pointer' : 'default' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {s.images && Array.isArray(s.images) && s.images[0]?.startsWith("http")
                        ? <img src={s.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 20 }}>🦭</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: T.ink }}>{s.name}</span>
                        <span style={{ fontSize: 10, background: "#E0F2FE", color: T.teal, padding: "1px 6px", borderRadius: 99, fontWeight: 600 }}>{s.status}</span>
                      </div>
                      <div style={{ color: T.muted, fontSize: 11.5, marginTop: 1 }}>
                        {s.sex !== "未知" ? s.sex : "性别未知"}
                        {s.arrived_year ? ` · 入馆 ${s.arrived_year} 年` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 历史观察文字记录 */}
          {observations.filter(o => o.notes).length > 0 && (
            <div>
              <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: T.ink }}>📋 访客观察记录</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {observations.filter(o => o.notes).slice(0, 5).map((o, i) => (
                  <div key={i} style={{ background: T.bg, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ color: T.body, fontSize: 12.5, lineHeight: 1.7 }}>{o.notes}</div>
                    <div style={{ color: T.faint, fontSize: 10.5, marginTop: 5 }}>
                      {new Date(o.created_at).toLocaleDateString("zh-CN")}
                      {o.seal_count > 0 && <span style={{ marginLeft: 8 }}>目测 {o.seal_count} 只</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
