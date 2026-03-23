import { useState, useRef } from "react";
import T from "../utils/tokens";
import { supabase } from "../lib/supabase";

export default function SupplementModal({ seal, onClose, onSubmit }) {
  const isLocked = seal.data_quality === "已核实（官方报道）";
  const [tab, setTab] = useState("health");
  const [eventDate, setEventDate] = useState("");
  const [eventText, setEventText] = useState("");
  const [comment, setComment] = useState("");
  const [dispute, setDispute] = useState("");
  const [weight, setWeight] = useState("");
  const [condition, setCondition] = useState("");
  const [healthDate, setHealthDate] = useState("");
  const [healthNote, setHealthNote] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [toFacility, setToFacility] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef();

  const inp = {
    width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 8,
    padding: "10px 12px", fontSize: 13.5, outline: "none", color: T.ink,
    background: "white", fontFamily: "inherit", boxSizing: "border-box",
  };
  const lbl = { display: "block", color: T.muted, fontSize: 12, fontWeight: 600, marginBottom: 5 };

  const onImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImagePreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const uploadImages = async () => {
    if (!imageFiles.length) return [];
    const urls = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("seal-images").upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) continue;
      const { data } = supabase.storage.from("seal-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async () => {
    setUploading(true);
    const imageUrls = await uploadImages();
    const updates = { ...seal };
    const newEntries = [];

    // 体重/体况
    if (weight || condition || healthNote) {
      const parts = [];
      if (weight) parts.push(`体重 ${weight}kg`);
      if (condition) parts.push(`体况：${condition}`);
      if (healthNote) parts.push(healthNote);
      newEntries.push({
        date: healthDate || new Date().toISOString().slice(0, 7),
        text: parts.join("，"),
      });
    }

    // 时间线动态
    if (eventDate && eventText) {
      newEntries.push({ date: eventDate, text: eventText });
    }

    // 园区变更
    if (toFacility) {
      newEntries.push({
        type: "transfer",
        date: transferDate || new Date().toISOString().slice(0, 7),
        fromFacility: seal.facility,
        toFacility,
        text: transferNote,
      });
    }

    // 持久化到 Supabase
    const dbUpdates = {};
    if (newEntries.length) {
      dbUpdates.timeline = [...(seal.timeline || []), ...newEntries];
      updates.timeline = dbUpdates.timeline;
    }
    if (weight) {
      dbUpdates.weight_kg = parseFloat(weight);
      updates.weight_kg = dbUpdates.weight_kg;
    }
    // 园区变更同步更新 facility 字段
    if (toFacility) {
      dbUpdates.facility = toFacility;
      updates.facility = toFacility;
    }
    if (imageUrls.length) {
      dbUpdates.images = [...(seal.images || []), ...imageUrls];
      updates.images = dbUpdates.images;
    }

    if (Object.keys(dbUpdates).length) {
      await supabase.from("seals").update(dbUpdates).eq("id", seal.id);
    }

    onSubmit(updates);
    setUploading(false);
    onClose();
  };

  const TABS = [
    { id: "health", label: "⚖ 体重/体况" },
    { id: "transfer", label: "🏠 园区变更" },
    { id: "timeline", label: "📅 动态" },
    { id: "comment", label: "💬 评论" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(13,27,42,0.6)", backdropFilter: "blur(6px)",
      zIndex: 500, display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        background: "white", borderRadius: "16px 16px 0 0", width: "100%",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
      }}>
        {/* 顶部把手 + 标题 */}
        <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2 }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingBottom: 10, borderBottom: `1px solid ${T.border}`,
          }}>
            <div>
              <div style={{ color: T.ink, fontWeight: 700, fontSize: 15 }}>补充 · {seal.name}</div>
              <div style={{ color: T.faint, fontSize: 11.5, marginTop: 2 }}>记录体重、体况、园区变更或动态</div>
            </div>
            <button onClick={onClose} style={{
              background: T.bg, border: `1px solid ${T.border}`,
              borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 17, color: T.muted,
            }}>×</button>
          </div>
        </div>

        {/* Tab 导航 */}
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, padding: "0 8px", flexShrink: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "none", border: "none",
              borderBottom: tab === t.id ? `2px solid ${tab === t.id && t.id === "transfer" ? T.amber : T.teal}` : "2px solid transparent",
              padding: "10px 12px 11px", marginBottom: -1,
              color: tab === t.id ? (t.id === "transfer" ? T.amber : T.teal) : T.muted,
              fontSize: 12, fontWeight: tab === t.id ? 700 : 400,
              cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
            }}>{t.label}</button>
          ))}
        </div>

        {/* 滚动内容 */}
        <div style={{ overflowY: "auto", padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Tab: 体重/体况 */}
          {tab === "health" && (
            <>
              <div style={{ color: T.muted, fontSize: 12, lineHeight: 1.6, background: T.bg, borderRadius: 8, padding: "10px 12px" }}>
                记录此次目击的体重、体况等信息，将作为时间线动态保存。
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={lbl}>体重（kg）</label>
                  <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="如：86" style={inp} />
                </div>
                <div>
                  <label style={lbl}>记录日期</label>
                  <input value={healthDate} onChange={e => setHealthDate(e.target.value)} placeholder="如：2025-03-10" style={inp} />
                </div>
              </div>
              <div>
                <label style={lbl}>体况评估</label>
                <select value={condition} onChange={e => setCondition(e.target.value)} style={inp}>
                  <option value="">请选择…</option>
                  {["良好", "一般", "较差", "不明"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>备注（外观、行为等）</label>
                <textarea value={healthNote} onChange={e => setHealthNote(e.target.value)}
                  placeholder="如：状态活跃，互动良好；左侧鳍肢有旧伤痕…"
                  rows={3} style={{ ...inp, resize: "none" }} />
              </div>
              <div>
                <label style={lbl}>现场图片</label>
                {imagePreviews.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    {imagePreviews.map((src, i) => (
                      <div key={i} style={{ position: "relative", width: 64, height: 64 }}>
                        <img src={src} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, border: `1px solid ${T.border}` }} />
                        <button onClick={() => { setImageFiles(p => p.filter((_,j)=>j!==i)); setImagePreviews(p => p.filter((_,j)=>j!==i)); }}
                          style={{ position: "absolute", top: -5, right: -5, width: 16, height: 16, background: "#EF4444", border: "none", borderRadius: "50%", color: "white", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <div onClick={() => imgRef.current?.click()}
                  style={{ border: `1.5px dashed ${T.border}`, borderRadius: 8, padding: "12px 0", textAlign: "center", cursor: "pointer", background: T.bg }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = T.teal}
                  onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                  <div style={{ color: T.muted, fontSize: 12.5 }}>📷 点击添加图片</div>
                  <input ref={imgRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onImageChange} style={{ display: "none" }} />
                </div>
              </div>
            </>
          )}

          {/* Tab: 园区变更 */}
          {tab === "transfer" && (
            <>
              <div style={{ background: T.amberPale, border: `1px solid #FDE68A`, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ color: "#92400E", fontSize: 12, lineHeight: 1.7 }}>
                  提交后将同步更新该个体的所属园区，并在历史记录中标注转移事件。
                </div>
              </div>
              <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ color: T.muted, fontSize: 11.5, marginBottom: 2 }}>当前园区</div>
                <div style={{ color: T.ink, fontSize: 13.5, fontWeight: 600 }}>{seal.facility}</div>
              </div>
              <div>
                <label style={lbl}>转入新园区 *</label>
                <input value={toFacility} onChange={e => setToFacility(e.target.value)}
                  placeholder="新园区全称，如：大连圣亚海洋世界" style={inp} />
              </div>
              <div>
                <label style={lbl}>转移日期</label>
                <input value={transferDate} onChange={e => setTransferDate(e.target.value)}
                  placeholder="如：2025-06" style={inp} />
              </div>
              <div>
                <label style={lbl}>备注</label>
                <textarea value={transferNote} onChange={e => setTransferNote(e.target.value)}
                  placeholder="如：因馆方合作转移，来源：官方微博公告…"
                  rows={3} style={{ ...inp, resize: "none" }} />
              </div>
            </>
          )}

          {/* Tab: 时间线动态 */}
          {tab === "timeline" && (
            <>
              <div>
                <label style={lbl}>日期</label>
                <input value={eventDate} onChange={e => setEventDate(e.target.value)} placeholder="如：2024-03" style={inp} />
              </div>
              <div>
                <label style={lbl}>事件描述</label>
                <textarea value={eventText} onChange={e => setEventText(e.target.value)}
                  placeholder="如：体检显示体重增至86kg，状态良好…"
                  rows={4} style={{ ...inp, resize: "none", lineHeight: 1.6 }} />
              </div>
            </>
          )}

          {/* Tab: 评论 */}
          {tab === "comment" && (
            <>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="你的观察记录、探访印象，或对该个体的补充说明…"
                rows={5} style={{ ...inp, resize: "none", lineHeight: 1.6 }} />
              {isLocked && (
                <div style={{ border: `1px solid #FDE68A`, borderRadius: 8, padding: "12px 13px", background: T.amberPale }}>
                  <div style={{ color: "#92400E", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>⚑ 提交纠错申请</div>
                  <textarea value={dispute} onChange={e => setDispute(e.target.value)}
                    placeholder="如有数据错误，请说明具体问题及你的信息来源…"
                    rows={2} style={{ ...inp, resize: "none", lineHeight: 1.6, background: "white" }} />
                  <div style={{ color: T.amber, fontSize: 11, marginTop: 5 }}>纠错申请将提交给维护者审核，通过后更新记录</div>
                </div>
              )}
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={uploading || (tab === "transfer" && !toFacility)}
            style={{
              background: tab === "transfer" && !toFacility ? "#FDE68A" : (uploading ? T.bg : T.teal),
              border: "none", borderRadius: 10, padding: "13px 0",
              color: tab === "transfer" && !toFacility ? T.amber : "white",
              fontSize: 14, fontWeight: 700,
              cursor: uploading || (tab === "transfer" && !toFacility) ? "default" : "pointer",
              fontFamily: "inherit",
            }}>
            {uploading ? "提交中…" : tab === "transfer" ? (toFacility ? `确认转移至 ${toFacility}` : "请填写新园区名称") : "提交"}
          </button>
        </div>
      </div>
    </div>
  );
}
