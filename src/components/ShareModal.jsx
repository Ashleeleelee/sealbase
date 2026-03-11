import { useState, useRef } from "react";
import T from "../utils/tokens";

const SITE_URL = "https://sealbase-7gxn9kdfc7300414-1409601065.tcloudbaseapp.com/sealbase/";

const SEAL_ILLUSTRATIONS = [
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="130" rx="60" ry="40" fill="#94A3B8" opacity="0.3"/><ellipse cx="100" cy="110" rx="55" ry="50" fill="#CBD5E1"/><ellipse cx="100" cy="95" rx="35" ry="32" fill="#94A3B8"/><circle cx="88" cy="88" r="6" fill="#1E293B"/><circle cx="112" cy="88" r="6" fill="#1E293B"/><circle cx="90" cy="90" r="2" fill="white"/><circle cx="114" cy="90" r="2" fill="white"/><ellipse cx="100" cy="100" rx="8" ry="5" fill="#475569"/><line x1="80" y1="98" x2="60" y2="94" stroke="#475569" strokeWidth="1.5"/><line x1="80" y1="101" x2="58" y2="100" stroke="#475569" strokeWidth="1.5"/><line x1="80" y1="104" x2="60" y2="106" stroke="#475569" strokeWidth="1.5"/><line x1="120" y1="98" x2="140" y2="94" stroke="#475569" strokeWidth="1.5"/><line x1="120" y1="101" x2="142" y2="100" stroke="#475569" strokeWidth="1.5"/><line x1="120" y1="104" x2="140" y2="106" stroke="#475569" strokeWidth="1.5"/><ellipse cx="68" cy="128" rx="18" ry="8" fill="#94A3B8" transform="rotate(-20 68 128)"/><ellipse cx="132" cy="128" rx="18" ry="8" fill="#94A3B8" transform="rotate(20 132 128)"/><path d="M85 148 Q100 158 115 148 Q100 165 85 148Z" fill="#64748B"/></svg>`,
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="95" cy="140" rx="70" ry="28" fill="#94A3B8" opacity="0.25"/><ellipse cx="95" cy="128" rx="65" ry="30" fill="#CBD5E1"/><ellipse cx="60" cy="105" rx="28" ry="25" fill="#94A3B8"/><circle cx="50" cy="98" r="5" fill="#1E293B"/><circle cx="52" cy="100" r="1.5" fill="white"/><ellipse cx="58" cy="108" rx="6" ry="4" fill="#475569"/><line x1="44" y1="106" x2="28" y2="102" stroke="#475569" strokeWidth="1.2"/><line x1="44" y1="109" x2="26" y2="109" stroke="#475569" strokeWidth="1.2"/><line x1="44" y1="112" x2="28" y2="115" stroke="#475569" strokeWidth="1.2"/><ellipse cx="42" cy="125" rx="14" ry="7" fill="#94A3B8" transform="rotate(-15 42 125)"/><path d="M145 120 Q165 115 168 128 Q165 140 145 138Z" fill="#94A3B8"/><circle cx="75" cy="112" r="3" fill="#64748B" opacity="0.4"/><circle cx="90" cy="118" r="2.5" fill="#64748B" opacity="0.3"/></svg>`,
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="125" rx="65" ry="45" fill="#CBD5E1"/><ellipse cx="100" cy="108" rx="38" ry="35" fill="#B0BEC5"/><circle cx="86" cy="100" r="7" fill="#1E293B"/><circle cx="114" cy="100" r="7" fill="#1E293B"/><circle cx="88" cy="98" r="2.5" fill="white"/><circle cx="116" cy="98" r="2.5" fill="white"/><path d="M88 112 Q100 120 112 112" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round"/><ellipse cx="100" cy="108" rx="6" ry="4" fill="#78909C"/><line x1="82" y1="106" x2="62" y2="100" stroke="#607D8B" strokeWidth="1.3"/><line x1="82" y1="109" x2="60" y2="109" stroke="#607D8B" strokeWidth="1.3"/><line x1="82" y1="112" x2="62" y2="117" stroke="#607D8B" strokeWidth="1.3"/><line x1="118" y1="106" x2="138" y2="100" stroke="#607D8B" strokeWidth="1.3"/><line x1="118" y1="109" x2="140" y2="109" stroke="#607D8B" strokeWidth="1.3"/><line x1="118" y1="112" x2="138" y2="117" stroke="#607D8B" strokeWidth="1.3"/><ellipse cx="55" cy="138" rx="20" ry="9" fill="#94A3B8" transform="rotate(-25 55 138)"/><ellipse cx="145" cy="138" rx="20" ry="9" fill="#94A3B8" transform="rotate(25 145 138)"/><path d="M82 155 Q100 168 118 155 Q100 172 82 155Z" fill="#64748B"/></svg>`,
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M20 150 Q50 138 80 148 Q110 158 140 145 Q170 132 180 150 L180 200 L20 200Z" fill="#0891B2" opacity="0.2"/><ellipse cx="100" cy="135" rx="40" ry="22" fill="#CBD5E1"/><ellipse cx="100" cy="112" rx="30" ry="30" fill="#B0BEC5"/><circle cx="88" cy="105" r="6" fill="#1E293B"/><circle cx="112" cy="105" r="6" fill="#1E293B"/><circle cx="90" cy="103" r="2" fill="white"/><circle cx="114" cy="103" r="2" fill="white"/><ellipse cx="100" cy="116" rx="7" ry="4.5" fill="#78909C"/><line x1="84" y1="114" x2="65" y2="108" stroke="#607D8B" strokeWidth="1.3"/><line x1="84" y1="117" x2="63" y2="117" stroke="#607D8B" strokeWidth="1.3"/><line x1="84" y1="120" x2="65" y2="124" stroke="#607D8B" strokeWidth="1.3"/><line x1="116" y1="114" x2="135" y2="108" stroke="#607D8B" strokeWidth="1.3"/><line x1="116" y1="117" x2="137" y2="117" stroke="#607D8B" strokeWidth="1.3"/><line x1="116" y1="120" x2="135" y2="124" stroke="#607D8B" strokeWidth="1.3"/></svg>`
];

