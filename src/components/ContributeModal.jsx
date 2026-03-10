import { useState, useRef } from "react";
import T from "../utils/tokens";

// 省份 → 城市映射（仅收录有水族馆/海洋公园/救助机构的真实城市）
const PROVINCE_CITY_MAP = {
  "辽宁": ["大连", "沈阳", "营口", "盘锦", "葫芦岛", "其他"],
  "黑龙江": ["哈尔滨", "其他"],
  "吉林": ["长春", "其他"],
  "北京": ["北京"],
  "天津": ["天津"],
  "河北": ["石家庄", "秦皇岛", "唐山", "其他"],
  "山东": ["青岛", "济南", "烟台", "威海", "日照", "其他"],
  "上海": ["上海"],
  "江苏": ["南京", "苏州", "南通", "连云港", "其他"],
  "浙江": ["杭州", "宁波", "温州", "舟山", "其他"],
  "福建": ["福州", "厦门", "其他"],
  "广东": ["广州", "深圳", "珠海", "其他"],
  "海南": ["三亚", "海口", "其他"],
  "重庆": ["重庆"],
  "四川": ["成都", "其他"],
  "陕西": ["西安", "其他"],
  "湖北": ["武汉", "其他"],
  "湖南": ["长沙", "其他"],
  "河南": ["郑州", "其他"],
  "新疆": ["乌鲁木齐", "其他"],
  "内蒙古": ["呼和浩特", "其他"],
  "其他省份": ["其他"],
};

const PROVINCES = Object.keys(PROVINCE_CITY_MAP);

