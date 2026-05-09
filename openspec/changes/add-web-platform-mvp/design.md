# Design: insight-platform MVP Web 控制台

## Context

insight-x 已实现五步 Agent 流水线（数据理解 → 策略 → 代码生成 → 沙箱执行 → 洞察生成），暴露 REST API。业务方当前需通过 Swagger / curl 使用，缺可视化入口。本项目新建前端工程作为 Web 控制台，目标是让非工程角色也能独立跑完分析并理解结论。

**约束：**
- 后端 OpenAPI 契约稳定，前端不要求后端调整（MVP 范围）。
- 团队要求 Node 24.15.0 / pnpm 10.10.0 统一环境。
- 首套主题为黄橙风，同时要为"一键换肤"留足机制。

**关键干系人：**
- 业务分析师（主用户，跑任务 → 看洞察）
- 数据工程师（审计 SQL / Python）
- 平台 owner（本次设计决策者）

## Goals / Non-Goals

**Goals:**
- 精瘦但闭环：任务 CRUD + 五步进度 + 洞察展示三件套可用
- 主题 token 体系完整（即使首期只落地一套），Antd + echarts + 自定义样式三路同源
- 代码/样式规范清晰，方便后续新增页面不破坏地基
- 开发期零后端依赖（MSW mock 全链路）

**Non-Goals:**
- Agent 6/7、计费、SQL IDE、对话式入口
- TanStack Query / SWR 等请求缓存
- SSR / PWA / 多主题全部落地
- 权限体系（仅留 team_id 上下文钩子）

## Decisions

### D1. 图表库：echarts 5 + echarts-for-react（非 @ant-design/charts）

- **为什么**：项目需要黄橙渐变 + 玻璃态 + 高自定义图表。echarts option 对象可直接表达渐变填充、阴影、发光、混合系列；`echarts.registerTheme(name, themeJson)` 可运行时按 token 重建主题。@ant-design/charts（基于 G2Plot）在这些维度绕路成本高。
- **对比**：@ant-design/charts 胜在上手速度和 Antd 视觉默契，但天花板较低。
- **落地**：封装 `<ThemedChart option={...}>` 组件，内部读 Zustand 当前主题 → 生成 echarts theme JSON → `useECharts` hook 订阅主题变更重绘。

### D2. 放弃 API 缓存层（不引入 TanStack Query）

- **为什么**：分析任务是"触发式长任务 + 结果强一致"，用户偏好明确 refresh 动作；缓存层会让"刚跑完的结果没看到"更难调试。
- **落地**：`axios` 实例统一拦截器 + `ahooks/useRequest` 提供 loading/error/manual refresh，页面级按需调用。
- **例外**：任务详情 polling 用 `useRequest` 的 `pollingInterval`，任务终态（completed/failed）自动停。

### D3. 样式：Sass（SCSS）+ CSS Modules

- **为什么**：Antd 5 用 CSS-in-JS，less 的"与 Antd 变量同源"优势失效；sass 的 `@use / @function / @mixin` 更契合 token + 渐变 + 玻璃态表达需求；社区资源更丰富。
- **落地**：`*.module.scss` + 全局 `src/styles/` 下 `_tokens.scss`（仅写 `var(--xxx)` 门面函数）/ `_mixins.scss`（玻璃态、渐变文字、hover-lift）/ `global.scss`。

### D4. Design Token 三层 + CSS 变量 runtime 注入

- **seed tokens**：`primary/secondary/success/warning/error` + 灰阶
- **map tokens**：语义色（`bg.page / bg.surface / text.primary / border.subtle` 等）
- **alias tokens**：组件级（`card.bg / card.shadow / chart.series[0..]`）
- **切换机制**：
  1. `ThemeProvider` 订阅 Zustand `activeThemeId`
  2. 将 token 写入 Antd `ConfigProvider.theme.token`
  3. 将 map + alias 扁平化为 CSS 变量 `--ix-*` 写入 `:root`
  4. 调用 `echarts.registerTheme('active', echartsThemeFromTokens(tokens))`，触发 `<ThemedChart>` 重建 ECharts 实例
