import { useState, useEffect } from "react";
import T from "./utils/tokens";
import { getRole, certify, isCertified, unlockRoot } from "./utils/auth";
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
import FacilityDetail  from "./components/FacilityDetail";
import { supabase }    from "./lib/supabase";

const SEL_STYLE = (active) => ({
  border: `1.5px solid ${active ? T.teal : T.border}`,
  borderRadius: 7, padding: "7px 11px", fontSize: 12.5,
  background: active ? "#F0FDFF" : "white", color: active ? T.teal : T.body,
  cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 600 : 400,
  outline: "none", transition: "all 0.15s",
});

export default function App() {
  const [seals, setSeals]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selected, setSelected]             = useState(null);
  const [view, setView]                     = useState("records");
  const [showQuiz, setShowQuiz]             = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [showDaily, setShowDaily]           = useState(false);
  const [shareSeal, setShareSeal]           = useState(null);
  const [certified, setCertified]           = useState(() => isCertified());
  const [role, setRole]                     = useState(() => getRole());
  const [toast, setToast]                   = useState(null);
  const [search, setSearch]                 = useState("");
  const [filterSex, setFilterSex]           = useState("");
  const [filterStatus, setFilterStatus]     = useState("");
  const [filterProvince, setFilterProvince] = useState("");
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

  // 获取或生成 visitorId
  const getVisitorId = () => {
    let id = localStorage.getItem("sealbase_visitor_id");
    if (!id) {
      id = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("sealbase_visitor_id", id);
    }
    return id;
  };

  // 确认数据（大众核实机制）
  const handleConfirm = async (seal) => {
    const visitorId = getVisitorId();
    const confirmedKey = `confirmed_${seal.id}`;
    if (localStorage.getItem(confirmedKey)) {
      pushToast("你已经确认过这条记录了");
      return;
    }
    const confirmations = (seal.confirmations || 0) + 1;
    const newQuality = confirmations >= 3 ? "已核实（官方报道）" : seal.data_quality;
    const { error } = await supabase
      .from("seals")
      .update({ confirmations, data_quality: newQuality })
      .eq("id", seal.id);
    if (error) { pushToast("✗ 操作失败"); return; }
    localStorage.setItem(confirmedKey, visitorId);
    setSeals(p => p.map(s => s.id === seal.id ? { ...s, confirmations, data_quality: newQuality } : s));
    if (selected?.id === seal.id) setSelected(s => ({ ...s, confirmations, data_quality: newQuality }));
    pushToast(confirmations >= 3 ? "✓ 已达到3人确认，数据升级为「已核实」" : `✓ 已确认（${confirmations}/3 人）`);
  };

  const handleViewSealFromFacility = (seal) => {
    setSelectedFacility(null);
    setView("records");
    setSelected(seal);
  };

  // 省份列表（从数据中动态提取）
  const provinces = [...new Set(seals.map(s => s.province).filter(Boolean))].sort();

  const filtered = seals.filter(s => {
    if (search && !s.name?.includes(search) && !s.facility?.includes(search) && !s.city?.includes(search)) return false;
    if (filterSex && s.sex !== filterSex) return false;
    if (filterStatus && s.status !== filterStatus) return false;
    if (filterProvince && s.province !== filterProvince) return false;
    return true;
  });

  const hasFilters = filterSex || filterStatus || filterProvince;

  const facilities = [...new Set(seals.map(s => s.facility))].map(name => ({
    name, seals: seals.filter(s => s.facility === name),
    steward: seals.find(s => s.facility === name && s.steward)?.steward,
  }));

  const onContribute = () => certified ? setShowContribute(true) : setShowQuiz(true);
  const handleViewDailySeal = (seal) => { setView("records"); setSelected(seal); };

  // 筛选器组件
  const Filters = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
      {["雌", "雄"].map(s => (
        <button key={s} style={SEL_STYLE(filterSex === s)}
          onClick={() => setFilterSex(filterSex === s ? "" : s)}>
          {s === "雌" ? "♀ 雌" : "♂ 雄"}
        </button>
      ))}
      <div style={{ width: 1, background: T.border, margin: "0 2px" }} />
      {["圈养展示", "救助中·待放归", "已放归", "繁育中"].map(s => (
        <button key={s} style={SEL_STYLE(filterStatus === s)}
          onClick={() => setFilterStatus(filterStatus === s ? "" : s)}>
          {s}
        </button>
      ))}
      {provinces.length > 0 && <>
        <div style={{ width: 1, background: T.border, margin: "0 2px" }} />
        <select value={filterProvince} onChange={e => setFilterProvince(e.target.value)}
          style={{ ...SEL_STYLE(!!filterProvince), paddingRight: 24 }}>
          <option value="">全部省份</option>
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </>}
      {hasFilters && (
        <button onClick={() => { setFilterSex(""); setFilterStatus(""); setFilterProvince(""); }}
          style={{ ...SEL_STYLE(false), color: T.muted, fontSize: 11.5 }}>
          × 清除筛选
        </button>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Noto Sans SC','PingFang SC',sans-serif", color: T.ink }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: T.navy, borderRadius: 8, padding: "10px 20px", color: "white", fontSize: 13, zIndex: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {showQuiz && <QuizModal onPass={() => {
        certify();
        setCertified(true);
        setRole(getRole());
        setShowQuiz(false);
        setShowContribute(true);
      }} onClose={() => setShowQuiz(false)} />}
      {showContribute && <ContributeModal onClose={() => setShowContribute(false)} onSubmit={handleSubmit} existingSeals={seals} />}
      {showDaily && <DailyModal seals={seals} onClose={() => setShowDaily(false)} onViewSeal={handleViewDailySeal} />}
      {shareSeal && <ShareModal seal={shareSeal} onClose={() => setShareSeal(null)} isMobile={isMobile} />}

      {isMobile && selected && (
        <SealDetail seal={selected} onClose={() => setSelected(null)} onShare={seal => setShareSeal(seal)} onConfirm={handleConfirm} isDrawer={true} />
      )}

      <Nav view={view} setView={setView} certified={certified} role={role} onContribute={onContribute} onDaily={() => setShowDaily(true)} isMobile={isMobile} />
      <Hero seals={seals} isMobile={isMobile} />
      <StatsStrip seals={seals} facilities={facilities} isMobile={isMobile} />

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "16px 14px 60px" : "28px 24px 60px" }}>
        <div style={{ background: T.amberPale, border: `1px solid #FDE68A`, borderRadius: 8, padding: "10px 14px", marginBottom: isMobile ? 16 : 24, display: "flex", gap: 9 }}>
          <span style={{ color: T.amber, flexShrink: 0 }}>⚠</span>
          <p style={{ margin: 0, color: "#78350F", fontSize: isMobile ? 12 : 12.5, lineHeight: 1.7 }}>
            本数据库处于<strong>冷启动阶段</strong>，目前尚无正式记录。欢迎通过认证后提交第一条斑海豹档案！所有数据仅供参考。
          </p>
        </div>

        {view === "records" && (
          isMobile ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索名称 / 园区 / 城市…"
                  style={{ flex: 1, border: `1.5px solid ${T.border}`, borderRadius: 7, padding: "9px 13px", fontSize: 14, outline: "none", color: T.ink, background: "white", fontFamily: "inherit" }} />
              </div>
              <Filters />
              <div style={{ color: T.faint, fontSize: 11.5, marginBottom: 10 }}>
                共 {filtered.length} 条记录{hasFilters ? "（已筛选）" : ""}，点击查看详情
              </div>
              <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                {loading ? (
                  <div style={{ padding: "48px 24px", textAlign: "center" }}>
                    <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🦭</div>
                    <div style={{ color: T.faint, fontSize: 13 }}>加载中…</div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ padding: "40px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🦭</div>
                    <div style={{ color: T.body, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                      {hasFilters ? "没有符合条件的记录" : "数据库目前没有记录"}
                    </div>
                    <div style={{ color: T.faint, fontSize: 12.5, marginBottom: 20 }}>
                      {hasFilters ? "试试调整筛选条件，或清除筛选查看全部" : "成为第一个贡献者"}
                    </div>
                    {hasFilters ? (
                      <button onClick={() => { setFilterSex(""); setFilterStatus(""); setFilterProvince(""); setSearch(""); }}
                        style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 20px", color: T.body, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                        清除所有筛选
                      </button>
                    ) : (
                      <button onClick={onContribute} style={{ background: T.teal, border: "none", borderRadius: 8, padding: "10px 22px", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        {certified ? "＋ 提交第一条记录" : "通过认证并贡献"}
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    {filtered.map((s, i) => (
                      <div key={s.id}
                        style={{ padding: "14px 16px", borderBottom: i < filtered.length - 1 ? `1px solid ${T.bg}` : "none", display: "flex", alignItems: "center", gap: 12, background: selected?.id === s.id ? "#F0FDFF" : "white" }}>
                        <div onClick={() => setSelected(s)} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, cursor: "pointer", minWidth: 0 }}>
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
                        </div>
                        <button onClick={e => { e.stopPropagation(); setShareSeal(s); }}
                          style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 8px", fontSize: 14, cursor: "pointer", color: T.muted, flexShrink: 0 }}>
                          🪄
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索名称 / 园区 / 城市…"
                    style={{ flex: 1, border: `1.5px solid ${T.border}`, borderRadius: 7, padding: "8px 13px", fontSize: 13, outline: "none", color: T.ink, background: "white", fontFamily: "inherit" }} />
                  <span style={{ color: T.faint, fontSize: 12, whiteSpace: "nowrap" }}>
                    {filtered.length} 条{hasFilters ? "（已筛选）" : ""}
                  </span>
                </div>
                <Filters />
                <div style={{ background: "white", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
                  {loading ? (
                    <div style={{ padding: "56px 24px", textAlign: "center" }}>
                      <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🦭</div>
                      <div style={{ color: T.faint, fontSize: 13 }}>加载中…</div>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div style={{ padding: "56px 24px", textAlign: "center" }}>
                      <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>🦭</div>
                      <div style={{ color: T.body, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                        {hasFilters ? "没有符合条件的记录" : "数据库目前没有记录"}
                      </div>
                      <div style={{ color: T.faint, fontSize: 12.5, marginBottom: 20 }}>
                        {hasFilters ? "试试调整筛选条件，或清除筛选查看全部" : "成为第一个贡献者，为斑海豹建立档案"}
                      </div>
                      {hasFilters ? (
                        <button onClick={() => { setFilterSex(""); setFilterStatus(""); setFilterProvince(""); setSearch(""); }}
                          style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 20px", color: T.body, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                          清除所有筛选
                        </button>
                      ) : (
                        <button onClick={onContribute} style={{ background: T.teal, border: "none", borderRadius: 8, padding: "10px 22px", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          {certified ? "＋ 提交第一条记录" : "通过认证并贡献"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: T.bg, borderBottom: `2px solid ${T.border}` }}>
                          {["个体名称", "性别", "物种", "饲养机构", "状态", "数据质量", ""].map(h => (
                            <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: T.faint, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(s => (
                          <SealRow key={s.id} seal={s}
                            onClick={sel => setSelected(sel === selected ? null : sel)}
                            isSelected={selected?.id === s.id}
                            onShare={() => setShareSeal(s)}
                          />
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              <SealDetail seal={selected} onClose={() => setSelected(null)} onShare={seal => setShareSeal(seal)} onConfirm={handleConfirm} />
            </div>
          )
        )}

        {view === "facilities" && (
          <>
            {selectedFacility && (
              <FacilityDetail
                facility={selectedFacility}
                seals={seals}
                onClose={() => setSelectedFacility(null)}
                onViewSeal={handleViewSealFromFacility}
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
              <p style={{ color: T.body, fontSize: 13.5, lineHeight: 1.85, marginBottom: 14 }}>本数据库是由斑海豹爱好者自发建立的社区项目，专注于记录中国各水族馆、海洋公园及官方救助机构中的圈养斑海豹个体信息。</p>
              <p style={{ color: T.body, fontSize: 13.5, lineHeight: 1.85, marginBottom: 20 }}>项目灵感来源于海外的 Ceta-Base（圈养鲸豚数据库），希望在中文语境下建立类似的鳍足类个体档案资源。所有数据由社区贡献，仅供参考。</p>

              <div style={{ background: "#F0FDFF", border: `1px solid #BAE6FD`, borderRadius: 10, padding: "16px 18px", marginBottom: 22 }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 13.5, color: T.teal, fontWeight: 700 }}>🔍 数据可信吗？</h3>
                <p style={{ margin: "0 0 10px", color: "#0369A1", fontSize: 12.5, lineHeight: 1.8 }}>所有记录按数据质量分为三级：</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    ["✓ 已核实", "#059669", "有3人以上确认，或来自官方报道、机构公告，可信度高"],
                    ["○ 待核实", "#D97706", "由社区成员提交，尚未经过足够数量的交叉确认"],
                    ["! 存疑",   "#EF4444", "信息存在矛盾或来源不明，需谨慎参考"],
                  ].map(([label, color, desc]) => (
                    <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color, fontWeight: 700, fontSize: 12.5, flexShrink: 0, minWidth: 80 }}>{label}</span>
                      <span style={{ color: "#334155", fontSize: 12, lineHeight: 1.6 }}>{desc}</span>
                    </div>
                  ))}
                </div>
                <p style={{ margin: "12px 0 0", color: "#0369A1", fontSize: 12, lineHeight: 1.7 }}>
                  通过认证的用户可以在个体详情页点击「✓ 确认此记录」参与核实，累计 3 人确认后自动升级为「已核实」。
                </p>
              </div>

              <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 22 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 13.5, color: T.ink, fontWeight: 700 }}>👥 谁在维护？</h3>
                <p style={{ margin: 0, color: T.body, fontSize: 12.5, lineHeight: 1.8 }}>
                  本项目由个人开发者发起，目前由斑海豹爱好者社区共同维护。
                  所有贡献者需通过知识认证方可提交数据，数据审核依赖社区多人确认机制。
                  本项目与任何水族馆、海洋公园或官方机构无关。
                </p>
              </div>

              <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 22 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 13.5, color: T.ink, fontWeight: 700 }}>📬 联系我们</h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ color: T.faint, fontSize: 12, width: 52 }}>邮箱</span>
                  <a href="mailto:368496639@qq.com" style={{ color: T.teal, fontSize: 12.5, textDecoration: "none" }}>368496639@qq.com</a>
                </div>
              </div>

              <h3 style={{ margin: "0 0 10px", fontSize: 14, color: T.ink, fontWeight: 700 }}>功能说明</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["🔐 认证题库", "随机抽题，答对即可贡献数据，确保基本数据质量"],
                  ["🔍 智能去重", "提交时检索相似名称，防止重复录入"],
                  ["🖼 图集档案", "每个个体可上传多张照片"],
                  ["📅 历史时间线", "追加个体状态变化、体重记录等"],
                  ["🌊 放归追踪", "救助个体放归后保留档案"],
                  ["🦭 今日一豹", "每天随机推送一只"],
                  ["📊 数据统计", "园区数量、性别比例、状态分布图表"],
                  ["🏛 园区指南", "访客评分、目测数量、现场图片汇总"],
                  ["🪄 分享名片", "4种风格×2种比例，含二维码"],
                  ["✓ 大众核实", "3人确认自动升级为「已核实」"],
                ].map(([t, d]) => (
                  <div key={t} style={{ padding: "10px 14px", background: T.bg, borderRadius: 8 }}>
                    <div style={{ color: T.ink, fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{t}</div>
                    <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6 }}>{d}</div>
                  </div>
                ))}
              </div>

              {/* root 隐藏入口：连续点击版本号 5 次解锁 */}
              <div style={{ marginTop: 32, textAlign: "center" }}>
                <span
                  style={{ color: T.faint, fontSize: 10, cursor: "default", userSelect: "none" }}
                  onClick={(() => {
                    let count = 0;
                    return () => {
                      count++;
                      if (count >= 5) {
                        count = 0;
                        const pwd = prompt("🔐 管理员密码");
                        if (pwd === import.meta.env.VITE_ROOT_PASSWORD) {
                          unlockRoot();
                          setRole("root");
                          alert("✓ 已解锁管理员模式");
                        } else if (pwd !== null) {
                          alert("密码错误");
                        }
                      }
                    };
                  })()}
                >
                  v0.1.0-beta
                </span>
              </div>
            </div>
            {!isMobile && <SpeciesPanel />}
          </div>
        )}
      </main>

      <footer style={{ background: T.navy, padding: isMobile ? "18px 20px" : "22px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🦭</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: isMobile ? 11 : 12 }}>中国圈养斑海豹档案库 · 社区自发维护</span>
        </div>
        {!isMobile && <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 11.5 }}>Phoca largha Captive Registry · 数据仅供参考</span>}
      </footer>
    </div>
  );
}
