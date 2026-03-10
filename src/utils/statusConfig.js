import T from "./tokens";

export const STATUS_META = {
  "圈养展示":      { dot: "#3B82F6", bg: "#EFF6FF",   text: "#1D4ED8" },
  "救助中·待放归": { dot: T.green,   bg: T.greenPale, text: "#065F46" },
  "已放归":        { dot: "#6B7280", bg: "#F1F5F9",   text: "#334155" },
  "繁育中":        { dot: T.amber,   bg: T.amberPale, text: "#92400E" },
};

export const QUALITY_CFG = {
  "已核实（官方报道）": { color: T.green, icon: "✓" },
  "待核实":             { color: T.amber, icon: "○" },
  "存疑":               { color: T.red,   icon: "!" },
};
