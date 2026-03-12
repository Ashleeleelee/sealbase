# SEALBASE · AI_CONTEXT.md

> **所有参与本项目的 AI，第一件事就是读这个文件。**
> 读完之后，你就能完全接替之前的 AI 继续工作。
> 每次会话结束，必须更新「当前状态」和「会话记录」两节。
> 最后更新：2026-03-12

---

## 本文件说明

**文件名**：`AI_CONTEXT.md`，位于项目根目录。

**用途**：这是本项目的 AI 工作交接文档。因为每次开启新对话，AI 都会失去上一轮的记忆，所以我们把所有重要上下文、决策、进度、约定都记录在这里，确保任何 AI 接手后都能立刻进入状态。

**如果你是刚接手的 AI**：
1. 完整读完本文件
2. 读 `DEVLOG.md` 了解最近进展
3. 和用户确认本次要做什么
4. 会话结束前，更新本文件的「当前状态」和「会话记录」

**如果你是用户**：请阅读下面这段说明。

---

### 写给使用这个项目的人

你可能已经习惯了这样和 AI 合作：聊天、让它写代码、把代码复制到电脑上运行。这完全没问题，这个项目就是这样开始的。但这里有一个文件（就是你现在看到的这个）可以让你和 AI 的合作变得更顺畅，值得花两分钟了解一下。

---

**AI 没有记忆——这是最重要的事**

每次你开启一个新的对话窗口，AI 就像第一次见到你一样：不知道这个项目叫什么，做到哪里了，上次踩过什么坑，你们之间约定了什么工作方式，甚至不知道你们上次刚刚解决了一个让你头疼了三天的 bug。

如果你每次都要重新解释一遍，不仅麻烦，AI 也容易给出和之前风格不一致的建议，或者重新发明一个你们已经否定过的方案。

这个文件就是为了解决这个问题。它把项目所有重要的背景、决策、约定都记录在这里，AI 读完就能立刻接上，就好像它一直在场一样。

---

**每次开启新对话，只需要做一件事**

在对话开始时告诉 AI：

> 「请先读 `~/Desktop/sealbase/AI_CONTEXT.md`，然后我们继续开发。」

然后再说你今天想做什么就行了。不需要重新介绍项目，不需要解释技术栈，不需要再说一遍「记得用 inline style」——文件里都有。

如果 AI 有读取本地文件的能力（见下方 MCP 说明），它会直接去读。如果它说「我没有办法访问你的文件」，就把这个文件的全部内容复制粘贴给它，效果是一样的。

---

**什么是 MCP？什么是 Agent？**

你不需要深入了解这些概念，但知道大致意思会让你用起来更顺手。

**MCP**（Model Context Protocol）是一种让 AI 能直接操作你电脑的工具协议。这个项目已经配置好了两个：
- **filesystem MCP**：让 AI 可以直接读写 `~/Desktop/sealbase` 里的代码文件，不需要你复制粘贴
- **Desktop Commander**：让 AI 可以在你的终端里执行命令，比如 `npm run build`、`git commit` 等

**Agent 模式**是指 AI 不只是回答你的问题，而是真正「动手」完成任务——读文件、改代码、执行命令、验证结果，一步一步做完。配置好 MCP 之后，这个项目的 AI 就可以以 agent 模式工作。

实际体验是这样的：你说「把首页标题字体改大一点」，AI 会自己打开 Hero.jsx 看一眼，改好，告诉你改了什么。你说「你来」，它就真的动手，而不只是给你一段代码让你自己贴。

这是目前 AI 工具里比较前沿的使用方式，很多人还不知道可以这样用。

---

**和 AI 合作的实用建议**

**说结果，不说步骤。**
「我想在个体详情页加一个「最后目击时间」字段」比「帮我在 SealDetail.jsx 的第 42 行加一个 div」要好得多。你描述想要什么，让 AI 决定怎么做。

**报错直接粘贴给它。**
代码跑不起来？把终端里的报错完整复制给 AI，它会自己分析和修。不需要你先理解报错是什么意思。

