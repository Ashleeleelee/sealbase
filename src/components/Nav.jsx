import { useState } from "react";
import T from "../utils/tokens";

export default function Nav({ view, setView, certified, onContribute }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [["records", "个体记录"], ["facilities", "饲养机构"], ["about", "关于项目"]];

  return (
    <>
      <nav style={{
        background: T.navy, padding: "0 32px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 52, position: "sticky", top: 0, zIndex: 200,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🦭</span>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15, fontFamily: "'Noto Serif SC',serif", lineHeight: 1.2 }}>
              中国圈养斑海豹档案库
            </div>
          </div>
        </div>

        {/* 桌面端 */}
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 10.5, fontStyle: "italic", marginRight: 8 }}>
            Phoca largha Captive Registry
          </span>
          {navItems.map(([v, l]) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? "rgba(255,255,255,0.12)" : "transparent", border: "none",
              color: view === v ? "white" : "rgba(255,255,255,0.5)", fontSize: 12.5,
              padding: "5px 13px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
            }}>{l}</button>
          ))}
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.15)", margin: "0 5px" }} />
          <button onClick={onContribute} style={{
            background: T.teal, border: "none", borderRadius: 6, padding: "6px 14px",
            color: "white", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>
            {certified ? "＋ 提交记录" : "贡献数据"}
          </button>
        </div>

        {/* 手机端汉堡 */}
        <button
          className="nav-mobile"
          onClick={() => setMenuOpen(v => !v)}
          style={{
            background: "rgba(255,255,255,0.08)", border: "none", color: "white",
            width: 36, height: 36, borderRadius: 8, cursor: "pointer",
            flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4.5,
          }}
        >
          {menuOpen
            ? <span style={{ fontSize: 18, lineHeight: 1 }}>×</span>
            : <>
                <span style={{ display: "block", width: 16, height: 1.5, background: "white", borderRadius: 1 }} />
                <span style={{ display: "block", width: 16, height: 1.5, background: "white", borderRadius: 1 }} />
                <span style={{ display: "block", width: 16, height: 1.5, background: "white", borderRadius: 1 }} />
              </>
          }
        </button>
      </nav>

      {/* 手机端下拉菜单 */}
      {menuOpen && (
        <div className="nav-mobile" style={{
          position: "fixed", top: 52, left: 0, right: 0, background: T.navy, zIndex: 199,
          borderBottom: `2px solid ${T.teal}`, paddingBottom: 8,
        }}>
          {navItems.map(([v, l]) => (
            <button key={v} onClick={() => { setView(v); setMenuOpen(false); }} style={{
              display: "block", width: "100%",
              background: view === v ? "rgba(8,145,178,0.15)" : "transparent",
              border: "none", borderLeft: view === v ? `3px solid ${T.teal}` : "3px solid transparent",
              color: view === v ? "white" : "rgba(255,255,255,0.55)",
              fontSize: 13.5, padding: "13px 20px", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}>{l}</button>
          ))}
          <div style={{ margin: "8px 16px 4px" }}>
            <button onClick={() => { onContribute(); setMenuOpen(false); }} style={{
              background: T.teal, border: "none", borderRadius: 8, padding: "11px 0",
              color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%",
            }}>
              {certified ? "+ 提交记录" : "贡献数据"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
