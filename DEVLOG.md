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
cd ~/Desktop/sealbase && npm run build && git add . && git commit -m "..." && git push origin main
```
注意：腾讯云不能自己 build，必须推 dist，否则会用旧代码重新构建

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
- 密码存 .env.local（不被 git 追踪）：VITE_ROOT_PASSWORD=你的密码

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
- 彩蛋海豹（15% 概率，点击显示冷知识）
- 知识认证题库
- auth.js 权限工具（getRole/certify/unlockRoot/grantModerator）
- certified cookie 持久化

---

## 待完成

- [ ] npm run build 验证 auth.js 无报错
- [ ] .env.local 设置真实 root 密码
- [ ] root 管理后台（目前只有 alert）
- [ ] 题库替换为 50 题版本
- [ ] 录入真实数据，删除测试记录
- [ ] Supabase 建 moderators 表（结构已设计，暂不实现）

---

## 技术备忘

- 腾讯云 Node 18 build JSX 报错 → 本地 build dist 推上去
- 终端 heredoc 写中文 JSX 乱码 → 改用 VSCodium 粘贴
- filesystem MCP 已连接 ~/Desktop/sealbase
- anon key 暴露前端是已知妥协，安全边界在 Supabase RLS

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
配置 filesystem MCP，Claude 可直接读写本地代码
讨论权限最小化实现，确定三层架构
写入 src/utils/auth.js
更新 App.jsx 接入 auth，certified 从 cookie 读取，加 root 隐藏入口
创建 .env.local 存放 root 密码
待验证：npm run build 确认无报错后推线上