**不确定方向时，先聊再动手。**
「这个功能你觉得怎么做比较合适？」「有几种方案，各有什么优缺点？」先讨论清楚，再说「好，你来做」。这样比让它直接动手、结果不对再返工要省时间得多。

**控制节奏。**
AI 有时候会很积极地一次做很多事。如果你只是想聊聊想法，就说「先别写代码，我们讨论一下」。如果你想一步一步来，就说「先只改这一个地方，其他的等我确认再说」。

**它会犯错，这很正常。**
AI 不是万能的，有时候会改出新 bug，或者理解错你的意思。发现不对就直接说，它会调整。这个项目的代码都在 git 里，随时可以回退，不用担心改坏了就回不去。

**新的 AI 不按约定来怎么办？**
这个文件的第 0 节记录了你们之前谈好的合作方式（比如「先说明再动手」「不主动 push」）。如果新的 AI 忘了或者没读到，直接告诉它：「读一下 AI_CONTEXT.md 的第 0 节」就行。

---

**这个文件本身也需要维护**

每次有重要的开发进展、新的决定、踩过的坑，AI 都应该更新这个文件。文件越准确，下一次开启对话就越省事。

如果你发现文件里有过时的信息，或者有什么重要的事情没记录进去，直接告诉 AI「更新一下 AI_CONTEXT」就行。

---

## 0. 核心约定（先读这个）

**开发协作方式**：
- 默认先向用户说明「需要做什么、为什么、具体步骤」
- 等用户说「你来」再动手操作文件或执行命令
- 用户自己操作时，给清晰的指令（命令行或 VSCodium 操作步骤）

**不能改的事情**：
- 样式全部用 inline style，不引入 CSS 框架
- 权限判断统一调 `getRole()`，不直接读 cookie 或 sessionStorage
- 部署必须本地 build，不能依赖腾讯云自动 build（Node 18 报错）
- **不能主动 push**：改完文件只 commit 到本地，等用户说「可以推了」再执行 git push

---

## 1. 项目基本信息

| 项目 | 内容 |
|------|------|
| 名称 | 中国圈养斑海豹档案库（Sealbase） |
| 性质 | 个人发起的社区项目，与任何官方机构无关 |
| 情感核心 | 让每一只都被看见、被记录、被了解 |
| 灵感来源 | 海外 Ceta-Base（圈养鲸豚数据库） |
| 线上地址 | https://sealbase-7gxn9kdfc7300414-1409601065.tcloudbaseapp.com/sealbase/ |
| GitHub | https://github.com/Ashleeleelee/sealbase |
| 本地路径 | ~/Desktop/sealbase |
| 联系邮箱 | 见 `src/components/App.jsx` 关于页（不记录在此） |

---

## 2. 技术栈与环境

- **前端**：React + Vite（纯 inline style，无 CSS 框架）
- **数据库**：Supabase（PostgreSQL + Storage）
- **托管**：腾讯云 CloudBase 静态托管
- **字体**：Google Fonts（Noto Serif SC + Noto Sans SC）
- **本地开发**：`cd ~/Desktop/sealbase && npm run dev`
- **MCP 工具**：
  - filesystem MCP → 直接读写 `~/Desktop/sealbase`
  - Desktop Commander → 执行终端命令

### 部署流程（每次都要这样）
```bash
cd ~/Desktop/sealbase && npm run build && git add . && git commit -m "说明" && git push origin main
```

> ⚠️ 注意：腾讯云配置「安装命令 `npm install`，构建命令留空，部署目录 `dist`」。
> 本地 build dist 推上去，云端直接部署，不执行 build。

### 文件替换方式
终端 heredoc 写含中文的 JSX 会乱码。改用 VSCodium：打开文件 → Cmd+A → Delete → 粘贴新内容 → Cmd+S。

---

## 3. Supabase 配置

