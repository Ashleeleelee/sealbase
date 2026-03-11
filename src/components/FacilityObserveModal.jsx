import { useState, useRef } from "react";
import T from "../utils/tokens";
import { supabase } from "../lib/supabase";

// 星星评分组件
function StarRating({ value, onChange, label, hint }) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      <label style={{ color: T.body, fontSize: 11.5, display: "block", marginBottom: 4, fontWeight: 600 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <span key={n}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            style={{ fontSize: 24, cursor: "pointer", transition: "transform 0.1s", transform: hover === n ? "scale(1.2)" : "scale(1)", userSelect: "none" }}>
            {n <= (hover || value) ? "★" : "☆"}
          </span>
        ))}
        <span style={{ color: T.faint, fontSize: 11, marginLeft: 4 }}>
          {value === 0 ? "未评分" : ["", "很差", "较差", "一般", "较好", "很好"][value]}
        </span>
      </div>
      {hint && <div style={{ color: T.faint, fontSize: 10.5, marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

export default function FacilityObserveModal({ facility, onClose, onSubmit }) {
  const [form, setForm] = useState({
    seal_count: "",
    score_water: 0,
    score_space: 0,
    score_condition: 0,
    notes: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const imgRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== i));
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const uploadImages = async () => {
    if (!imageFiles.length) return [];
    const urls = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `obs-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("seal-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) { console.error("图片上传失败:", error); continue; }
      const { data } = supabase.storage.from("seal-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const ok = form.seal_count !== "" && (form.score_water > 0 || form.score_space > 0 || form.score_condition > 0);

  const handleSubmit = async () => {
    if (!ok || uploading) return;
    setUploading(true);
    const imageUrls = await uploadImages();
    const { error } = await supabase.from("facility_observations").insert([{
      facility,
      seal_count: parseInt(form.seal_count) || 0,
      score_water: form.score_water || null,
      score_space: form.score_space || null,
      score_condition: form.score_condition || null,
      notes: form.notes || null,
      images: imageUrls.length ? imageUrls : null,
    }]);
    setUploading(false);
    if (error) { console.error("提交失败:", error); alert("提交失败，请稍后重试"); return; }
    setSubmitted(true);
    setTimeout(() => { onSubmit(); onClose(); }, 1500);
  };

  const inp = {
    width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 7,
    padding: "9px 12px", color: T.ink, fontSize: 13, outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", background: "white"
  };

  if (submitted) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.5)", backdropFilter: "blur(6px)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 14, padding: 40, textAlign: "center", maxWidth: 320 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <div style={{ color: T.ink, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>观察记录已提交</div>
        <div style={{ color: T.muted, fontSize: 13 }}>感谢你的贡献！</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.5)", backdropFilter: "blur(6px)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}>
      <div style={{ background: "white", borderRadius: 14, padding: 28, maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>

        {/* 标题 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 15, color: T.ink, fontFamily: "'Noto Serif SC',serif" }}>提交园区观察记录</h3>
            <p style={{ margin: 0, color: T.muted, fontSize: 12 }}>{facility}</p>
          </div>
          <button onClick={onClose} style={{ background: T.bg, border: "none", color: T.muted, width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 15 }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* 目测数量 */}
          <div>
            <label style={{ color: T.body, fontSize: 11.5, display: "block", marginBottom: 4, fontWeight: 600 }}>
              本次目测海豹数量 *
            </label>
            <input
              type="number" min="0" max="99"
              value={form.seal_count}
              onChange={e => set("seal_count", e.target.value)}
              placeholder="填写你实际看到的只数，如：3"
              style={{ ...inp, width: "100%" }}
            />
            <div style={{ marginTop: 5, background: T.bg, borderRadius: 6, padding: "7px 10px" }}>
              <div style={{ color: T.muted, fontSize: 11, lineHeight: 1.7 }}>
                💡 <strong>填写建议：</strong>只填写你亲眼看到的数量，不确定的个体不要计入。
                如果有个体躲在水下不可见，也不要猜测——保守估计比夸大更有参考价值。
              </div>
            </div>
          </div>

          {/* 分割线 */}
          <div style={{ borderTop: `1px solid ${T.border}` }} />

          {/* 评分说明 */}
          <div style={{ background: "#F0FDFF", border: `1px solid #BAE6FD`, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ color: T.teal, fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>📊 环境评分说明</div>
            <div style={{ color: "#0369A1", fontSize: 11, lineHeight: 1.8 }}>
              ★☆☆☆☆ 1分 — 很差 &nbsp;·&nbsp; ★★☆☆☆ 2分 — 较差<br />
              ★★★☆☆ 3分 — 一般 &nbsp;·&nbsp; ★★★★☆ 4分 — 较好<br />
              ★★★★★ 5分 — 很好 &nbsp;·&nbsp; 不了解可跳过不评
            </div>
          </div>

          {/* 三项评分 */}
          <StarRating
            value={form.score_water} onChange={v => set("score_water", v)}
            label="水质 / 水体清洁度"
            hint="水是否清澈？是否有明显异味或藻类污染？"
          />
          <StarRating
            value={form.score_space} onChange={v => set("score_space", v)}
            label="活动空间 / 展池大小"
            hint="展池面积是否充裕？海豹能否自由游动？"
          />
          <StarRating
            value={form.score_condition} onChange={v => set("score_condition", v)}
            label="个体状态 / 精神面貌"
            hint="海豹是否活跃？有无明显消瘦、受伤或精神萎靡？"
          />

          {/* 分割线 */}
          <div style={{ borderTop: `1px solid ${T.border}` }} />

          {/* 图片上传 */}
          <div>
            <label style={{ color: T.body, fontSize: 11.5, display: "block", marginBottom: 4, fontWeight: 600 }}>
              上传现场照片（可选）
            </label>
            {imagePreviews.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {imagePreviews.map((src, i) => (
                  <div key={i} style={{ position: "relative", width: 68, height: 68 }}>
                    <img src={src} alt="" style={{ width: 68, height: 68, objectFit: "cover", borderRadius: 6, border: `1px solid ${T.border}` }} />
                    <button onClick={() => removeImage(i)} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, background: "#EF4444", border: "none", borderRadius: "50%", color: "white", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div onClick={() => imgRef.current?.click()}
              style={{ border: `1.5px dashed ${T.border}`, borderRadius: 8, padding: 12, textAlign: "center", cursor: "pointer", background: T.bg }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.teal}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
              <div style={{ color: T.muted, fontSize: 13 }}>📷 点击添加图片</div>
              <div style={{ color: T.faint, fontSize: 11, marginTop: 2 }}>展池环境、个体状态均可，JPG / PNG，每张不超过 5MB</div>
              <input ref={imgRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onImageChange} style={{ display: "none" }} />
            </div>
          </div>

          {/* 补充描述 */}
          <div>
            <label style={{ color: T.body, fontSize: 11.5, display: "block", marginBottom: 4, fontWeight: 600 }}>
              补充描述（可选）
            </label>
            <textarea
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              rows={3}
              placeholder="如：「其中一只有明显眼伤」「展池正在维修，海豹被转移到临时区域」「饲养员正在喂食，海豹状态活跃」…"
              style={{ ...inp, resize: "vertical" }}
            />
          </div>

          {/* 提交按钮 */}
          <button onClick={handleSubmit} disabled={!ok || uploading}
            style={{ background: ok && !uploading ? T.teal : "#BAE6FD", border: "none", borderRadius: 8, padding: 13, color: "white", fontSize: 14, fontWeight: 700, cursor: ok && !uploading ? "pointer" : "default", fontFamily: "inherit" }}>
            {uploading ? "提交中…" : "提交观察记录"}
          </button>

          <div style={{ color: T.faint, fontSize: 11, textAlign: "center", marginTop: -8 }}>
            你的记录将汇入该园区的综合评分，帮助其他爱好者了解实际情况
          </div>
        </div>
      </div>
    </div>
  );
}

