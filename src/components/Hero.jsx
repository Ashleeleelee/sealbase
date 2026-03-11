import { useState, useEffect } from "react";
import T from "../utils/tokens";

const SEAL_FACTS = [
  "斑海豹是中国唯一在本土繁殖的鳍足类动物 🌊",
  "斑海豹宝宝出生时全身白毛，像个糯米团子❄️",
  "斑海豹能在水下屏气长达 20 分钟 🤿",
  "斑海豹的胡须极度敏感，可感知水中的细微振动 〰️",
  "斑海豹是国家一级保护动物，和大熊猫同级 🐼",
  "成年斑海豹体重可达 130 公斤，但游泳轻盈快速！ 💨",
  "斑海豹每年迁徙数千公里，辽东湾是重要繁殖地 📍",
  "斑海豹的眼睛在水下视力极佳，陆地上反而有点近视 👀",
  "斑海豹可以活到 35 岁，相当长寿 🎂",
  "斑海豹妈妈哺乳期只有 2-3 周，奶水脂肪含量超过 40% 🍼",
  "斑海豹会「干」睡觉：在水面漂浮，一半脑子睡觉一半保持警惕 💤",
  "每只斑海豹的花纹都是独一无二的，就像人的指纹 🌟",
  "斑海豹是独居动物，但繁殖季会聚集成群 🤝",
  "斑海豹的前肢已进化为鳍，但骨骼结构和人手相似 🤲",
  "辽宁大连是中国圈养斑海豹数量最多的城市 🏙️",
  "斑海豹捕鱼时，一天可以吃掉相当于体重 5-8% 的食物 🐟",
  "救助后成功放归的斑海豹，会安上无线电追踪器方便追踪 🏷️",
  "斑海豹在冰上产仔，气候变暖正威胁它们的繁殖栖息地 🌡️",
  "斑海豹的叫声多样，有咕噜声、嗥叫声和短促的吠声 🔊",
  "斑海豹换毛期会大量脱毛，看起来有点「蓬头垢面」😅",
  "今天也要好好吃鱼！🐟",
  "愿你像斑海豹一样，在属于自己的海洋里自由游弋 🌊",
  "被你发现啦～今天会有好运气的 🍀",
  "斑海豹觉得你今天很棒 👏",
  "悄悄告诉你：今天是个适合去水族馆的好日子 🎫",
  "你是第几个发现我的？🤫",
  "嗷呜！（这是斑海豹说谢谢你关注我们的意思）",
  "保护斑海豹，从了解它们开始 💙",
  "每一条记录，都是对它们存在的见证 📝",
  "豹就在这里，谢谢你看见我！🦭",
  "斑海豹在冰上产仔，浮冰减少直接威胁其繁殖成功率 🌡️",
  "斑海豹没有外耳廓，只有两个耳孔，潜水时可关闭 👂",
  "斑海豹游泳主要依靠后肢左右摆动推进，前肢用于控制方向 🏊",
  "斑海豹出生时体长约 75-90 厘米，成年后可达 150-170 厘米 📏",
  "斑海豹的学名 Phoca largha 由博物学家帕拉斯于 1811 年命名 🔤",
  "辽东湾是斑海豹在中国最重要的繁殖地，也是全球最南端的繁殖种群 🗺️",
  "渔网误捕是野生斑海豹死亡的重要原因之一 ⚠️",
  "每年 1-3 月是斑海豹繁殖季，请勿进入辽东湾冰面打扰它们 🙏",
  "在海边发现搁浅的斑海豹，请拨打当地渔政或野生动物救助热线 📞",
  "记录圈养个体，是了解斑海豹人工种群现状的基础工作 🔬",
  "这个数据库的每一条记录，都是对斑海豹存在的见证 💾",
  "你来了，我很开心。下次再见～ 🌊",
  "今天适合去看海 🌅",
  "如果你认识某只斑海豹，欢迎来贡献它的档案 ✍️",
  "小秘密：这只海豹只有 15% 的概率会出现，你很幸运 🎰",
  "斑海豹是鳍足目真海豹科动物，与海狮、海象不同科 🔬",
  "斑海豹的后肢无法向前弯折，所以在陆地上只能靠腹部蠕动前进 🐛",
  "斑海豹的视网膜富含杆细胞，在昏暗深水中依然能看清猎物 👁️",
  "斑海豹幼仔身披白色胎毛，约两周后开始换成成体花纹 🤍",
  "斑海豹是肉食性动物，主要捕食鱼类、甲壳类和头足类 🦑",
  "斑海豹的鼻孔在放松状态下是关闭的，需要主动收缩肌肉才能打开呼吸 👃",
  "斑海豹属于「真海豹」，区别于有外耳的海狮，上岸时移动方式完全不同 🦭",
  "雌性斑海豹通常 3-5 岁性成熟，雄性略晚 🌱",
  "斑海豹的血液携氧能力远高于陆地哺乳动物，这是它能长时间潜水的关键 🩸",
  "斑海豹潜水时脾脏会收缩，将储存的含氧红细胞释放入血液 💉",
  "中国已将斑海豹列为国家一级重点保护野生动物，非法捕猎最高可判处十年有期徒刑 ⚖️",
  "盘锦、大连、烟台等地均建有斑海豹省级或国家级自然保护区 🏞️",
  "气候变化导致辽东湾冬季结冰期缩短，斑海豹繁殖窗口正在压缩 🌍",
  "圈养斑海豹的存在客观上为物种研究提供了条件，但野外保护才是根本 🔑",
  "部分救助机构已建立斑海豹个体档案，与本数据库的目标一致 🤝",
  "斑海豹是近岸海洋生态系统健康的指示物种，它们的处境反映了整片海域的状态 🌊",
  "你心里一定也有一片宁静的海🌅",
  "嗷！（斑海豹表示：你眼神真好）",
  "据说发现彩蛋海豹的人，下次去水族馆都会遇到一只特别亲人的斑海豹 🎟️",
  "我在波浪里等了很久，终于等到你了 🌊",
  "谢谢你关心我们 🥹",
  "这片海，因为有你的记录而不同 💙",

];

