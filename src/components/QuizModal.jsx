import { useState } from "react";
import T from "../utils/tokens";
import { sampleQuiz } from "../data/quizBank";

export default function QuizModal({ onPass, onClose }) {
  const [quiz] = useState(() => sampleQuiz());
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (i) => {
    if (sel !== null) return;
    setSel(i);
    const ns = i === quiz[cur].answer ? score + 1 : score;
    setTimeout(() => {
      if (cur + 1 >= quiz.length) { setScore(ns); setDone(true); }
      else { setScore(ns); setCur(c => c + 1); setSel(null); }
    }, 650);
  };

  const passed = score >= 2;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.5)", backdropFilter: "blur(6px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 14, padding: 36, maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        {!done ? (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: T.ink, fontWeight: 700, fontSize: 15, marginBottom: 3 }}>贡献者知识认证</div>
              <div style={{ color: T.faint, fontSize: 12 }}>第 {cur + 1} / {quiz.length} 题 · 答对 2 题通过 · 每次随机抽题</div>
            </div>
            <div style={{ height: 3, background: T.bg, borderRadius: 3, marginBottom: 22 }}>
              <div style={{ width: `${(cur / quiz.length) * 100}%`, height: "100%", background: T.teal, borderRadius: 3, transition: "width 0.4s" }} />
            </div>
            <p style={{ color: T.ink, fontSize: 14.5, lineHeight: 1.7, marginBottom: 16 }}>{quiz[cur].q}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quiz[cur].options.map((opt, i) => {
                let bg = T.bg, border = T.border, color = T.body;
                if (sel !== null) {
                  if (i === quiz[cur].answer) { bg = T.greenPale; border = "#6EE7B7"; color = "#065F46"; }
                  else if (i === sel) { bg = "#FEF2F2"; border = "#FCA5A5"; color = "#B91C1C"; }
                }
                return (
                  <button key={i} onClick={() => choose(i)} style={{ background: bg, border: `1.5px solid ${border}`, color, borderRadius: 8, padding: "11px 15px", fontSize: 13.5, cursor: sel === null ? "pointer" : "default", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{passed ? "✅" : "❌"}</div>
            <h3 style={{ color: passed ? "#065F46" : "#B91C1C", margin: "0 0 10px", fontSize: 18 }}>{passed ? "认证通过" : "未能通过"}</h3>
            <p style={{ color: T.body, fontSize: 13, marginBottom: 26, lineHeight: 1.75 }}>
              {passed ? `答对 ${score}/${quiz.length} 题。请确保提交信息有据可查。` : `答对 ${score}/${quiz.length} 题。每次重试题目会重新随机。`}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {passed
                ? <button onClick={onPass} style={{ background: T.teal, border: "none", borderRadius: 8, padding: "11px 28px", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>开始贡献</button>
                : <button onClick={() => { setCur(0); setSel(null); setScore(0); setDone(false); }} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "11px 24px", color: T.ink, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>再次尝试</button>
              }
              <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, padding: "11px 18px", color: T.muted, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>取消</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
