# analysis-task-management · 分析任务管理

## ADDED Requirements

### Requirement: 任务列表页

平台 SHALL 在 `/tasks` 提供当前团队分析任务列表，默认按创建时间倒序，展示字段：任务 ID 缩写、业务目标、状态 tag（pending/running/completed/failed）、创建时间、更新时间、操作列（查看详情 / 重跑）。

#### Scenario: 查看列表

- **WHEN** 用户进入 `/tasks`
- **THEN** 发起 `GET /api/v1/tasks?team_id=<id>&limit=50`，以 Antd Table 展示结果，状态 tag 颜色走 token

#### Scenario: 状态筛选

- **WHEN** 用户点击状态列的筛选按钮勾选 `running`
- **THEN** 前端本地过滤展示 running 的任务（无需重新请求）

#### Scenario: 空态

- **WHEN** 后端返回空数组
- **THEN** 表格区域显示插画 + "新建第一个分析任务"按钮

### Requirement: 新建任务向导

平台 SHALL 在 `/tasks/new` 提供三步向导：步骤 1 选择数据源（含新建入口）、步骤 2 填写业务文档与业务目标、步骤 3 确认并提交。提交后调用 `POST /api/v1/tasks` 创建任务并跳转到任务详情。

#### Scenario: 完整流程

- **WHEN** 用户完成三步并点击"创建并立即执行"
- **THEN** 先调用 POST `/api/v1/tasks` 创建，成功后连续调用 POST `/tasks/{id}/run`，跳转到 `/tasks/{id}`

#### Scenario: 保存草稿

- **WHEN** 用户在步骤 2 填了一半关闭页面
- **THEN** 表单内容暂存 localStorage，下次进入向导自动恢复并提示"发现未完成的任务"

#### Scenario: 业务目标模板

- **WHEN** 用户在"业务目标"输入框点击"模板"
- **THEN** 弹出预设模板列表（漏斗分析/留存分析/归因分析等），选择后填入

### Requirement: 任务详情五步流水线可视化

平台 SHALL 在 `/tasks/:id` 以纵向 Steps 组件展示五步流水线（数据理解/策略/代码生成/执行/洞察），每步显示：状态图标、耗时、折叠区域内展示该步产物摘要。任务 running 时前端每 3s polling 任务状态直到终态。

#### Scenario: Running 态

- **WHEN** 用户打开一个 running 任务
- **THEN** 当前步骤显示旋转 loading 环形（token 主色渐变），其余步骤灰色；每 3s 请求 `/tasks/{id}` 与 `/tasks/{id}/result` 更新状态

#### Scenario: 达到终态停止 polling

- **WHEN** 状态变为 completed 或 failed
- **THEN** 前端自动停止 polling，展示完整结果

#### Scenario: Failed 态错误展示

- **WHEN** 状态为 failed
- **THEN** 详情页顶部 Alert 展示 `error` 字段内容，失败步骤标红，提供"重跑"按钮

### Requirement: 重跑任务

平台 SHALL 在任务详情与列表操作列提供"重跑"按钮，点击后调用 `POST /api/v1/tasks/{id}/run`。running 状态下按钮禁用。

#### Scenario: 重跑成功

- **WHEN** 用户对 failed 任务点击重跑并确认
- **THEN** 发送 POST，状态变回 running，详情页开始 polling