```
URL 和 Anon Key：见 src/lib/supabase.js（AI 需要时直接读该文件）
Storage bucket：seal-images（PUBLIC）
```

> anon key 暴露在前端是已知妥协，安全边界在 Supabase RLS，不要为此纠结。

### seals 表
```sql
id            bigserial PRIMARY KEY
created_at    timestamptz DEFAULT now()
name          text
sex           text          -- "雌" | "雄"
facility      text
city          text
province      text
status        text          -- 见下方状态枚举
data_quality  text          -- 见下方质量枚举
source        text
arrived_year  int2
notes         text
release_date  text
release_location text
images        text[]        -- Supabase Storage 公开 URL 数组
source_ref    text
confirmations int2 DEFAULT 0
```

**status 枚举**：`圈养展示` | `救助中·待放归` | `已放归` | `繁育中`

**data_quality 枚举**：`待核实` | `已核实（官方报道）` | `存疑`

### facility_observations 表
```sql
id              bigserial PRIMARY KEY
created_at      timestamptz DEFAULT now()
facility        text
seal_count      int2
score_water     int2    -- 1-5 星
score_space     int2
score_condition int2
notes           text
images          text[]
```

### RLS 策略（已配置完毕）
- seals：anon 可 SELECT、INSERT、UPDATE（confirmations 字段）
- facility_observations：anon 可 SELECT、INSERT

---

## 4. 设计规范

```js
// src/utils/tokens.js — 引入：import T from "../utils/tokens"
T.navy      = "#0D1B2A"   // Hero/Nav/Footer 背景
T.teal      = "#0891B2"   // 主色，按钮/链接/强调
T.tealPale  = "#E0F2FE"   // teal 浅色背景
T.bg        = "#F8FAFC"   // 页面背景
T.ink       = "#0F172A"   // 标题
T.body      = "#334155"   // 正文
T.muted     = "#64748B"   // 次要文字
T.faint     = "#94A3B8"   // 占位/标签
T.border    = "#E2E8F0"   // 边框
T.green     = "#059669"   // 已核实/成功
T.greenPale = "#ECFDF5"
T.amber     = "#D97706"   // 待核实/警告
T.amberPale = "#FFFBEB"
T.red       = "#DC2626"   // 存疑/错误
```

---

## 5. 文件结构

```
src/
├── main.jsx
├── index.css
├── App.jsx                      ← 主应用：路由、全局状态、权限入口
├── lib/supabase.js              ← Supabase 客户端
├── utils/
│   ├── tokens.js                ← 设计 token
│   ├── auth.js                  ← 权限工具（见第6节）
│   └── statusConfig.js
├── data/
│   └── quizBank.js              ← 知识认证题库（15题，目前较少）
└── components/
    ├── Nav.jsx                  ← 顶部导航（sticky，移动端汉堡菜单）
    ├── Hero.jsx                 ← 首页大图（动态波浪+彩蛋海豹）
    ├── StatsStrip.jsx           ← 统计条
    ├── SealRow.jsx              ← 表格行（桌面）
    ├── SealDetail.jsx           ← 个体详情（桌面侧边栏 + 移动端底部抽屉）
    ├── SealDrawer.jsx
    ├── SealCard.jsx
    ├── Badges.jsx               ← StatusPill, QualityBadge, FieldRow 组件
    ├── ImageGallery.jsx         ← 图集展示
    ├── Timeline.jsx             ← 历史时间线
    ├── ContributeModal.jsx      ← 提交新个体弹窗
    ├── FacilityDetail.jsx       ← 园区详情（含观察记录汇总）
    ├── FacilityObserveModal.jsx ← 提交园区观察记录（星级评分+图片上传）
    ├── DailyModal.jsx           ← 今日一豹
    ├── QuizModal.jsx            ← 知识认证（随机抽 3 题）
    ├── ShareModal.jsx           ← 分享名片（4种风格×2种比例）
    ├── SpeciesPanel.jsx         ← 关于页侧边物种介绍
    ├── StatsCharts.jsx          ← 统计图表（园区页）
    └── SupplementModal.jsx
```

