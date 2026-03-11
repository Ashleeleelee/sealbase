// ─── sealbase 权限工具 ───────────────────────────────────────────
// 角色层级：guest < certified < moderator < root
// 存储：cookie（sealbase_role），root 用 sessionStorage（关闭浏览器失效）
//
// 扩展接口预留：
//   - 未来如需服务端验证，只需修改 getRole() 的实现，调用方不变
//   - moderator 可扩展为 "moderator:园区名" 支持按园区限权

const COOKIE_KEY = "sealbase_role";
const ROOT_SESSION_KEY = "sealbase_root";
const COOKIE_DAYS = 180;

// ── 底层 cookie 工具 ──────────────────────────────────────────────
function setCookie(key, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${key}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(key) {
  return document.cookie.split("; ").reduce((acc, part) => {
    const [k, v] = part.split("=");
    return k === key ? v : acc;
  }, null);
}

function deleteCookie(key) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// ── 公开 API ──────────────────────────────────────────────────────

/**
 * 获取当前角色
 * @returns {"root"|"moderator"|"certified"|"guest"}
 */
export function getRole() {
  if (sessionStorage.getItem(ROOT_SESSION_KEY) === "true") return "root";
  const cookie = getCookie(COOKIE_KEY);
  if (cookie === "moderator") return "moderator";
  if (cookie === "certified") return "certified";
  return "guest";
}

/** 权限判断快捷方法 */
export const isRoot      = () => getRole() === "root";
export const isModerator = () => ["root", "moderator"].includes(getRole());
export const isCertified = () => ["root", "moderator", "certified"].includes(getRole());
export const isGuest     = () => getRole() === "guest";

/** 答题通过后调用 */
export function certify() {
  setCookie(COOKIE_KEY, "certified", COOKIE_DAYS);
}

/**
 * root 解锁（密码验证在调用方完成）
 * root 权限只存 sessionStorage，关闭浏览器即失效
 */
export function unlockRoot() {
  sessionStorage.setItem(ROOT_SESSION_KEY, "true");
}

/** 颁发 moderator（由 root 调用） */
export function grantModerator() {
  setCookie(COOKIE_KEY, "moderator", COOKIE_DAYS);
}

/** 登出 / 清除身份 */
export function clearRole() {
  deleteCookie(COOKIE_KEY);
  sessionStorage.removeItem(ROOT_SESSION_KEY);
}