export default function ContributeModal({ onClose, onSubmit, existingSeals }) {
  const [form, setForm] = useState({
    name: "", facility: "", city: "", province: "",
    sex: "未知", status: "圈养展示", source: "",
    arrivedYear: "", notes: "", releaseDate: "",
    releaseLocation: "", steward: "", sourceRef: ""
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [dupWarn, setDupWarn] = useState(null);
  const imgRef = useRef();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onProvinceChange = (v) => {
    set("province", v);
    set("city", "");
  };

  const availableCities = form.province ? PROVINCE_CITY_MAP[form.province] || [] : [];

  const onNameChange = (v) => {
    set("name", v);
    if (!v) { setSuggestions([]); setDupWarn(null); return; }
    const hits = existingSeals.filter(s => s.name.includes(v) || v.includes(s.name));
    setSuggestions(hits);
    setShowSug(hits.length > 0);
    setDupWarn(existingSeals.find(s => s.name === v) || null);
  };

  const inp = {
    width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 7,
    padding: "9px 12px", color: T.ink, fontSize: 13, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", background: "white"
  };
  const inpDisabled = { ...inp, background: T.bg, color: T.faint, cursor: "not-allowed" };
  const lbl = { color: T.body, fontSize: 11.5, display: "block", marginBottom: 5, fontWeight: 600 };
  const ok = form.name && form.facility && form.sourceRef;

  const handleSubmit = () => {
    if (!ok) return;
    onSubmit({
      name: form.name, sex: form.sex, facility: form.facility,
      city: form.city, province: form.province, status: form.status,
      source: form.source, arrived_year: form.arrivedYear, notes: form.notes,
      release_date: form.releaseDate, release_location: form.releaseLocation,
      source_ref: form.sourceRef, data_quality: "待核实",
    });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.5)", backdropFilter: "blur(6px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}>
      <div style={{ background: "white", borderRadius: 14, padding: 32, maxWidth: 540, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, color: T.ink, fontFamily: "'Noto Serif SC',serif" }}>提交个体记录</h3>
            <p style={{ margin: 0, color: T.muted, fontSize: 12 }}>所有字段应有据可查，标 * 为必填项</p>
          </div>
          <button onClick={onClose} style={{ background: T.bg, border: "none", color: T.muted, width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 15 }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* 名称 + 去重 */}
          <div style={{ position: "relative" }}>
            <label style={lbl}>个体名称 / 编号 *</label>
            <input value={form.name} onChange={e => onNameChange(e.target.value)} onBlur={() => setTimeout(() => setShowSug(false), 160)} onFocus={() => suggestions.length && setShowSug(true)} placeholder="中文名 / 编号，如：豹竹、圣亚#A" style={inp} />
            {showSug && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: `1px solid ${T.border}`, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 10, marginTop: 4, overflow: "hidden" }}>
                <div style={{ padding: "6px 12px", background: T.amberPale, borderBottom: `1px solid #FDE68A` }}>
                  <span style={{ color: T.amber, fontSize: 11.5, fontWeight: 600 }}>⚠ 发现相似记录，请确认是否为同一个体</span>
                </div>
                {suggestions.map(s => (
                  <div key={s.id} onClick={() => { set("name", s.name); setShowSug(false); }}
                    style={{ padding: "10px 14px", cursor: "pointer", borderBottom: `1px solid ${T.bg}`, display: "flex", justifyContent: "space-between" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <div>
                      <span style={{ color: T.ink, fontWeight: 600, fontSize: 13 }}>{s.name}</span>
                      <span style={{ color: T.muted, fontSize: 11.5, marginLeft: 8 }}>{s.facility} · {s.status}</span>
                    </div>
                    <span style={{ color: T.teal, fontSize: 11 }}>选用</span>
                  </div>
                ))}
              </div>
            )}
            {dupWarn && (
              <div style={{ marginTop: 6, background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 6, padding: "8px 12px" }}>
                <span style={{ color: "#B91C1C", fontSize: 11.5, fontWeight: 600 }}>「{dupWarn.name}」已存在于数据库（{dupWarn.facility}）。如确为同一个体，请改为补充已有记录，避免重复。</span>
              </div>
            )}
          </div>

          {/* 所在园区 */}
          <div>
            <label style={lbl}>所在园区 *</label>
            <input value={form.facility} onChange={e => set("facility", e.target.value)} placeholder="机构全名，如：大连圣亚海洋世界" style={inp} />
          </div>

          {/* 省份 → 城市 联动 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={lbl}>省份 / 直辖市</label>
              <select value={form.province} onChange={e => onProvinceChange(e.target.value)} style={inp}>
                <option value="">请选择省份…</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ ...lbl, color: form.province ? T.body : T.faint }}>城市</label>
              <select value={form.city} onChange={e => set("city", e.target.value)} disabled={!form.province} style={form.province ? inp : inpDisabled}>
                <option value="">{form.province ? "请选择城市…" : "请先选择省份"}</option>
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {form.province && (
                <div style={{ color: T.faint, fontSize: 10.5, marginTop: 3 }}>仅列出已知有相关机构的城市</div>
              )}
            </div>
          </div>

          {/* 性别 + 状态 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={lbl}>性别</label>
              <select value={form.sex} onChange={e => set("sex", e.target.value)} style={inp}>
                {["雌", "雄", "未知"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>当前状态</label>
              <select value={form.status} onChange={e => set("status", e.target.value)} style={inp}>
                {["圈养展示", "救助中·待放归", "已放归", "繁育中"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* 放归字段 */}
          {form.status === "已放归" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: T.greenPale, padding: 12, borderRadius: 8, border: `1px solid #6EE7B060` }}>
              <div><label style={{ ...lbl, color: T.green }}>放归时间</label><input value={form.releaseDate} onChange={e => set("releaseDate", e.target.value)} placeholder="如：2025-04-16" style={inp} /></div>
              <div><label style={{ ...lbl, color: T.green }}>放归地点</label><input value={form.releaseLocation} onChange={e => set("releaseLocation", e.target.value)} placeholder="如：辽东湾" style={inp} /></div>
            </div>
          )}

          {/* 来源 + 入馆年份 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label style={lbl}>个体来源</label><input value={form.source} onChange={e => set("source", e.target.value)} placeholder="野外救助 / 人工繁育…" style={inp} /></div>
            <div><label style={lbl}>入馆年份</label><input value={form.arrivedYear} onChange={e => set("arrivedYear", e.target.value)} placeholder="如：2021" style={inp} /></div>
          </div>

          {/* 图片上传 */}
          <div>
            <label style={lbl}>上传图片（可多张）</label>
            <div onClick={() => imgRef.current && imgRef.current.click()}
              style={{ border: `1.5px dashed ${T.border}`, borderRadius: 8, padding: 16, textAlign: "center", cursor: "pointer", background: T.bg }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.teal}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
              <div style={{ color: T.muted, fontSize: 13 }}>点击上传图片</div>
              <div style={{ color: T.faint, fontSize: 11, marginTop: 3 }}>支持 JPG、PNG，建议每张不超过 5MB（图片存储功能开发中）</div>
              <input ref={imgRef} type="file" accept="image/*" multiple onChange={() => {}} style={{ display: "none" }} />
            </div>
          </div>

          {/* 备注 */}
          <div>
            <label style={lbl}>备注 / 说明</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3} placeholder="个体特征、外貌、已知历史等…" style={{ ...inp, resize: "vertical" }} />
          </div>

          {/* 数据来源 */}
          <div>
            <label style={{ ...lbl, display: "flex", gap: 8, alignItems: "center" }}>
              数据来源 *
              <span style={{ background: T.amberPale, color: T.amber, fontSize: 10.5, padding: "1px 8px", borderRadius: 99, fontWeight: 700 }}>必填</span>
            </label>
            <input value={form.sourceRef} onChange={e => set("sourceRef", e.target.value)} placeholder="官网链接 / 新闻报道标题 / 现场观察日期…" style={inp} />
            <div style={{ color: T.faint, fontSize: 11, marginTop: 4 }}>无可核实来源的记录将被标注为「存疑」</div>
          </div>

          {/* 提交按钮 */}
          <button onClick={handleSubmit}
            style={{ background: ok ? T.teal : "#BAE6FD", border: "none", borderRadius: 8, padding: 13, color: "white", fontSize: 14, fontWeight: 700, cursor: ok ? "pointer" : "default", fontFamily: "inherit", marginTop: 4 }}>
            提交审核
          </button>
        </div>
      </div>
    </div>
  );
}