---

## 6. 权限体系（src/utils/auth.js）

### 角色层级
```
guest（只读，未认证）
  ↓ 通过知识答题
certified（可贡献数据，可核实记录）
  ↓ 预留，暂不实现业务逻辑
moderator（审核员）
  ↓ root 在管理后台授予
root（你，唯一最高管理员）
```

### 存储机制
| 角色 | 存储 | 说明 |
|------|------|------|
| certified/moderator | cookie `sealbase_role`，180天 | 刷新不丢失 |
| root | sessionStorage `sealbase_root` | 关浏览器自动失效 |

### 公开 API
```js
getRole()        // 返回 "root" | "moderator" | "certified" | "guest"
isRoot()
isModerator()    // root 或 moderator 返回 true
isCertified()    // root/moderator/certified 均返回 true
isGuest()
certify()        // 答题通过后调用，写 cookie
unlockRoot()     // root 解锁（密码验证在调用方完成）
grantModerator() // 颁发 moderator（由 root 调用）
clearRole()      // 登出，清除 cookie 和 sessionStorage
```

### root 解锁方式
关于页底部版本号 `v0.1.0-beta`，连续点击 **5 次**，弹出密码框。
密码存在 `.env.local`（已加入 .gitignore，不会被推送）：
```
VITE_ROOT_PASSWORD=用户自己设置的密码
```

> ⚠️ 用户目前还没有设置真实密码，这是待完成事项之一。

### 防重复确认
- visitorId 存 localStorage `sealbase_visitor_id`（首次访问自动生成）
- 每条记录确认后写 `confirmed_{seal.id}` 到 localStorage
- App.jsx `handleConfirm()` 中实现，确认前先检查

---

## 7. 核心功能说明

### 数据可信度体系
| 等级 | 触发条件 | 展示样式 |
|------|----------|----------|
| 待核实 | 默认 | 琥珀色警告 |
| 已核实（官方报道）| confirmations >= 3 自动升级，或人工设置 | 绿色通过 |
| 存疑 | 人工标记 | 红色警告 |

### Hero 彩蛋海豹（Hero.jsx）
- 30% 概率出现（`Math.random() > 0.3` 时不出现）
- 1.8s 延迟后浮现，animation: sealBob 上下起伏
- 点击弹出随机冷知识气泡（约 60 条，SEAL_FACTS 数组）
- 气泡有「知道了 👋」按钮，点击关闭并隐藏海豹
- bottom: -12 确保波浪底部无空隙

### 动态波浪（Hero.jsx）
- 三层 SVG 波浪，各自独立动画（5s/4s/3s），position: absolute, bottom: -12
- 最终效果：Hero 底部与页面背景无缝衔接，无白色空隙

### 知识认证（QuizModal.jsx + quizBank.js）
- 每次从题库随机抽 3 题（`sampleQuiz()`）
- 全部答对 → 调用 `certify()` → 写 cookie → 解锁贡献功能
- 当前题库只有 15 题，待替换为 50 题版本

### 园区观察记录（FacilityObserveModal.jsx）
- 字段：目测数量（必填）+ 水质/空间/状态三项评分（星级，可选）+ 图片 + 文字
- 图片上传到 Supabase Storage `seal-images` bucket
- 提交到 `facility_observations` 表

---

## 8. App.jsx 关键逻辑

```js
// 状态
const [certified, setCertified] = useState(() => isCertified());  // 从 cookie 读取
const [role, setRole] = useState(() => getRole());

// 答题通过回调
onPass={() => {
  certify();           // 写 cookie
  setCertified(true);
  setRole(getRole());
  setShowQuiz(false);
  setShowContribute(true);
}}

// 确认记录（防重复逻辑在 handleConfirm 里）
const handleConfirm = async (seal) => {
  const confirmedKey = `confirmed_${seal.id}`;
  if (localStorage.getItem(confirmedKey)) {
    pushToast("你已经确认过这条记录了");
    return;
  }
  // ... 更新 Supabase，写 localStorage
}

// 视图：records | facilities | about
// 移动端：isMobile = window.innerWidth < 768，监听 resize
```

