# Sealbase 开发日记

> 中国圈养斑海豹档案库 · 社区自发维护项目  
> 情感核心：让每一只都被看见、被记录、被了解

---

## 项目基础信息

- 线上：https://sealbase-7gxn9kdfc7300414-1409601065.tcloudbaseapp.com/sealbase/
- GitHub：https://github.com/Ashleeleelee/sealbase
- 本地：~/Desktop/sealbase
- 技术栈：React + Vite，纯 inline style，Supabase，腾讯云静态托管

### 部署命令
```bash
export https_proxy=http://127.0.0.1:7890 && export http_proxy=http://127.0.0.1:7890 && export all_proxy=socks5://127.0.0.1:7890
cd ~/Desktop/sealbase && npm run build && git add . && git commit -m "..." && git push origin main
```
注意：腾讯云部署路径是 /sealbase，vite.config.js 的 base 必须是 '/sealbase/'，两者必须一致

---

## 设计 Token

```
navy=#0D1B2A  teal=#0891B2   bg=#F8FAFC
ink=#0F172A   body=#334155   muted=#64748B
faint=#94A3B8 border=#E2E8F0
green=#059669 greenPale=#ECFDF5
amber=#D97706 amberPale=#FFFBEB
```

---

## 项目定位

- 灵感：海外 Ceta-Base（圈养鲸豚数据库）
- 目标：中文语境下第一个系统性鳍足类圈养个体档案库
- 数据三级可信度：待核实 → 已核实 → 存疑，社区 3 人确认自动升级
- 当前：冷启动阶段，尚无正式记录

### 社区生态
- 普通爱好者：浏览、贡献、核实
- 资深爱好者/审核员：协助审核
- 园区负责人：官方认领 → 官方徽章 → 激励维护数据
- root（你）：唯一最高管理员

---

## 权限体系（最小化实现）

角色：guest → certified（答题通过）→ moderator（预留）→ root（你）

- cookie sealbase_role，有效期 180 天
- root 用 sessionStorage，关浏览器失效
- src/utils/auth.js 是统一入口
- root 解锁：关于页版本号连点 5 次 + 密码
- 密码存 .env.local（不被 git 追踪）：VITE_ROOT_PASSWORD_HASH=密码的SHA-256哈希值

---

## 已完成功能

- 个体档案列表（桌面表格 + 移动端卡片）
- 筛选器（性别、状态、省份）
- 搜索
- 个体详情（侧边栏 + 移动端底部抽屉）
- 确认此记录（visitorId 防重复，3 人自动升级）
- 图集、时间线
- 今日一豹
- 数据统计
- 分享名片（4 风格 x 2 比例，含二维码）
- 园区指南（评分、图片、观察记录）
- Hero 动态波浪（三层独立起伏，底部无空隙）
- 彩蛋海豹（30% 概率，点击显示冷知识）
- 知识认证题库
- auth.js 权限工具（getRole/certify/unlockRoot/grantModerator）
- certified cookie 持久化
- root 密码 SHA-256 哈希存储
- 管理员后台（AdminPanel.jsx）：待审核/存疑/操作日志三 tab，含撤回功能

---

## 待完成

- [ ] 设置真实 root 密码（打开 .env.local 填写 VITE_ROOT_PASSWORD_HASH）
- [ ] 录入真实数据，删除测试记录
- [ ] 题库替换为 50 题版本
- [ ] Supabase 建 moderators 表（结构已设计，暂不实现）
- [ ] .gitignore 清理 .claude/ 目录

---

## 技术备忘

- 腾讯云部署路径 /sealbase → vite.config.js 的 base 必须是 '/sealbase/'
- 腾讯云 Node 18 build JSX 报错 → 本地 build dist 推上去（云端构建命令留空）
- 终端 heredoc 写中文 JSX 乱码 → 改用 VSCodium 粘贴
- filesystem MCP 已连接 ~/Desktop/sealbase
- Desktop Commander MCP 已配置（可直接执行终端命令）
- anon key 暴露前端是已知妥协，安全边界在 Supabase RLS
- push 需要 Clash 代理（127.0.0.1:7890）

---

## 架构原则

1. 不会变的硬编码，会变的留接口，不确定的不做
2. 改动影响超过 3 个文件 → 需要抽象一层
3. 权限判断统一调 getRole()，不直接读 cookie
4. 最小化实现，先跑通再扩展

---

## 会话记录

### 2026-03-11 上午
完成筛选器、确认机制、关于页、Hero 波浪、彩蛋海豹、分享图片对齐
解决腾讯云部署问题（本地 build dist 策略）

### 2026-03-11 下午
排查 GitHub 代码未更新（Hero.jsx 新版本未推上）
修复重复确认 bug（visitorId + localStorage）
修复波浪底部空隙（bottom: -12）
修复园区观察记录无法提交（Supabase RLS 缺 insert policy）
修复观察记录不显示（缺 select policy）
讨论权限体系架构

### 2026-03-11 晚上
配置 filesystem MCP + Desktop Commander
实现 src/utils/auth.js 完整权限工具
更新 App.jsx 接入 auth，certified 从 cookie 读取，加 root 隐藏入口
创建 .env.local 存放 root 密码
验证 npm run build 通过（89 modules），已推送

### 2026-03-12 当前会话
**MCP Shell 排查与修复**
- 发现 Claude Desktop 报错 "could not attach to mcp shell"
- 原因：claude_desktop_config.json 中配置了不存在的 npm 包 @modelcontextprotocol/server-shell
- 解决：删除 shell MCP 配置，保留 filesystem + desktop-commander 两个有效 MCP

**网站 404 故障排查（历时较长，记录完整过程）**
- 症状：线上网站打开 404，本地运行正常
- 初步误判：AI 错误地将 vite.config.js 的 base 从 '/sealbase/' 改为 '/'，导致问题加重
- 真实原因：腾讯云部署命令是 `tcb hosting deploy ./dist /sealbase`，文件部署在 /sealbase/ 子目录，因此 base 必须是 '/sealbase/'
- 进一步发现：curl 请求返回 content-disposition: attachment，说明腾讯云把 index.html 当附件返回
- 最终定位：用户访问的是根路径 /，而文件在 /sealbase/，两者不匹配
- 解决：vite.config.js 恢复 base: '/sealbase/'，推送后腾讯云重新部署，网站恢复正常
- 教训：腾讯云部署路径和 vite base 必须保持一致，不能随意修改其中一个
