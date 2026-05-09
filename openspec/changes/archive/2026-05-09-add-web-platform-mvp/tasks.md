# Tasks: insight-platform MVP 实施清单

说明：Token 系统排在最前，因为后续所有 UI/图表都依赖它；MSW + API 层其次，保证页面开发零后端阻塞；之后按路由顺序实现页面。

## 1. 工程初始化与环境锁定

- [x] 1.1 写入 `.nvmrc`（内容 `24.15.0`）与根级 `.gitignore`、`.editorconfig`、`.prettierrc`、`.eslintrc.cjs`
- [x] 1.2 初始化 `package.json`，锁定 `"packageManager": "pnpm@10.10.0"`、`"engines": { "node": ">=24.15.0" }`；添加 scripts（`dev / build / preview / lint / typecheck / format`）
- [x] 1.3 安装依赖：`react react-dom antd @ant-design/icons echarts echarts-for-react zustand axios ahooks react-router-dom sass lucide-react react-syntax-highlighter`；devDeps：`vite @vitejs/plugin-react typescript @types/react @types/react-dom msw eslint prettier stylelint stylelint-config-standard-scss`（注：antd v6 + vite v8 + 暂不用 @ant-design/pro-components，因为其 peer 尚未支持 antd 6）
- [x] 1.4 配置 `vite.config.ts`（alias @→src、sass additionalData 注入 `@use '@/styles/tokens' as *;`、env 前缀 VITE_）
- [x] 1.5 配置 `tsconfig.json`（strict、paths、jsx react-jsx）
- [x] 1.6 `index.html`（中文 title、preconnect 字体、meta color-scheme）
- [x] 1.7 `src/main.tsx`、`src/App.tsx` 骨架：ConfigProvider + AntApp + BrowserRouter
- [x] 1.8 README 写入环境要求、开发指令、目录结构、主题切换说明

## 2. Design Token 体系（主题切换地基）

- [x] 2.1 定义 `src/theme/tokens/types.ts`：`SeedTokens / MapTokens / AliasTokens / ThemeToken` 类型
- [x] 2.2 实现 `src/theme/tokens/sunrise.ts`：按 context 填完三层 token（黄橙风 + 玻璃态）
- [x] 2.3 占位 `aurora.ts / midnight.ts / forest.ts`：字段齐备，值可暂 clone sunrise
- [x] 2.4 实现 `src/theme/toAntdToken.ts`：把 ThemeToken 映射为 Antd 5 的 `{ token, components }`
- [x] 2.5 实现 `src/theme/toCssVars.ts`：扁平化 map + alias 为 `{ '--ix-xxx': value }` 对象
- [x] 2.6 实现 `src/theme/toEchartsTheme.ts`：把 token 生成 echarts theme JSON（含 series 渐变）
- [x] 2.7 实现 `src/store/themeStore.ts`：Zustand 管理 `activeThemeId`，localStorage 持久化
- [x] 2.8 实现 `src/theme/ThemeProvider.tsx`：订阅 store → 注入 ConfigProvider + 写入 :root CSS 变量 + registerTheme
- [x] 2.9 实现 `src/styles/_tokens.scss`（仅 var(--ix-xxx) 门面）/ `_mixins.scss`（glass / hover-lift / gradient-text）/ `global.scss`
- [x] 2.10 实现 `src/components/ThemedChart.tsx`：echarts-for-react 封装，订阅主题变更自动 reinit

## 3. API 层与 Mock

- [x] 3.1 根据 `../insight-x/docs/openapi.yaml` 生成或手写类型 `src/api/types.ts`
- [x] 3.2 实现 `src/api/client.ts`：axios 实例 + 拦截器（注入 team_id、统一错误 notification）
- [x] 3.3 实现 `src/api/tasks.ts`：`listTasks / createTask / getTask / runTask / getResult`
- [x] 3.4 实现 `src/api/datasources.ts`：本地模型 `listDataSources / createDataSource / updateDataSource / deleteDataSource / testConnection`
- [x] 3.5 MSW 初始化：`src/mocks/browser.ts`，按路由拆分 `handlers/tasks.ts`、`handlers/datasources.ts`
- [x] 3.6 MSW fixtures：`fixtures/tasks.ts`（含 pending→running→completed 状态流转逻辑，基于 setTimeout 模拟 15s 完成）、`fixtures/datasources.ts`、`fixtures/insights.ts`（含漏斗数据支撑）
- [x] 3.7 在 `main.tsx` 开发环境启动 MSW worker，production 构建 tree-shake 掉
- [x] 3.8 `public/mockServiceWorker.js`（pnpm exec msw init public/）

## 4. 路由与布局

- [x] 4.1 `src/router/routes.tsx`：懒加载所有页面，定义路由常量
- [x] 4.2 `src/layouts/AppLayout.tsx`：antd 6 `Layout` + 自定义顶栏/侧栏（logo + 团队切换 + 主题切换 + 用户头像）+ 内容区（玻璃态背景）；不使用 @ant-design/pro-components（peer 暂未支持 antd 6）
- [x] 4.3 `src/store/teamStore.ts`：Zustand 管理 activeTeamId + 团队列表
- [x] 4.4 团队切换组件：顶栏下拉，未选择时引导到 /settings
- [x] 4.5 主题切换组件：顶栏下拉，展示 4 个主题名 + 色块预览