---

## 9. 当前状态（每次会话后更新）

**最近一次 build**：✅ 通过（90 modules），已推送

**线上功能**：全部正常（Hero 波浪、彩蛋、权限系统、园区观察记录、管理员后台）

**数据库**：冷启动阶段，有少量测试记录。seals 表已补 UPDATE policy，admin_logs 表已建。

---

## 10. 待完成事项

| 优先级 | 任务 | 说明 |
|--------|------|------|
| 🔴 高 | 设置 root 密码 | 打开 `.env.local`，填写真实密码 |
| 🔴 高 | 录入真实数据 | 删除测试记录，录入 20-30 条有图有据的真实个体 |
| 🟡 中 | 题库替换为 50 题 | 替换 `src/data/quizBank.js` |
| 🟡 中 | root 管理后台 | 目前 root 解锁后只有 alert，需要实际管理页面（最小：待核实列表 + 通过/存疑按钮） |
| 🟢 低 | .gitignore 清理 | `.claude/` 目录被误提交，加入 .gitignore 后清理 |
| 🟢 低 | moderator 业务逻辑 | 角色已预留，未实现实际功能 |
| 🟢 低 | 园区认领机制 | 设计中，待实现 |

---

## 11. 社区生态设想（长期）

- **爱好者**：浏览、贡献数据、核实记录
- **资深爱好者/审核员**：标记存疑，协助审核
- **园区负责人**：认领本园区 → 获官方认证徽章 → 激励维护数据准确性（吸引官方合作的关键）
- **冷启动策略**：先有高质量数据比先拉用户更重要

---

## 12. 会话历史摘要

### 2026-03-11 上午
完成：筛选器（性别/状态/省份）、搜索框、确认机制、关于页、Hero 动态三层波浪、彩蛋海豹（60条冷知识文案）、分享名片图片左对齐修复（objectPosition: "left center"）。
解决：腾讯云 Node 18 build 报错 → 本地 build dist 方案。

### 2026-03-11 下午
排查：Hero.jsx 新版本没推上 GitHub（用 git ls-files 确认问题）。
修复：波浪底部白色空隙（bottom: -12 覆盖缝隙）。
修复：园区观察记录无法提交（Supabase 缺 INSERT policy）。
修复：观察记录不显示（缺 SELECT policy）。
讨论：权限体系架构，确定最小化三层方案（guest/certified/root，moderator 预留）。

### 2026-03-11 晚上
配置：filesystem MCP + Desktop Commander（用 `@wonderwhy-er/desktop-commander`，`npx @wonderwhy-er/desktop-commander@latest setup`）。
实现：`src/utils/auth.js` 完整权限工具。
更新：`App.jsx` 接入 auth，certified 从 cookie 读取，root 解锁隐藏入口（版本号点5次+密码）。
创建：`.env.local` 存储 root 密码（待用户填写真实值）。
验证：`npm run build` 通过（89 modules），已推送 GitHub。
注意：`.claude/` 目录被误 add 到 git，下次清理。

### 2026-03-12 当前会话
重读所有源文件，写成完整交接文档 AI_CONTEXT.md（原 HANDOFF.md 改名）。
移除私人信息：邮箱改为引用源文件，Supabase key 改为引用 supabase.js。
补充「不主动 push」约定。
扩写「写给使用这个项目的人」一节，加入 MCP/Agent 概念解释和合作建议。
修复确认机制：Supabase seals 表缺 UPDATE policy，导致 confirmations 静默失败；手动在控制台添加后修复。
root 密码改为 SHA-256 哈希存储（VITE_ROOT_PASSWORD_HASH），验证用 Web Crypto API 在浏览器本地完成。
新增管理员后台（AdminPanel.jsx）：Nav 显示红色「🔐 管理员模式」标识，view="admin" 页面含待审核/存疑/操作日志三个 tab，每次操作写入 admin_logs 表，支持撤回。
Supabase 新建 admin_logs 表（id, action, target_id, target_name, before, after, note）。
确认 push 需带 Clash 代理命令，已记入附录。

