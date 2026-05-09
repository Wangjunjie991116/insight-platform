# Insight 洞察分析平台（insight-platform）

[insight-x](../insight-x) AI Agent 数据分析平台的 Web 控制台，让业务分析师、产品经理、数据工程师通过浏览器完成"数据源配置 → 任务触发 → 洞察解读 → 代码审计"的完整链路。

## 技术栈

| 类别 | 选型 |
|---|---|
| 运行时 | Node.js **24.15.0**（`.nvmrc`） |
| 包管理 | pnpm **10.10.0**（`packageManager`，强制 corepack） |
| 框架 | React 18 + **Vite 8** + TypeScript 5 |
| UI | **Ant Design 6**（`6.3.7+`） |
| 图表 | **echarts 5 + echarts-for-react** |
| 状态 | Zustand（UI 状态，不做 API 缓存） |
| 请求 | axios + ahooks useRequest |
| 路由 | React Router 6 |
| Mock | MSW（开发期拦截 `/api/v1/*`） |
| 样式 | Sass（SCSS）+ CSS Modules + Design Token CSS 变量 |
| 文案 | 直接写死简体中文，不引入 i18n 框架 |

> 未使用 `@ant-design/pro-components`：其 peer 尚未升到 antd 6，用 antd 6 原生 Layout/Table 组件替代。

## 架构概览

```
┌──────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   浏览器 SPA     │────▶│   insight-x      │────▶│  数据源      │
│   (本项目)       │◀────│   FastAPI 后端    │◀────│  PG/MySQL/   │
│   React 18       │     │   AI Agent 引擎   │     │  CH/BQ      │
└──────────────────┘     └──────────────────┘     └─────────────┘
```

详细架构图、时序图、业务流转见 [docs/introduce/](docs/introduce/)。

## 环境要求

- Node.js `>= 24.15.0`
- pnpm `= 10.10.0`（禁止 npm/yarn，已在 `package.json#packageManager` 锁定）
- 浏览器：Chrome ≥ 100 / Safari ≥ 15.4 / Firefox ≥ 102（需要 `backdrop-filter`）

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `VITE_API_BASE_URL` | `/api/v1` | API 基础路径 |
| `VITE_ENABLE_MOCK` | `true` | 开发环境是否启用 MSW 拦截 |
| `VITE_APP_TITLE` | `Insight 洞察分析平台` | 页面标题 |

## 快速开始

```bash
# 统一 Node 版本
nvm use            # 自动读取 .nvmrc

# 启用 corepack 指定 pnpm 版本
corepack enable
corepack use pnpm@10.10.0

# 安装依赖
pnpm install --frozen-lockfile

# 首次运行前生成 MSW 的 service worker（写入 public/）
pnpm msw:init

# 启动开发服务器（默认启用 MSW mock）
pnpm dev

# 切换到真实后端（本地 insight-x:8000）
VITE_ENABLE_MOCK=false pnpm dev
```

访问 `http://localhost:5173`。

## 常用脚本

| 命令 | 作用 |
|---|---|
| `pnpm dev` | 启动 Vite 开发服务器 |
| `pnpm build` | 类型检查 + 生产构建 |
| `pnpm preview` | 预览构建产物 |
| `pnpm typecheck` | 仅类型检查 |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm stylelint` | SCSS lint |
| `pnpm format` | Prettier 格式化 |

## 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/overview` | 概览 | KPI 卡片、任务趋势、状态分布、最近任务 |
| `/tasks` | 任务列表 | 表格展示、状态筛选、关键词搜索、重跑 |
| `/tasks/new` | 新建任务 | 三步向导：选数据源 → 写目标 → 确认提交 |
| `/tasks/:id` | 任务详情 | 元信息、五步管线进度、洞察/数据/计划/代码/结果/日志 |
| `/datasources` | 数据源管理 | 卡片列表、新建/编辑/删除/测试连接 |
| `/insights` | 洞察聚合 | 按业务目标分组展示所有已完成任务的洞察 |
| `/settings` | 设置 | 团队切换、主题选择、API 健康状态、关于 |

## 目录结构