- **收益**：SCSS 只消费 `var(--ix-*)`，换主题零重编译；echarts 主题一句话切换。

### D5. 运行环境锁定：Node 24.15.0 + pnpm 10.10.0

- `.nvmrc` 写 `24.15.0`
- `package.json` → `"packageManager": "pnpm@10.10.0"` + `"engines": { "node": ">=24.15.0" }`
- README 要求开发者 `corepack enable && corepack use pnpm@10.10.0`
- CI（未来）通过 `--frozen-lockfile` 校验

### D6. Mock：MSW 全链路拦截 /api/v1/\*

- 开发期 `import.meta.env.DEV` 下自动启动 MSW worker
- `src/mocks/handlers/*.ts` 按路由组织，返回贴近真实后端的数据（含 running → completed 的状态流转模拟）
- 生产构建 `tree-shake` 掉 MSW 注入代码
- 切真实后端只需改 `VITE_API_BASE_URL`，无代码改动

### D7. 目录结构

```
insight-platform/
├── .nvmrc
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/ (mockServiceWorker.js)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router/ (routes.tsx, lazy)
│   ├── layouts/ (AppLayout, AuthLayout)
│   ├── pages/
│   │   ├── overview/
│   │   ├── tasks/ (list, new, detail)
│   │   ├── datasources/
│   │   ├── insights/
│   │   └── settings/
│   ├── components/ (ThemedChart, GlassCard, StepProgress, CodeViewer, DataDictView, etc.)
│   ├── theme/
│   │   ├── tokens/ (sunrise.ts, aurora.ts, midnight.ts, forest.ts, types.ts)
│   │   ├── ThemeProvider.tsx
│   │   ├── toAntdToken.ts
│   │   ├── toCssVars.ts
│   │   └── toEchartsTheme.ts
│   ├── api/ (client.ts, tasks.ts, datasources.ts, types.ts)
│   ├── mocks/ (browser.ts, handlers/*.ts, fixtures/*.ts)
│   ├── store/ (themeStore.ts, teamStore.ts)
│   ├── hooks/ (useTaskPolling.ts, useTheme.ts)
│   ├── i18n/ (zh-CN.json, en-US.json, index.ts)
│   ├── styles/ (_tokens.scss, _mixins.scss, global.scss)
│   └── utils/
└── openspec/ (已存在)
```

## Risks / Trade-offs

- **[echarts 上手曲线]** → 用 `<ThemedChart>` 封装 + 提供 3 个常用图（funnel/bar/line）presets，覆盖 80% 使用
- **[MSW 与真实后端字段漂移]** → mock fixtures 从 insight-x OpenAPI schema 派生类型（`openapi-typescript` 生成 types 作为共同真相）
- **[CSS 变量不支持老浏览器]** → MVP 仅支持 Chromium 100+/Safari 15.4+/Firefox 102+，README 注明
- **[跳过缓存层的性能]** → 任务列表/详情数据量小，每次请求可接受；如果后期出现性能问题再局部引入 SWR
- **[五步流水线进度需要后端 SSE/WebSocket]** → insight-x 当前 `/run` 是阻塞 POST，MVP 用"前端起 polling + 动画过渡"演绎过程；后端提供推送后前端切
- **[玻璃态 backdrop-filter 移动端支持]** → MVP 仅桌面端，移动端不保证

## Migration Plan

本项目为新建工程，无迁移。部署：

1. `pnpm install --frozen-lockfile`
2. `pnpm build`
3. 产物 `dist/` 上传静态服务器，nginx 代理 `/api/v1/` 到 insight-x
4. 回滚：切回上一个静态产物版本

## Open Questions

- 团队 ID 的来源：当前拟前端本地假数据 → 后端若新增 `/api/v1/teams`，前端切接口
- 任务进度推送：是否推动 insight-x 提供 SSE（本次不强依赖，单独议）
- 多语言：英文只占位（key 完整，文案待翻）