export default function Hero({ seals }) {
  const [sealPos, setSealPos] = useState(null);
  const [visible, setVisible] = useState(false);
  const [bubble, setBubble] = useState(null);

  useEffect(() => {
    if (Math.random() > 0.15) return;
    const timer = setTimeout(() => {
      setSealPos(Math.random() * 65 + 10);
      setVisible(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleSealClick = () => {
    const fact = SEAL_FACTS[Math.floor(Math.random() * SEAL_FACTS.length)];
    setBubble(fact);
  };

  return (
    <div style={{ background: `linear-gradient(170deg, ${T.navy} 0%, #0C2A3F 60%, #0A3D52 100%)`, padding: "44px 32px 0", borderBottom: `3px solid ${T.teal}`, position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes wave1 {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes wave2 {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-7px); }
          100% { transform: translateY(0px); }
        }
        @keyframes wave3 {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        @keyframes sealBob {
          0%   { transform: translateY(0px) rotate(-3deg); }
          40%  { transform: translateY(-8px) rotate(2deg); }
          70%  { transform: translateY(-4px) rotate(-1deg); }
          100% { transform: translateY(0px) rotate(-3deg); }
        }
        @keyframes sealFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        @keyframes bubblePop {
          0%   { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.92); }
          15%  { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
        }
        .seal-egg {
          animation: sealBob 2.2s ease-in-out infinite;
          cursor: pointer;
          user-select: none;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
          transition: filter 0.15s;
        }
        .seal-egg:hover {
          filter: drop-shadow(0 4px 12px rgba(8,145,178,0.7));
        }
        .seal-egg-wrap {
          animation: sealFadeIn 0.6s ease-out forwards;
        }
        .seal-bubble {
          animation: bubblePop 0.3s ease-out forwards;
        }
      `}</style>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", animation: "wave1 5s ease-in-out infinite" }}>
        <svg viewBox="0 0 1440 72" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,36 C120,60 240,12 360,36 C480,60 600,12 720,36 C840,60 960,12 1080,36 C1200,60 1320,20 1440,36 L1440,72 L0,72 Z" fill="#0E4D6B" opacity="0.9" />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", animation: "wave2 4s ease-in-out infinite 0.8s" }}>
        <svg viewBox="0 0 1440 52" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,26 C180,48 360,4 540,26 C720,48 900,6 1080,26 C1260,46 1380,16 1440,26 L1440,52 L0,52 Z" fill="#0A3D52" opacity="0.85" />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", animation: "wave3 3s ease-in-out infinite 1.4s" }}>
        <svg viewBox="0 0 1440 34" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,17 C90,30 180,4 270,17 C360,30 450,4 540,17 C630,30 720,4 810,17 C900,30 990,4 1080,17 C1170,30 1260,6 1350,17 C1395,23 1420,14 1440,17 L1440,34 L0,34 Z" fill="#1B6E8A" opacity="0.5" />
        </svg>
      </div>

      {visible && sealPos !== null && (
        <div className="seal-egg-wrap" style={{ position: "absolute", bottom: 8, left: `${sealPos}%`, zIndex: 10 }}>
          {bubble && (
            <div className="seal-bubble" style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 10, background: "white", color: T.ink, fontSize: 12.5, lineHeight: 1.7, padding: "12px 14px 10px", borderRadius: 12, width: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", pointerEvents: "auto" }}>
              <div style={{ marginBottom: 10 }}>{bubble}</div>
              <button
                onClick={() => { setBubble(null); setVisible(false); }}
                style={{ display: "block", width: "100%", background: T.teal, border: "none", borderRadius: 7, padding: "5px 0", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                知道了 👋
              </button>
              <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid white" }} />
            </div>
          )}
          <div className="seal-egg" onClick={handleSealClick}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>🦭</span>
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, paddingBottom: 52 }}>
        <div>
          <div style={{ color: T.tealPale, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, opacity: 0.7 }}>中国 · 非官方社区数据库</div>
          <h1 style={{ color: "white", fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, fontFamily: "'Noto Serif SC',serif", margin: "0 0 12px", lineHeight: 1.2 }}>记录每一只有名字的斑海豹</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14.5, margin: "0 0 6px", lineHeight: 1.8, maxWidth: 520 }}>斑海豹是中国唯一在本土海域繁殖的鳍足类动物，国家一级保护动物。本数据库由爱好者社区协作维护，追踪中国各水族馆及救助机构中的圈养个体。</p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12.5, margin: 0, fontStyle: "italic" }}>让每一只斑海豹都被看见，被记录，被了解。</p>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { n: seals.length, label: "个体档案" },
            { n: seals.filter(s => s.status === "救助中·待放归").length, label: "救助中" },
            { n: seals.filter(s => s.status === "已放归").length, label: "已放归" },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: "white", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{n}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11.5, marginTop: 5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


