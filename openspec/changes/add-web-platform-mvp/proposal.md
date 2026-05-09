# Proposal: insight-platform MVP Web 控制台

## Why

insight-x 目前是 API-only 的 AI Agent 分析平台，业务方（分析师 / PM / 数据工程师）只能通过 Swagger 或 curl 触发任务、读取 JSON 结果，使用成本高、协作困难、洞察不可视化。需要一个 Web 控制台让业务方"两三步跑完分析、看到可视化洞察、审计生成代码"。本次提案交付精瘦 MVP：核心链路可用、主题 token 体系完整、图表美观，为后续扩展（策略 / 埋点 / 模板市场）奠定地基。

## What Changes

- **新建前端工程** `insight-platform/`，技术栈固定为 React 18 + Vite + TS5 + Antd 5 + Pro-components，Node 24.15.0 / pnpm 10.10.0 锁定，样式用 Sass + CSS Modules
- **图表库选定 echarts 5 + echarts-for-react**，放弃 @ant-design/charts，原因：渐变 / 自定义 / 主题灵活性均优
- **Design Token 体系**：seed → map → alias 三层；JS 作为事实源；运行时写入 `:root` CSS 变量；同步注入 Antd ConfigProvider 与 echarts.registerTheme，实现一键切主题（本次落地 `sunrise` 黄橙主题，`aurora` / `midnight` / `forest` 预留接口）
- **核心用户旅程**：任务列表 → 新建任务向导 → 任务详情（五步流水线进度 + 实时）→ 洞察展示 → 数据字典 & 生成代码查看
- **数据源管理 CRUD**（前端 mock，预留后端接口）
- **团队切换**（顶部下拉，影响 `team_id` 请求参数）
- **API 对接**：对接 insight-x `POST /api/v1/tasks`、`POST /tasks/{id}/run`、`GET /tasks/{id}`、`GET /tasks/{id}/result`、`GET /tasks`；开发期用 MSW 全链路 mock
- **不引入 TanStack Query / 不做 API 缓存**，统一使用 axios + ahooks `useRequest`，每次页面进入 / 用户点击 refresh 重新发起

## Capabilities

### New Capabilities

- `theme-tokens`：Design Token 体系与主题切换机制——三层 token、CSS 变量注入、Antd + echarts 主题同步、预留多主题切换入口
- `team-context`：团队切换与上下文注入——顶部下拉选择当前团队，所有后续请求自动携带 `team_id`
- `data-source-management`：数据源 CRUD——新增 / 编辑 / 删除数据源配置，连接测试，表清单预览
- `analysis-task-management`：分析任务生命周期——任务列表、新建任务向导、任务详情含五步流水线进度与实时状态
- `insight-viewing`：洞察与分析结果展示——洞察卡片流、数据字典可视化、分析计划结构展示、echarts 图表
- `code-audit`：生成代码审计——Python 代码高亮预览、执行日志查看、执行结果 JSON 树

### Modified Capabilities

无（全新项目，`openspec/specs/` 为空）。

## Impact

- **新增代码**：`insight-platform/` 全量前端工程（约 40-60 文件，首批目标）
- **依赖**：insight-x 后端需保持 OpenAPI 契约稳定；开发期通过 MSW 解耦
- **基础设施**：新增 `.nvmrc` / `package.json#packageManager` / `pnpm-lock.yaml`；CI 后续接入（非本次）
- **后续解锁**：第二套主题落地、执行历史、洞察导出、Agent 6/7 UI 均可在此地基上增量叠加

## Non-goals

- Agent 6（策略设计）与 Agent 7（埋点实现）的 UI——等 insight-x 后端实现
- LLM 配置 / 配额计费 / 审批流 / 审计视图
- 对话式需求录入（长期迭代项）
- 自研 SQL IDE / BI 看板搭建
- TanStack Query 等请求缓存层 / SSR / 多 tab 状态同步
- 第二套主题（aurora / midnight / forest）的实际落地——仅保证机制就绪
