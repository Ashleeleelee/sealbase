import { useState, useEffect } from "react";
import T from "./utils/tokens";
import Nav             from "./components/Nav";
import Hero            from "./components/Hero";
import StatsStrip      from "./components/StatsStrip";
import SealDetail      from "./components/SealDetail";
import SealRow         from "./components/SealRow";
import QuizModal       from "./components/QuizModal";
import ContributeModal from "./components/ContributeModal";
import SpeciesPanel    from "./components/SpeciesPanel";
import DailyModal      from "./components/DailyModal";
import StatsCharts     from "./components/StatsCharts";
import ShareModal      from "./components/ShareModal";
import { supabase }    from "./lib/supabase";
import FacilityDetail from "./components/FacilityDetail";

export default function App() {
  const [seals, setSeals]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selected, setSelected]             = useState(null);
  const [view, setView]                     = useState("records");
  const [showQuiz, setShowQuiz]             = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [showDaily, setShowDaily]           = useState(false);
  const [shareSeal, setShareSeal]           = useState(null);
  const [certified, setCertified]           = useState(false);
  const [toast, setToast]                   = useState(null);
  const [search, setSearch]                 = useState("");
  const [isMobile, setIsMobile]             = useState(() => window.innerWidth < 768);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    fetchSeals();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSeals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("seals").select("*").order("id", { ascending: false });
    if (error) console.error("拉取数据失败:", error);
    else setSeals(data || []);
    setLoading(false);
  };

  const pushToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const handleSubmit = async (record) => {
    const { data, error } = await supabase
      .from("seals").insert([record]).select().single();
    if (error) {
      console.error("提交失败:", error);
      pushToast("✗ 提交失败，请稍后重试。");
    } else {
      setSeals(p => [data, ...p]);
      pushToast("✓ 记录已提交，感谢贡献。");
    }
  };

  const filtered = seals.filter(s => !search || s.name?.includes(search) || s.facility?.includes(search) || s.city?.includes(search));
  const facilities = [...new Set(seals.map(s => s.facility))].map(name => ({
    name, seals: seals.filter(s => s.facility === name),
    steward: seals.find(s => s.facility === name && s.steward)?.steward,
  }));
  const onContribute = () => certified ? setShowContribute(true) : setShowQuiz(true);
  const handleViewDailySeal = (seal) => { setView("records"); setSelected(seal); };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Noto Sans SC','PingFang SC',sans-serif", color: T.ink }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: T.navy, borderRadius: 8, padding: "10px 20px", color: "white", fontSize: 13, zIndex: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {showQuiz && <QuizModal onPass={() => { setCertified(true); setShowQuiz(false); setShowContribute(true); }} onClose={() => setShowQuiz(false)} />}
      {showContribute && <ContributeModal onClose={() => setShowContribute(false)} onSubmit={handleSubmit} existingSeals={seals} />}
      {showDaily && <DailyModal seals={seals} onClose={() => setShowDaily(false)} onViewSeal={handleViewDailySeal} />}
      {shareSeal && <ShareModal seal={shareSeal} onClose={() => setShareSeal(null)} isMobile={isMobile} />}

      {isMobile && selected && (
        <SealDetail seal={selected} onClose={() => setSelected(null)} onShare={seal => setShareSeal(seal)} isDrawer={true} />
      )}

      <Nav view={view} setView={setView} certified={certified} onContribute={onContribute} onDaily={() => setShowDaily(true)} isMobile={isMobile} />
      <Hero seals={seals} isMobile={isMobile} />
      <StatsStrip seals={seals} facilities={facilities} isMobile={isMobile} />

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "16px 14px 60px" : "28px 24px 60px" }}>
        <div style={{ background: T.amberPale, border: `1px solid #FDE68A`, borderRadius: 8, padding: "10px 14px", marginBottom: isMobile ? 16 : 24, display: "flex", gap: 9 }}>
          <span style={{ color: T.amber, flexShrink: 0 }}>⚠</span>
          <p style={{ margin: 0, color: "#78350F", fontSize: isMobile ? 12 : 12.5, lineHeight: 1.7 }}>
            本数据库处于<strong>冷启动阶段</strong>，目前尚无正式记录。欢迎通过认证后提交第一条斑海豹档案！所有数据仅供参考，非官方来源。
          </p>
        </div>

        {view === "records" && (
          isMobile ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索名称 / 园区 / 城市…"
                  style={{ flex: 1, border: `1.5px solid ${T.border}`, borderRadius: 7, padding: "9px 13px", fontSize: 14, outline: "none", color: T.ink, background: "white", fontFamily: "inherit" }} />
              </div>
              <div style={{ color: T.faint, fontSize: 11.5, marginBottom: 10 }}>共 {filtered.length} 条记录，点击查看详情</div>
              <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                {loading ? (
                  <div style={{ padding: "48px 24px", textAlign: "center" }}>
                    <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🦭</div>
                    <div style={{ color: T.faint, fontSize: 13 }}>加载中…</div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ padding: "48px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🦭</div>
                    <div style={{ color: T.body, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>数据库目前没有记录</div>
                    <div style={{ color: T.faint, fontSize: 12.5, marginBottom: 20 }}>成为第一个贡献者</div>
                    <button onClick={onContribute} style={{ background: T.teal, border: "none", borderRadius: 8, padding: "10px 22px", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      {certified ? "＋ 提交第一条记录" : "通过认证并贡献"}
                    </button>
                  </div>
                ) : (
                  <div>
                    {filtered.map((s, i) => (
                      <div key={s.id} onClick={() => setSelected(s)}
                        style={{ padding: "14px 16px", borderBottom: i < filtered.length - 1 ? `1px solid ${T.bg}` : "none", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: selected?.id === s.id ? "#F0FDFF" : "white" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {s.images && Array.isArray(s.images) && s.images[0]?.startsWith("http")
                            ? <img src={s.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <span style={{ fontSize: 22 }}>🦭</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: T.ink }}>{s.name}</span>
                            <span style={{ fontSize: 10, background: "#E0F2FE", color: T.teal, padding: "1px 7px", borderRadius: 99, fontWeight: 600, flexShrink: 0 }}>{s.status}</span>
                          </div>
                          <div style={{ color: T.muted, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {s.facility}{s.city ? ` · ${s.city}` : ""}
                          </div>
                        </div>
                        <span style={{ color: T.faint, fontSize: 18 }}>›</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索名称 / 园区 / 城市…"
                    style={{ flex: 1, border: `1.5px solid ${T.border}`, borderRadius: 7, padding: "8px 13px", fontSize: 13, outline: "none", color: T.ink, background: "white", fontFamily: "inherit" }} />
                  <span style={{ color: T.faint, fontSize: 12, whiteSpace: "nowrap" }}>共 {filtered.length} 条记录</span>
                </div>
                <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                  {loading ? (
                    <div style={{ padding: "56px 24px", textAlign: "center" }}>
                      <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🦭</div>
                      <div style={{ color: T.faint, fontSize: 13 }}>加载中…</div>
                    </div>
                  ) : filtered.length === 0 ? (
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
              <SealDetail seal={selected} onClose={() => setSelected(null)} onShare={seal => setShareSeal(seal)} />
            </div>
          )
        )}

view === "facilities" && (
  <>
    {selectedFacility && (
      <FacilityDetail
        facility={selectedFacility}
        seals={seals}
        onClose={() => setSelectedFacility(null)}
        isMobile={isMobile}
      />
    )}

    {facilities.length === 0 ? (
      <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: 48, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🏛</div>
        <div style={{ color: T.body, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>暂无园区记录</div>
        <div style={{ color: T.faint, fontSize: 12.5 }}>提交个体记录后，园区信息将自动汇总显示</div>
      </div>
    ) : (
      <>
        <StatsCharts seals={seals} isMobile={isMobile} />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
          {facilities.map(f => (
            <div key={f.name}
              onClick={() => setSelectedFacility(f)}
              style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: 18, cursor: "pointer", transition: "box-shadow 0.15s, border-color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(8,145,178,0.12)"; e.currentTarget.style.borderColor = T.teal; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = T.border; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.ink, fontFamily: "'Noto Serif SC',serif" }}>{f.name}</h3>
                <span style={{ color: T.teal, fontSize: 13, flexShrink: 0, marginLeft: 8 }}>›</span>
              </div>
              <div style={{ color: T.faint, fontSize: 11.5, marginBottom: 10 }}>
                {f.seals[0]?.province && f.seals[0]?.city ? `${f.seals[0].province} · ${f.seals[0].city}` : "—"}
              </div>
              <div style={{ borderTop: `1px solid ${T.bg}`, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: T.faint, fontSize: 11.5 }}>记录个体</span>
                <span style={{ color: T.teal, fontSize: 13, fontWeight: 700 }}>{f.seals.length} 条</span>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </>
)}

        {view === "about" && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 280px", gap: 20, alignItems: "start" }}>
            <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 30px" }}>
              <h2 style={{ margin: "0 0 16px", fontFamily: "'Noto Serif SC',serif", fontSize: 18, color: T.ink }}>关于本项目</h2>
              <p style={{ color: T.body, fontSize: 13.5, lineHeight: 1.85, marginBottom: 14 }}>本数据库是由斑海豹爱好者自发建立的非官方项目，专注于记录中国各水族馆、海洋公园及官方救助机构中的圈养斑海豹个体信息。</p>
              <p style={{ color: T.body, fontSize: 13.5, lineHeight: 1.85, marginBottom: 20 }}>项目灵感来源于海外的 Ceta-Base（圈养鲸豚数据库），希望在中文语境下建立类似的鳍足类个体档案资源。</p>
              <h3 style={{ margin: "0 0 10px", fontSize: 14, color: T.ink, fontWeight: 700 }}>功能说明</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["🔐 认证题库", "50道题随机抽3题，答对2题通过"],
                  ["🔍 智能去重", "提交时检索相似名称，防止重复录入"],
                  ["🖼 图集档案", "每个个体可上传多张照片"],
                  ["📅 历史时间线", "追加个体状态变化、体重记录等"],
                  ["🌊 放归追踪", "救助个体放归后保留档案"],
                  ["🦭 今日一豹", "每天随机推送一只"],
                  ["📊 数据统计", "园区数量、性别比例、状态分布图表"],
                  ["🪄 分享名片", "4种风格×2种比例，含二维码"],
                ].map(([t, d]) => (
                  <div key={t} style={{ padding: "10px 14px", background: T.bg, borderRadius: 8 }}>
                    <div style={{ color: T.ink, fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{t}</div>
                    <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
            {!isMobile && <SpeciesPanel />}
          </div>
        )}
      </main>

      <footer style={{ background: T.navy, padding: isMobile ? "18px 20px" : "22px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🦭</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: isMobile ? 11 : 12 }}>中国圈养斑海豹档案库 · 社区自发维护 · 非官方</span>
        </div>
        {!isMobile && <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 11.5 }}>Phoca largha Captive Registry · 数据仅供参考</span>}
      </footer>
    </div>
  );
}