function QRCode({ url, size = 80, light = false }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=${light ? "ffffff" : "0D1B2A"}&color=${light ? "0D1B2A" : "ffffff"}&margin=2`;
  return <img src={qrUrl} alt="QR" width={size} height={size} style={{ display: "block", borderRadius: 4 }} />;
}

const STATUS_COLOR = {
  "圈养展示": "#0891B2", "救助中·待放归": "#D97706", "已放归": "#059669", "繁育中": "#7C3AED",
};

function CardNavy({ seal, ratio, imgSrc }) {
  const isPortrait = ratio === "9:16";
  const w = isPortrait ? 360 : 400; const h = isPortrait ? 640 : 400;
  const statusColor = STATUS_COLOR[seal.status] || T.teal;
  const illuIdx = (seal.id || 0) % 4;
  return (
    <div style={{ width: w, height: h, background: T.navy, borderRadius: 16, overflow: "hidden", position: "relative", fontFamily: "'Noto Sans SC','PingFang SC',sans-serif", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 20%, rgba(8,145,178,0.15) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: isPortrait ? "52%" : "100%", width: isPortrait ? "100%" : "55%" }}>
        {imgSrc ? <img src={imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} crossOrigin="anonymous" />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,145,178,0.1)" }} dangerouslySetInnerHTML={{ __html: SEAL_ILLUSTRATIONS[illuIdx] }} />}
        <div style={{ position: "absolute", inset: 0, background: isPortrait ? "linear-gradient(to bottom, transparent 50%, rgba(13,27,42,0.95) 100%)" : "linear-gradient(to right, transparent 40%, rgba(13,27,42,0.98) 100%)" }} />
      </div>
      <div style={{ position: "absolute", ...(isPortrait ? { bottom: 0, left: 0, right: 0, padding: "24px 24px 20px" } : { top: 0, right: 0, bottom: 0, width: "48%", padding: "28px 22px 22px" }), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>PHOCA LARGHA · 斑海豹个体档案</div>
          <div style={{ fontSize: isPortrait ? 34 : 28, fontWeight: 900, color: "white", fontFamily: "'Noto Serif SC',serif", lineHeight: 1.1, marginBottom: 8 }}>{seal.name}</div>
          <div style={{ display: "inline-block", background: statusColor, color: "white", fontSize: 10.5, padding: "3px 10px", borderRadius: 99, fontWeight: 700, marginBottom: 14 }}>{seal.status}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[["饲养机构", seal.facility], ["所在地", [seal.city, seal.province].filter(Boolean).join("·") || "—"], ["性别", seal.sex || "未知"], seal.arrived_year && ["入馆年份", seal.arrived_year]].filter(Boolean).map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 8 }}><span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, width: 52, flexShrink: 0 }}>{k}</span><span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>{v}</span></div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 }}>
          <div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9.5, marginBottom: 2 }}>中国圈养斑海豹档案库</div><div style={{ color: "rgba(255,255,255,0.25)", fontSize: 8.5 }}>sealbase · 非官方社区数据库</div></div>
          <div style={{ background: "rgba(255,255,255,0.05)", padding: 6, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}><QRCode url={SITE_URL} size={52} light={false} /></div>
        </div>
      </div>
    </div>
  );
}

function CardWhite({ seal, ratio, imgSrc }) {
  const isPortrait = ratio === "9:16";
  const w = isPortrait ? 360 : 400; const h = isPortrait ? 640 : 400;
  const statusColor = STATUS_COLOR[seal.status] || T.teal;
  const illuIdx = ((seal.id || 0) + 1) % 4;
  return (
    <div style={{ width: w, height: h, background: "white", borderRadius: 16, overflow: "hidden", position: "relative", fontFamily: "'Noto Sans SC','PingFang SC',sans-serif", border: `1px solid ${T.border}`, flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: isPortrait ? "55%" : "100%", width: isPortrait ? "100%" : "52%" }}>
        {imgSrc ? <img src={imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F9FF" }} dangerouslySetInnerHTML={{ __html: SEAL_ILLUSTRATIONS[illuIdx] }} />}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)" }}>
          <span style={{ color: "white", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>🦭 SEALBASE</span>
          <div style={{ background: statusColor, color: "white", fontSize: 9.5, padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>{seal.status}</div>
        </div>
      </div>
      <div style={{ position: "absolute", ...(isPortrait ? { bottom: 0, left: 0, right: 0, height: "48%", padding: "20px 22px 18px" } : { top: 0, right: 0, bottom: 0, width: "51%", padding: "24px 20px" }), display: "flex", flexDirection: "column", justifyContent: "space-between", background: "white" }}>
        <div>
          <div style={{ width: 32, height: 2, background: T.teal, marginBottom: 10 }} />
          <div style={{ fontSize: isPortrait ? 30 : 24, fontWeight: 900, color: T.navy, fontFamily: "'Noto Serif SC',serif", lineHeight: 1.15, marginBottom: 4 }}>{seal.name}</div>
          <div style={{ color: T.muted, fontSize: 11, fontStyle: "italic", marginBottom: 14 }}>Phoca largha</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[["📍", seal.facility + (seal.city ? `，${seal.city}` : "")], ["⚥", seal.sex || "未知"], seal.arrived_year && ["📅", `${seal.arrived_year}年入馆`]].filter(Boolean).map(([icon, v]) => (
              <div key={icon} style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ fontSize: 11 }}>{icon}</span><span style={{ color: T.body, fontSize: 11.5 }}>{v}</span></div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ color: T.faint, fontSize: 9, lineHeight: 1.6 }}>中国圈养斑海豹档案库<br />非官方社区数据库</div>
          <div style={{ border: `1px solid ${T.border}`, padding: 5, borderRadius: 7 }}><QRCode url={SITE_URL} size={48} light={true} /></div>
        </div>
      </div>
    </div>
  );
}

function CardKraft({ seal, ratio, imgSrc }) {
    const isPortrait = ratio === "9:16";
    const w = isPortrait ? 360 : 400; const h = isPortrait ? 640 : 400;
    const illuIdx = ((seal.id || 0) + 2) % 4;
    return (
      <div style={{ width: w, height: h, background: "#F2E6C8", borderRadius: 16, overflow: "hidden", position: "relative", fontFamily: "Georgia,'Noto Serif SC',serif", flexShrink: 0 }}>
        {/* 羊皮纸底色渐变 */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 15% 15%, rgba(255,252,235,0.8) 0%, transparent 45%), radial-gradient(ellipse at 85% 85%, rgba(160,110,50,0.12) 0%, transparent 45%), linear-gradient(160deg, #F5E8C0 0%, #EDD99A 40%, #E8D090 100%)" }} />
        {/* 边缘做旧暗角 */}
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 60px rgba(80,45,10,0.25), inset 0 0 20px rgba(80,45,10,0.15)" }} />
        {/* 外框：铜版印刷双线 */}
        <div style={{ position: "absolute", inset: 9, border: "1.5px solid #8B6520", borderRadius: 2, pointerEvents: "none", zIndex: 12, opacity: 0.7 }} />
        <div style={{ position: "absolute", inset: 12, border: "0.5px solid #8B6520", borderRadius: 1, pointerEvents: "none", zIndex: 12, opacity: 0.35 }} />
  
        {/* 图片区 */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: isPortrait ? "52%" : "100%", width: isPortrait ? "100%" : "50%" }}>
          {imgSrc
            ? <img src={imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(40%) contrast(0.85) brightness(0.97) saturate(0.8)", opacity: 0.9 }} crossOrigin="anonymous" />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #E8D090 0%, #D4B870 100%)" }} dangerouslySetInnerHTML={{ __html: SEAL_ILLUSTRATIONS[illuIdx] }} />
          }
          {/* 图片褪色 */}
          <div style={{ position: "absolute", inset: 0, background: isPortrait
            ? "linear-gradient(to bottom, transparent 55%, rgba(242,230,200,0.82) 100%)"
            : "linear-gradient(to right, transparent 50%, rgba(242,230,200,0.82) 100%)"
          }} />
          {/* 图片暗角 */}
          <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 30px rgba(80,45,10,0.2)" }} />
  
          {/* 手绘标注线（仅横版） */}
          {!isPortrait && (
            <div style={{ position: "absolute", bottom: 28, right: 0, width: 30, height: 1, background: "#8B6520", opacity: 0.5 }} />
          )}
  
          {/* 铜版印刷风格图注 */}
          <div style={{ position: "absolute", bottom: isPortrait ? 8 : 12, left: isPortrait ? 18 : 14, background: "rgba(242,230,200,0.88)", border: "0.5px solid #8B6520", padding: "2px 8px", borderRadius: 1 }}>
            <span style={{ fontSize: 8, color: "#5A3E10", fontStyle: "italic", letterSpacing: "0.06em" }}>Fig. I. — Phoca largha</span>
          </div>
        </div>
  
        {/* 内容区 */}
        <div style={{
          position: "absolute",
          ...(isPortrait
            ? { bottom: 0, left: 0, right: 0, padding: "16px 22px 18px" }
            : { top: 0, right: 0, bottom: 0, width: "53%", padding: "20px 20px 16px" }),
          display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          <div>
            {/* 顶部装饰标题行 */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#8B6520" strokeWidth="0.8" opacity="0.6"/><circle cx="7" cy="7" r="2" fill="#8B6520" opacity="0.4"/></svg>
              <span style={{ fontSize: 7.5, color: "#6B4A14", letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.85 }}>Natural History · 自然史档案</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#8B6520" strokeWidth="0.8" opacity="0.6"/><circle cx="7" cy="7" r="2" fill="#8B6520" opacity="0.4"/></svg>
            </div>
  
            {/* 个体名 */}
            <div style={{ fontSize: isPortrait ? 32 : 25, fontWeight: 700, color: "#1E0F00", lineHeight: 1.05, marginBottom: 1 }}>{seal.name}</div>
  
            {/* 拉丁名 */}
            <div style={{ color: "#7A5218", fontSize: 10, fontStyle: "italic", marginBottom: 8, letterSpacing: "0.04em" }}>Phoca largha (Pallas, 1811)</div>
  
            {/* 铜版装饰分割线 */}
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 10, opacity: 0.6 }}>
              <div style={{ flex: 1, height: 0.5, background: "#8B6520" }} />
              <svg width="8" height="8" viewBox="0 0 8 8"><path d="M4 0 L8 4 L4 8 L0 4Z" fill="#8B6520"/></svg>
              <div style={{ width: 16, height: 0.5, background: "#8B6520" }} />
              <svg width="8" height="8" viewBox="0 0 8 8"><path d="M4 0 L8 4 L4 8 L0 4Z" fill="#8B6520"/></svg>
              <div style={{ flex: 1, height: 0.5, background: "#8B6520" }} />
            </div>
  
            {/* 档案字段——手写体感觉 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                ["Locality", seal.facility + (seal.city ? `，${seal.city}` : "")],
                ["Sex", seal.sex === "雄" ? "♂ Male · 雄" : seal.sex === "雌" ? "♀ Female · 雌" : "Unknown · 未知"],
                seal.arrived_year && ["Recorded", `Anno ${seal.arrived_year}`],
                ["Condition", seal.status],
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "baseline", borderBottom: "0.5px dotted rgba(139,101,32,0.3)", paddingBottom: 3 }}>
                  <span style={{ color: "#7A5218", fontSize: 9, width: 54, flexShrink: 0, fontStyle: "italic", opacity: 0.9 }}>{k}</span>
                  <span style={{ color: "#1E0F00", fontSize: 11 }}>{v}</span>
                </div>
              ))}
            </div>
  
            {/* 红色做旧印章 */}
            <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4, border: "1px solid rgba(160,40,20,0.3)", borderRadius: 2, padding: "2px 8px", transform: "rotate(-1.5deg)", transformOrigin: "left" }}>
              <svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3" stroke="rgba(160,40,20,0.45)" strokeWidth="0.8"/></svg>
              <span style={{ color: "rgba(160,40,20,0.45)", fontSize: 7.5, letterSpacing: "0.18em", textTransform: "uppercase" }}>Non-Official Record</span>
            </div>
          </div>
  
          {/* 底部：出版信息 + 邮票QR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6 }}>
            <div>
              <div style={{ color: "#6B4A14", fontSize: 8, lineHeight: 1.9, opacity: 0.75, fontStyle: "italic" }}>
                中国圈养斑海豹档案库<br />
                <span style={{ fontStyle: "normal", letterSpacing: "0.04em" }}>Phoca largha Captive Registry</span>
              </div>
            </div>
            {/* 邮票风格QR */}
            <div style={{ position: "relative" }}>
              <div style={{ background: "#F8F0D8", padding: "5px 5px 8px", border: "0.5px solid #8B6520", boxShadow: "1px 2px 4px rgba(80,45,10,0.2), inset 0 0 8px rgba(80,45,10,0.05)" }}>
                <QRCode url={SITE_URL} size={44} light={true} />
                <div style={{ textAlign: "center", color: "#7A5218", fontSize: 6.5, marginTop: 3, letterSpacing: "0.1em", fontStyle: "italic" }}>sealbase</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


function CardOcean({ seal, ratio, imgSrc }) {
  const isPortrait = ratio === "9:16";
  const w = isPortrait ? 360 : 400; const h = isPortrait ? 640 : 400;
  const illuIdx = ((seal.id || 0) + 3) % 4;
  return (
    <div style={{ width: w, height: h, background: "linear-gradient(135deg, #0C4A6E 0%, #0891B2 50%, #06B6D4 100%)", borderRadius: 16, overflow: "hidden", position: "relative", fontFamily: "'Noto Sans SC','PingFang SC',sans-serif", flexShrink: 0 }}>
      <svg style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} viewBox="0 0 400 120" preserveAspectRatio="none" height="120">
        <path d="M0 60 Q50 30 100 60 Q150 90 200 60 Q250 30 300 60 Q350 90 400 60 L400 120 L0 120Z" fill="rgba(255,255,255,0.06)" />
      </svg>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: isPortrait ? "48%" : "100%", width: isPortrait ? "100%" : "50%" }}>
        {imgSrc ? <img src={imgSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, mixBlendMode: "luminosity" }} crossOrigin="anonymous" />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} dangerouslySetInnerHTML={{ __html: SEAL_ILLUSTRATIONS[illuIdx] }} />}
        <div style={{ position: "absolute", inset: 0, background: isPortrait ? "linear-gradient(to bottom, rgba(8,145,178,0.3) 0%, rgba(12,74,110,0.75) 100%)" : "linear-gradient(to right, rgba(8,145,178,0.2) 0%, rgba(12,74,110,0.78) 100%)" }} />
      </div>
      <div style={{ position: "absolute", ...(isPortrait ? { bottom: 0, left: 0, right: 0, padding: "24px 24px 22px" } : { top: 0, right: 0, bottom: 0, width: "53%", padding: "28px 22px 22px" }), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 20, height: 1.5, background: "rgba(255,255,255,0.5)" }} />
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>斑海豹 · Spotted Seal</div>
          </div>
          <div style={{ fontSize: isPortrait ? 36 : 28, fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 6 }}>{seal.name}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, padding: "3px 10px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.2)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[seal.status] || "white" }} />
            <span style={{ color: "white", fontSize: 10.5 }}>{seal.status}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[["🏛", seal.facility], ["📍", [seal.city, seal.province].filter(Boolean).join("·") || "—"], ["⚥", seal.sex || "未知"]].map(([icon, v]) => (
              <div key={icon} style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ fontSize: 12 }}>{icon}</span><span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>{v}</span></div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9.5, lineHeight: 1.6 }}>中国圈养斑海豹档案库<br />sealbase · 非官方</div>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: 6, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)" }}><QRCode url={SITE_URL} size={52} light={false} /></div>
        </div>
      </div>
    </div>
  );
}

const STYLES = [
  { id: "navy", label: "档案", desc: "深色正式", Comp: CardNavy },
  { id: "white", label: "杂志", desc: "白色简约", Comp: CardWhite },
  { id: "kraft", label: "博物馆", desc: "复古牛皮纸", Comp: CardKraft },
  { id: "ocean", label: "海洋", desc: "青绿渐变", Comp: CardOcean },
];

export default function ShareModal({ seal, onClose }) {
  const [style, setStyle] = useState("navy");
  const [ratio, setRatio] = useState("1:1");
  const [saving, setSaving] = useState(false);
 
  const cardRef = useRef();
  const imgSrc = seal?.images && seal.images.length > 0 ? seal.images[0] : null;
  const CurrentCard = STYLES.find(s => s.id === style)?.Comp || CardNavy;

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleSave = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    setPreviewUrl(null);
    try {
      const { default: html2canvas } = await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js");
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null, logging: false });
      const url = canvas.toDataURL("image/png");
      if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
        setPreviewUrl(url);
      } else {
        const link = document.createElement("a");
        link.download = `${seal.name}-sealbase-${style}-${ratio.replace(":", "x")}.png`;
        link.href = url;
        link.click();
      }
    } catch (e) {
      console.error(e);
      alert("保存失败，请截图保存");
    }
    setSaving(false);
  };

  if (!seal) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.7)", backdropFilter: "blur(8px)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}>
      <div style={{ background: "white", borderRadius: 16, padding: "28px 28px 24px", maxWidth: 760, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.2)", maxHeight: "95vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <h3 style={{ margin: "0 0 3px", fontSize: 16, color: T.ink, fontFamily: "'Noto Serif SC',serif" }}>分享「{seal.name}」</h3>
            <p style={{ margin: 0, color: T.muted, fontSize: 12 }}>选择风格和比例，保存图片后分享</p>
          </div>
          <button onClick={onClose} style={{ background: T.bg, border: "none", color: T.muted, width: 30, height: 30, borderRadius: 7, cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: T.faint, fontSize: 11, marginBottom: 8, fontWeight: 600 }}>风格</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)} style={{ padding: "7px 16px", borderRadius: 8, border: `1.5px solid ${style === s.id ? T.teal : T.border}`, background: style === s.id ? "#F0FDFF" : "white", cursor: "pointer", color: style === s.id ? T.teal : T.body, fontSize: 12.5, fontWeight: style === s.id ? 700 : 400, fontFamily: "inherit" }}>
                {s.label} <span style={{ color: T.faint, fontSize: 10.5 }}>{s.desc}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <div style={{ color: T.faint, fontSize: 11, marginBottom: 8, fontWeight: 600 }}>比例</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["1:1", "9:16"].map(r => (
              <button key={r} onClick={() => setRatio(r)} style={{ padding: "7px 18px", borderRadius: 8, border: `1.5px solid ${ratio === r ? T.teal : T.border}`, background: ratio === r ? "#F0FDFF" : "white", cursor: "pointer", color: ratio === r ? T.teal : T.body, fontSize: 12.5, fontWeight: ratio === r ? 700 : 400, fontFamily: "inherit" }}>
                {r} {r === "1:1" ? "· 朋友圈" : "· 小红书"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22, background: T.bg, borderRadius: 12, padding: 20, overflow: "auto" }}>
          <div ref={cardRef} style={{ transform: ratio === "9:16" ? "scale(0.65)" : "scale(0.75)", transformOrigin: "top center", marginBottom: ratio === "9:16" ? "-180px" : "-50px" }}>
            <CurrentCard seal={seal} ratio={ratio} imgSrc={imgSrc} />
          </div>
        </div>
        {previewUrl && (
          <div style={{ marginBottom: 14, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
            <div style={{ background: T.bg, padding: "10px 14px 6px", textAlign: "center" }}>
              <div style={{ color: T.body, fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>📱 长按图片保存到相册</div>
              <div style={{ color: T.faint, fontSize: 11 }}>或截图保存</div>
            </div>
            <img src={previewUrl} alt="分享名片" style={{ width: "100%", display: "block" }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: T.teal, border: "none", borderRadius: 9, padding: "12px 0", color: "white", fontSize: 14, fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "inherit" }}>
            {saving ? "生成中…" : "⬇ 保存图片"}
          </button>
          <button onClick={onClose} style={{ padding: "12px 20px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 9, color: T.body, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>取消</button>
        </div>
      </div>
    </div>
  );
}