## 5. 通用组件库

- [x] 5.1 `GlassCard`：玻璃态卡片容器，支持 hover-lift 开关
- [x] 5.2 `StepProgress`：纵向五步进度条，支持 pending/running/success/fail 四态与 token 渐变 loading
- [x] 5.3 `ConfidenceRing`：置信度环形进度，颜色随 token
- [x] 5.4 `CodeViewer`：react-syntax-highlighter + prism 主题对齐 token，支持复制/下载
- [x] 5.5 `JsonTree`：可折叠 JSON 树，支持大数组虚拟滚动
- [x] 5.6 `DataDictView`：表清单 + 字段详情组合
- [x] 5.7 `EmptyState`：空态插画组件（SVG inline）
- [x] 5.8 `PageHeader`：页面标题 + 刷新按钮 + 操作区

## 6. 概览页 `/overview`

- [x] 6.1 页面骨架：4 个 KPI 卡片（今日任务/本周任务/成功率/平均耗时）
- [x] 6.2 近 7 天任务趋势折线图（ThemedChart）
- [x] 6.3 状态分布饼图 + 最近 5 条任务摘要
- [x] 6.4 基于 listTasks 本地计算所有指标（无额外接口）

## 7. 任务列表页 `/tasks`

- [x] 7.1 antd 6 Table 展示 listTasks 结果，列：ID 缩写 / 业务目标 / 状态 / 创建时间 / 更新时间 / 操作
- [x] 7.2 状态筛选（客户端过滤）+ 关键词搜索 + 刷新
- [x] 7.3 操作列：查看详情跳转 / 重跑确认 Modal
- [x] 7.4 空态：引导按钮到 /tasks/new
- [x] 7.5 团队切换时列表自动重新请求

## 8. 新建任务向导 `/tasks/new`

- [x] 8.1 Steps 三步：选择数据源 / 描述业务 / 确认提交
- [x] 8.2 数据源下拉 + "新建数据源"内嵌入口（复用 datasource 弹窗）
- [x] 8.3 业务文档 textarea（字数限制 5000）+ 业务目标 textarea（500）+ 模板弹窗
- [x] 8.4 localStorage 草稿自动保存 + 恢复提示
- [x] 8.5 提交：POST create → 成功后自动 POST run → 跳转 /tasks/:id

## 9. 任务详情页 `/tasks/:id`

- [x] 9.1 页面顶部：任务元信息卡（团队 / 目标 / 状态 / 时间）+ 重跑按钮
- [x] 9.2 纵向 StepProgress 五步流水线，显示每步耗时与产物摘要
- [x] 9.3 `useTaskPolling` hook：running 时每 3s 轮询 `/tasks/:id`，终态停止
- [x] 9.4 Tabs：洞察 / 数据 / 计划 / 代码 / 结果 / 日志
- [x] 9.5 Failed 态顶部 Alert 展示 error

## 10. 洞察展示（`/insights` 与任务详情-洞察 Tab）

- [x] 10.1 洞察卡片组件：标题 / 描述 / 置信度环 / 潜在影响 / 数据支撑折叠
- [x] 10.2 漏斗数据自动渲染 echarts 漏斗图
- [x] 10.3 其它类型数据自动选 bar / line / pie
- [x] 10.4 `/insights` 页聚合当前团队已完成任务的全部洞察，支持按业务目标分组

## 11. 数据字典 / 计划 / 代码 / 结果 / 日志 Tabs

- [x] 11.1 数据字典 Tab：左表列表右字段 + 底部关系图（echarts graph）
- [x] 11.2 计划 Tab：metrics / steps 折叠列表
- [x] 11.3 代码 Tab：CodeViewer + 复制 / 下载 .py + 元信息
- [x] 11.4 结果 Tab：JsonTree 展示 execution_result.output + 元信息
- [x] 11.5 日志 Tab：日志文本 + 搜索高亮 + 换行切换

## 12. 数据源管理 `/datasources`

- [x] 12.1 卡片网格列表 + 空态
- [x] 12.2 新建数据源弹窗：表单字段校验 + db_type 切换显隐端口/schema
- [x] 12.3 编辑弹窗复用表单
- [x] 12.4 删除二次确认（输入名称匹配）
- [x] 12.5 测试连接按钮（mock 90% 成功率随机）

## 13. 设置页 `/settings`

- [x] 13.1 团队切换模块（与顶栏同源但更详细的卡片列表）
- [x] 13.2 主题切换模块：4 张主题预览卡 + 应用按钮
- [x] 13.3 关于页：版本 / 技术栈 / insight-x API 状态探活

## 14. （已移除）国际化

本项目直接写死中文文案，不引入 i18n（原 §14 任务删除）。

## 15. 自检与收尾

- [x] 15.1 `pnpm lint` / `pnpm typecheck` 全绿
- [x] 15.2 `pnpm build` 产物 < 2MB（gzip）
- [x] 15.3 走一遍金路径：新建数据源 → 新建任务 → 等完成 → 看洞察 → 切换主题 → 图表跟随
- [x] 15.4 浏览器兼容性手测：Chrome / Safari / Firefox
- [x] 15.5 README 补 Troubleshooting 常见问题