```
insight-platform/
├── .nvmrc                     Node 版本锁定 (24.15.0)
├── package.json               pnpm 版本、依赖、scripts
├── vite.config.ts             alias / sass 预注入 / proxy / chunk 分割
├── tsconfig.json              strict + paths + noUnused
├── index.html                 <meta theme-color> 跟随主色
├── docs/
│   └── introduce/             业务文档
│       ├── architecture.md    系统架构图
│       ├── sequence.md        时序图
│       └── business-flow.md   业务流转
├── public/
│   ├── favicon.svg            品牌图标（SVG 渐变）
│   └── mockServiceWorker.js   (pnpm msw:init 生成)
├── src/
│   ├── main.tsx               应用入口 + MSW 条件启动
│   ├── App.tsx                根组件（BrowserRouter + 懒加载路由）
│   ├── api/
│   │   ├── types.ts           全部 API 类型定义
│   │   ├── client.ts          Axios 实例 + 拦截器（X-Team-Id / 错误通知）
│   │   ├── tasks.ts           任务 CRUD + 运行 + 结果 API
│   │   └── datasources.ts     数据源 CRUD + 测试连接 API
│   ├── components/            通用组件（每个组件独立文件夹）
│   │   ├── CodeViewer/        代码高亮查看器
│   │   ├── ConfidenceRing/    置信度环形进度
│   │   ├── DataDictView/      数据字典视图
│   │   ├── EmptyState/        空态占位
│   │   ├── GlassCard/         玻璃态卡片
│   │   ├── JsonTree/          JSON 树查看器
│   │   ├── PageHeader/        页面标题栏
│   │   ├── StepProgress/      纵向步骤进度
│   │   ├── TeamSwitcher/      团队切换下拉
│   │   ├── ThemedChart/       主题感知 ECharts 封装
│   │   ├── ThemeSwitcher/     主题切换下拉
│   │   └── echartsCore.ts     ECharts 按需注册（工具文件）
│   ├── layouts/
│   │   └── AppLayout/         顶栏 + 侧栏 + 内容区
│   ├── pages/
│   │   ├── overview/          概览页
│   │   ├── tasks/             任务列表页
│   │   ├── new/               新建任务页
│   │   ├── detail/            任务详情页
│   │   ├── datasources/       数据源管理页
│   │   ├── insights/          洞察聚合页
│   │   └── settings/          设置页
│   ├── router/
│   │   └── routes.tsx         路由定义 + 常量
│   ├── store/
│   │   ├── themeStore.ts      activeThemeId + localStorage 持久化
│   │   └── teamStore.ts       activeTeamId + teams + localStorage 持久化
│   ├── theme/
│   │   ├── tokens/            四套主题 Token
│   │   │   ├── sunrise.ts     晨曦（琥珀橙，浅色）
│   │   │   ├── aurora.ts      极光（靛蓝紫，浅色）← 默认
│   │   │   ├── midnight.ts    子夜（金色，深色）
│   │   │   ├── forest.ts      林语（翡翠绿，浅色）
│   │   │   ├── types.ts       ThemeId / SeedTokens / MapTokens / AliasTokens
│   │   │   └── index.ts       注册表 + DEFAULT_THEME_ID + getTheme()
│   │   ├── ThemeProvider.tsx   订阅 store → CSS 变量 + ConfigProvider + ECharts
│   │   ├── toAntdToken.ts     ThemeToken → Antd ThemeConfig
│   │   ├── toCssVars.ts       ThemeToken → :root CSS 变量
│   │   └── toEchartsTheme.ts  ThemeToken → echarts registerTheme
│   ├── styles/
│   │   ├── _tokens.scss       SCSS 门面（var(--ix-*) 函数）
│   │   ├── _mixins.scss       glass / hover-lift / gradient-text / 滚动条
│   │   └── global.scss        CSS reset + Antd 透明化
│   └── mocks/
│       ├── browser.ts         MSW setupWorker
│       ├── handlers/          tasks / datasources 路由拦截
│       └── fixtures/          静态 mock 数据（含状态自动流转）
└── openspec/                  变更管理
```

## Design Token 与主题切换

> 默认主题为 **aurora（极光）**，首次加载无 localStorage 偏好时自动生效。

本项目使用三层 Design Token，支持运行时一键切换，四路生效：

```
ThemeToken (TS)                          seed / map / alias / shape
      │
      ├─> toAntdToken()    → Antd ConfigProvider.theme
      ├─> toCssVars()      → :root 上的 --ix-* CSS 变量（SCSS 消费）
      └─> toEchartsTheme() → echarts.registerTheme(insight-active)
                                │
                         ThemedChart key=activeThemeId 触发重建
```

### 切换主题

```tsx
import { useThemeStore } from '@/store/themeStore'
const setActiveThemeId = useThemeStore((s) => s.setActiveThemeId)
setActiveThemeId('midnight')  // 300ms 内整站切换
```

### 新增主题

1. 在 `src/theme/tokens/` 新增 `xxx.ts`，导出 `ThemeToken`（结构必须完整，TS 会报错）
2. 在 `src/theme/tokens/index.ts` 注册到 `themeRegistry` 与 `THEME_IDS`
3. 扩展 `ThemeId` 联合类型

### 新增颜色/间距

- **禁止**在 `.scss` 或组件内写 `#xxx` / 魔法数值
- 在 `types.ts` 加字段 → 四套主题同时补值 → 通过 `_tokens.scss` 的 `@function` 暴露 → 组件 `@use` 调用

## 开发约定

- **中文注释**：业务模块中文注释，函数/流程边界必填
- **Git**：分支名 `feat/<short>` / `fix/<short>`
- **Commit**：尽量跑 `pnpm lint && pnpm typecheck` 后再提交
- **组件结构**：每个组件一个文件夹 `ComponentName/index.tsx` + `index.module.scss`

## 文档

| 文档 | 说明 |
|------|------|
| [架构图](docs/introduce/architecture.md) | 系统三层架构、前端内部架构、主题管线、数据流 |
| [时序图](docs/introduce/sequence.md) | 任务创建、执行管线、数据源管理、主题切换 |
| [业务流转](docs/introduce/business-flow.md) | 用户角色、端到端流程、状态机、数据模型 |

## 变更管理

所有能力级变更走 [OpenSpec](https://github.com/openspec-io/openspec)：

```bash
openspec list              # 查看变更
openspec status            # 当前进度
openspec validate          # 校验 spec
```

## License

MIT
