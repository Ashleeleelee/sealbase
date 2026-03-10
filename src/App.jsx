import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import T from "./utils/tokens";
import Nav             from "./components/Nav";
import Hero            from "./components/Hero";
import StatsStrip      from "./components/StatsStrip";
import SealDetail      from "./components/SealDetail";
import SealRow         from "./components/SealRow";
import SealCard        from "./components/SealCard";
import SealDrawer      from "./components/SealDrawer";
import SupplementModal from "./components/SupplementModal";
import QuizModal       from "./components/QuizModal";
import ContributeModal from "./components/ContributeModal";
import SpeciesPanel    from "./components/SpeciesPanel";

export default function App() {
  const [seals, setSeals]                   = useState([]);
  const [selected, setSelected]             = useState(null);
  const [view, setView]                     = useState("records");
  const [showQuiz, setShowQuiz]             = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [certified, setCertified]           = useState(false);
  const [toast, setToast]                   = useState(null);
  const [search, setSearch]                 = useState("");
  const [supplementSeal, setSupplementSeal] = useState(null);

  const pushToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const handleSubmit = async (record) => {
    const { error } = await supabase.from("seals").insert([record]);
    if (error) { console.error("提交失败:", error); pushToast("❌ 提交失败，请重试"); }
    else { await fetchSeals(); pushToast("✓ 记录已提交，感谢贡献。"); }
  };


  useEffect(() => { fetchSeals(); }, []);

  const fetchSeals = async () => {
    const { data, error } = await supabase.from("seals").select("*").order("created_at", { ascending: false });
    if (error) console.error("读取失败:", error);
    else setSeals(data);
  };

  const filtered = seals.filter(s => !search || s.name?.includes(search) || s.facility?.includes(search) || s.city?.includes(search));
  const facilities = [...new Set(seals.map(s => s.facility))].map(name => ({
    name,
    seals: seals.filter(s => s.facility === name),
    steward: seals.find(s => s.facility === name && s.steward)?.steward,
  }));
  const onContribute = () => certified ? setShowContribute(true) : setShowQuiz(true);

  // 手机端：点击卡片打开抽屉，关闭后可打开SupplementModal
  const handleCardTap = seal => setSelected(seal);
  const handleSupplement = seal => { setSelected(null); setTimeout(() => setSupplementSeal(seal), 150); };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Noto Sans SC','PingFang SC',sans-serif", color: T.ink }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: T.navy, borderRadius: 8, padding: "10px 20px", color: "white", fontSize: 13, zIndex: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {showQuiz && <QuizModal onPass={() => { setCertified(true); setShowQuiz(false); setShowContribute(true); }} onClose={() => setShowQuiz(false)} />}
      {showContribute && <ContributeModal onClose={() => setShowContribute(false)} onSubmit={handleSubmit} existingSeals={seals} />}

      <Nav view={view} setView={setView} certified={certified} onContribute={onContribute} />
      <Hero seals={seals} />
      <StatsStrip seals={seals} facilities={facilities} />

      {/* ── 冷启动提示 ── */}
      <div className="main-container">
        <div style={{ background: T.amberPale, border: `1px solid #FDE68A`, borderRadius: 8, padding: "10px 14px", marginBottom: 24, display: "flex", gap: 9 }}>
          <span style={{ color: T.amber, flexShrink: 0 }}>⚠</span>
          <p style={{ margin: 0, color: "#78350F", fontSize: 12.5, lineHeight: 1.7 }}>
            本数据库处于<strong>冷启动阶段</strong>，目前尚无正式记录。欢迎通过认证后提交第一条斑海豹档案！所有数据仅供参考，非官方来源。
          </p>
        </div>

        {/* ══ 个体记录 ══ */}
        {view === "records" && (
          <>
            {/* 桌面端：表格 + 侧边详情 */}
            <div className="records-desktop">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索名称 / 园区 / 城市…"
                      style={{ flex: 1, border: `1.5px solid ${T.border}`, borderRadius: 7, padding: "8px 13px", fontSize: 13, outline: "none", color: T.ink, background: "white", fontFamily: "inherit" }} />
                    <span style={{ color: T.faint, fontSize: 12, whiteSpace: "nowrap" }}>共 {filtered.length} 条记录</span>
                  </div>
                  <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                    {filtered.length === 0 ? (
                      <div style={{ padding: "56px 24px", textAlign: "center" }}>
                        <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🦭</div>
                        <div style={{ color: T.body, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>数据库目前没有记录</div>
                        <div style={{ color: T.faint, fontSize: 12.5, marginBottom: 20 }}>成为第一个贡献者，为斑海豹建立档案</div>
                        <button onClick={onContribute} style={{ background: T.teal, border: "none", borderRadius: 8, padding: "10px 22px", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          {certified ? "＋ 提交第一条记录" : "通过认证并贡献"}
                        </button>
                      </div>
                    ) : (
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: T.bg, borderBottom: `2px solid ${T.border}` }}>
                            {["个体名称", "性别", "物种", "饲养机构", "状态", "数据质量"].map(h => (
                              <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: T.faint, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(s => (
                            <SealRow key={s.id} seal={s} onClick={sel => setSelected(sel === selected ? null : sel)} isSelected={selected?.id === s.id} />
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <SealDetail seal={selected} onClose={() => setSelected(null)} />
              </div>
            </div>

            {/* 手机端：卡片列表 */}
            <div className="records-mobile">
              <div style={{ position: "relative", marginBottom: 12 }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索名称 / 园区 / 城市…"
                  style={{ width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px 10px 38px", fontSize: 13.5, outline: "none", color: T.ink, background: "white", fontFamily: "inherit", boxSizing: "border-box" }} />
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.faint, fontSize: 15 }}>🔍</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <span style={{ color: T.faint, fontSize: 12 }}>共 {filtered.length} 条记录</span>
              </div>
              <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                {filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "52px 24px" }}>
                    <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.2 }}>🦭</div>
                    <div style={{ color: T.body, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>数据库目前没有记录</div>
                    <div style={{ color: T.faint, fontSize: 12.5, marginBottom: 20 }}>成为第一个贡献者，为斑海豹建立档案</div>
                    <button onClick={onContribute} style={{ background: T.teal, border: "none", borderRadius: 8, padding: "11px 24px", color: "white", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      通过认证并贡献
                    </button>
                  </div>
                ) : filtered.map(s => <SealCard key={s.id} seal={s} onTap={handleCardTap} />)}
              </div>
            </div>
          </>
        )}

        {/* ══ 饲养机构 ══ */}
        {view === "facilities" && (
          facilities.length === 0 ? (
            <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🏛</div>
              <div style={{ color: T.body, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>暂无园区记录</div>
              <div style={{ color: T.faint, fontSize: 12.5 }}>提交个体记录后，园区信息将自动汇总显示</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {facilities.map(f => (
                <div key={f.name} style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.ink, fontFamily: "'Noto Serif SC',serif" }}>{f.name}</h3>
                    {f.steward && <span style={{ background: "#EFF6FF", color: "#1D4ED8", fontSize: 10.5, padding: "2px 8px", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap", marginLeft: 8 }}>📋 {f.steward}</span>}
                  </div>
                  <div style={{ color: T.faint, fontSize: 11.5, marginBottom: 10 }}>
                    {f.seals[0]?.province && f.seals[0]?.city ? `${f.seals[0].province} · ${f.seals[0].city}` : "—"}
                  </div>
                  <div style={{ borderTop: `1px solid ${T.bg}`, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: T.faint, fontSize: 11.5 }}>记录个体</span>
                    <span style={{ color: T.teal, fontSize: 13, fontWeight: 700 }}>{f.seals.length} 条</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ══ 关于项目 ══ */}
        {view === "about" && (
          <>
            {/* 桌面端：双栏 */}
            <div className="about-desktop">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
                <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: "28px 30px" }}>
                  <h2 style={{ margin: "0 0 16px", fontFamily: "'Noto Serif SC',serif", fontSize: 18, color: T.ink }}>关于本项目</h2>
                  <p style={{ color: T.body, fontSize: 13.5, lineHeight: 1.85, marginBottom: 14 }}>本数据库是由斑海豹爱好者自发建立的非官方项目，专注于记录中国各水族馆、海洋公园及官方救助机构中的圈养斑海豹个体信息。</p>
                  <p style={{ color: T.body, fontSize: 13.5, lineHeight: 1.85, marginBottom: 20 }}>项目灵感来源于海外的 Ceta-Base（圈养鲸豚数据库），希望在中文语境下建立类似的鳍足类个体档案资源。</p>
                  <h3 style={{ margin: "0 0 10px", fontSize: 14, color: T.ink, fontWeight: 700 }}>功能说明</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ["🔐 认证题库", "15道题随机抽3题，答对2题通过，每次题目不同"],
                      ["🔍 智能去重", "提交时检索相似名称，防止同一个体被重复录入"],
                      ["🖼 图集档案", "每个个体可上传多张照片，支持图集展示"],
                      ["📅 历史时间线", "可追加个体状态变化、体重记录等，保留动态历史"],
                      ["🌊 放归追踪", "救助个体放归后保留档案，记录时间与地点"],
                      ["📋 园区认领", "志愿者可认领园区，成为数据负责人，提升可信度"],
                    ].map(([t, d]) => (
                      <div key={t} style={{ padding: "10px 14px", background: T.bg, borderRadius: 8 }}>
                        <div style={{ color: T.ink, fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{t}</div>
                        <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6 }}>{d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <SpeciesPanel />
              </div>
            </div>

            {/* 手机端：单栏堆叠 */}
            <div className="about-mobile" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 18px" }}>
                <h2 style={{ margin: "0 0 12px", fontFamily: "'Noto Serif SC',serif", fontSize: 16, color: T.ink }}>关于本项目</h2>
                <p style={{ color: T.body, fontSize: 13, lineHeight: 1.85, marginBottom: 12 }}>本数据库是由斑海豹爱好者自发建立的非官方项目，专注于记录中国各水族馆、海洋公园及官方救助机构中的圈养斑海豹个体信息。</p>
                <p style={{ color: T.body, fontSize: 13, lineHeight: 1.85 }}>项目灵感来源于海外的 Ceta-Base（圈养鲸豚数据库），希望在中文语境下建立类似的鳍足类个体档案资源。</p>
              </div>
              <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px 18px" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 14, color: T.ink, fontWeight: 700 }}>功能说明</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    ["🔐 认证题库", "15道题随机抽3题，答对2题通过，每次题目不同"],
                    ["🔍 智能去重", "提交时检索相似名称，防止同一个体被重复录入"],
                    ["🖼 图集档案", "每个个体可上传多张照片，支持图集展示"],
                    ["📅 历史时间线", "可追加个体状态变化、体重记录等，保留动态历史"],
                    ["🌊 放归追踪", "救助个体放归后保留档案，记录时间与地点"],
                    ["📋 园区认领", "志愿者可认领园区，成为数据负责人，提升可信度"],
                  ].map(([t, d]) => (
                    <div key={t} style={{ padding: "10px 12px", background: T.bg, borderRadius: 8 }}>
                      <div style={{ color: T.ink, fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>{t}</div>
                      <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6 }}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <SpeciesPanel />
            </div>
          </>
        )}
      </div>

      {/* ── Footer（仅桌面可见） ── */}
      <footer className="footer-desktop" style={{ background: T.navy, padding: "22px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🦭</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>中国圈养斑海豹档案库 · 社区自发维护 · 非官方</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 11.5 }}>Phoca largha Captive Registry · 数据仅供参考</span>
      </footer>

      {/* ── 手机端底部固定贡献按钮 ── */}
      <div className="fab-mobile" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "white", borderTop: `1px solid ${T.border}`,
        padding: "10px 14px 20px",
      }}>
        <button onClick={onContribute} style={{
          background: T.teal, border: "none", borderRadius: 10, padding: "13px 0",
          color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
          fontFamily: "inherit", width: "100%",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <span>🦭</span> {certified ? "+ 提交记录" : "贡献数据"}
        </button>
      </div>

      {/* ── 手机端抽屉 & 弹窗 ── */}
      {selected && (
        <SealDrawer
          seal={selected}
          onClose={() => setSelected(null)}
          onSupplement={handleSupplement}
        />
      )}
      {supplementSeal && (
        <SupplementModal
          seal={supplementSeal}
          onClose={() => setSupplementSeal(null)}
          onSubmit={handleSupplementSubmit}
        />
      )}

      <style>{`
        .main-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 28px 24px 100px;
        }
        .records-mobile, .about-mobile, .fab-mobile { display: none; }
        .records-desktop, .about-desktop, .footer-desktop { display: block; }
        @media (max-width: 768px) {
          .main-container { padding: 16px 14px 100px; }
          .records-desktop, .about-desktop, .footer-desktop { display: none !important; }
          .records-mobile, .about-mobile, .fab-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}
