# Insight 洞察分析平台（insight-platform）

[insight-x](../insight-x) AI Agent 数据分析平台的 Web 控制台，让业务分析师、产品经理、数据工程师通过浏览器完成"数据源配置 → 任务触发 → 洞察解读 → 代码审计"的完整链路。

## 技术栈

| 类别 | 选型 |
|---|---|
| 运行时 | Node.js **24.15.0**（`.nvmrc`） |
| 包管理 | pnpm **10.10.0**（`packageManager`，强制 corepack） |
| 框架 | React 18 + **Vite 8** + TypeScript 5 |
| UI | **Ant Design 6**（`6.3.7+`） |
| 图表 | **echarts 5 + echarts-for-react**（放弃 antd/charts，原因见 `openspec/changes/add-web-platform-mvp/design.md`） |
| 状态 | Zustand（UI 状态，不做 API 缓存） |
| 请求 | axios + ahooks useRequest |
| 路由 | React Router 6 |
| Mock | MSW（开发期拦截 `/api/v1/*`） |
| 样式 | Sass（SCSS）+ CSS Modules + Design Token CSS 变量 |
| 文案 | 直接写死简体中文，不引入 i18n 框架 |

> 未使用 `@ant-design/pro-components`：其 peer 尚未升到 antd 6，用 antd 6 原生 Layout/Table 组件替代。

## 环境要求

- Node.js `>= 24.15.0`
- pnpm `= 10.10.0`（禁止 npm/yarn，已在 `package.json#packageManager` 锁定）
- 浏览器：Chrome ≥ 100 / Safari ≥ 15.4 / Firefox ≥ 102（需要 `backdrop-filter`）

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

# 启动开发服务器（默认启用 MSW mock，VITE_ENABLE_MOCK=true）
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

## 目录结构

```
insight-platform/
├── .nvmrc                 Node 版本锁定
├── package.json           pnpm 版本、依赖、scripts
├── vite.config.ts         alias / sass 预注入 / proxy 配置
├── tsconfig.json          strict + paths
├── index.html             <meta theme-color> 跟随主色
├── public/
│   ├── favicon.svg        品牌图标（SVG 渐变）
│   └── mockServiceWorker.js (pnpm msw:init 生成)
├── src/
│   ├── main.tsx           应用入口 + MSW 条件启动
│   ├── App.tsx            根组件（MVP 占位自检页）
│   ├── theme/
│   │   ├── tokens/        四套主题（sunrise/aurora/midnight/forest）+ 类型
│   │   ├── ThemeProvider  订阅 store 注入 Antd + CSS 变量 + echarts 主题
│   │   ├── toAntdToken    ThemeToken → Antd ThemeConfig
│   │   ├── toCssVars      ThemeToken → CSS 变量 :root 注入
│   │   └── toEchartsTheme ThemeToken → echarts theme JSON
│   ├── components/
│   │   ├── ThemedChart    主题感知的 ECharts 封装
│   │   └── echartsCore    按需注册 echarts 组件与图表类型
│   ├── store/
│   │   └── themeStore     activeThemeId + localStorage 持久化
│   ├── styles/
│   │   ├── _tokens.scss   SCSS 门面（只调用 var(--ix-*)）
│   │   ├── _mixins.scss   glass / hover-lift / gradient-text / 滚动条
│   │   └── global.scss    CSS reset + Antd 透明化
│   ├── api/ (§3 将加入)
│   ├── mocks/ (§3 将加入)
│   ├── router/ (§4 将加入)
│   ├── layouts/ (§4 将加入)
│   └── pages/ (§6-§13 将加入)
└── openspec/              变更管理（见 openspec/changes/add-web-platform-mvp/）
```

## Design Token 与主题切换

本项目使用三层 Design Token，支持运行时一键切主题，机制同源但分四路生效：

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
setActiveThemeId('aurora')  // 300ms 内整站切换
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

## 变更管理

所有能力级变更走 [OpenSpec](https://github.com/openspec-io/openspec)：

```bash
openspec list              # 查看变更
openspec status            # 当前进度
openspec validate          # 校验 spec
```

当前 MVP 变更：`openspec/changes/add-web-platform-mvp/`

## License

MIT