---

## 【临时交接】下一个 AI 请读这里（读完可删）

### 本次会话做了什么

1. **修复 confirmations 不写入问题**
   - 根本原因：Supabase `seals` 表只有 SELECT/INSERT policy，缺 UPDATE policy
   - 解决方式：用户在 Supabase 控制台手动添加 UPDATE policy（USING: true, WITH CHECK: true）
   - 代码逻辑本身没问题，不需要改
   - 注意：`facility_observations` 表同样只有 INSERT/SELECT，如将来需要 UPDATE 也要补

2. **root 密码改为哈希存储**
   - `.env.local` 变量名从 `VITE_ROOT_PASSWORD` 改为 `VITE_ROOT_PASSWORD_HASH`
   - 存的是 SHA-256 哈希值（明文密码用户自己知道，不记录在此）
   - `App.jsx` 关于页 root 入口的验证逻辑：用户输入 → `crypto.subtle.digest("SHA-256")` → 比对哈希
   - 回调函数加了 `async`，用 `await` 等待哈希计算

3. **新增管理员后台**
   - 新文件：`src/components/AdminPanel.jsx`
   - `Nav.jsx` 接收新 prop `role`，root 登录后显示红色「🔐 管理员模式」按钮
   - `App.jsx` 新增 `view="admin"` 分支，渲染 `<AdminPanel>`
   - AdminPanel 三个 tab：待审核（data_quality=待核实）/ 存疑记录 / 操作日志
   - 每次操作（修改 data_quality）写一条 `admin_logs` 记录，含 before/after jsonb
   - 操作日志里有「↩ 撤回」按钮，读取 before 恢复原值，再写一条 action="revert" 日志
   - `onSealUpdate(id, patch)` 回调同步更新 App.jsx 里的 seals state 和 selected state

4. **Supabase admin_logs 表**（用户已在控制台建好）
   ```sql
   id bigserial primary key
   created_at timestamptz default now()
   action text          -- "update_quality" | "revert"
   target_id bigint
   target_name text
   before jsonb
   after jsonb
   note text
   ```
   RLS：anon 可 SELECT 和 INSERT

5. **push 方式确认**
   - 用户使用 Clash 代理，push 前必须设置代理环境变量
   - AI 以后执行 push 时直接带上，不需要再问用户

### 下一步用户可能想做的事（根据对话推断）

- 录入真实斑海豹数据（删除测试记录）
- 扩充题库到 50 题（替换 `src/data/quizBank.js`）
- 完善 AdminPanel：目前只能改 data_quality，将来可能要加删除个体功能
- 测试确认机制是否真正修好（需要真实数据）

### 注意事项

- `App.jsx` 里 root 解锁入口的 onClick 是一个 IIFE 返回的 `async` 函数，闭包里有 `count` 计数器，改这里要小心不要破坏闭包结构
- AdminPanel 的 `onSealUpdate` 同时更新 `seals` 数组和 `selected` state，如果将来加删除功能，需要同时从两处清除
- build 后 dist 目录的 js 文件名会变（content hash），git commit 时会看到 rename，这是正常的

---

## 附：常用命令速查

```bash
# 本地开发
cd ~/Desktop/sealbase && npm run dev

# build + 推送（带 Clash 代理，否则 push 可能失败）
export https_proxy=http://127.0.0.1:7890 && export http_proxy=http://127.0.0.1:7890 && export all_proxy=socks5://127.0.0.1:7890
cd ~/Desktop/sealbase && npm run build && git add . && git commit -m "描述" && git push origin main

# 查看 git 状态
cd ~/Desktop/sealbase && git status

# 查看已追踪文件
cd ~/Desktop/sealbase && git ls-files | grep Hero
```
