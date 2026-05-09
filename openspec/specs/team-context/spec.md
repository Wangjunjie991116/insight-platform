# team-context Specification

## Purpose
TBD - created by archiving change add-web-platform-mvp. Update Purpose after archive.
## Requirements
### Requirement: 顶部团队切换入口

平台 SHALL 在顶栏右上角提供团队切换下拉组件，展示当前用户可访问的团队列表，切换后立即生效（无需刷新）。

#### Scenario: 切换团队

- **WHEN** 用户点击顶栏团队下拉并选择另一个团队
- **THEN** 全局 `teamStore.activeTeamId` 更新，后续所有请求自动带上新的 `team_id`

#### Scenario: 持久化

- **WHEN** 用户刷新页面
- **THEN** 当前团队 ID 从 localStorage 恢复，下拉组件高亮正确项

### Requirement: 请求自动注入 team_id

axios 实例 SHALL 通过请求拦截器读取 `teamStore.activeTeamId`，在调用 `/api/v1/tasks` 列表类接口时自动拼接 `team_id` 查询参数；POST body 中若模型要求 `team_id` 字段也自动填充。

#### Scenario: 列表请求

- **WHEN** 用户进入 `/tasks` 页面
- **THEN** 发出的 GET 请求 URL 为 `/api/v1/tasks?team_id=<activeTeamId>&limit=50`

#### Scenario: 创建任务

- **WHEN** 用户提交新建任务表单
- **THEN** POST body 中自动带上 `team_id: <activeTeamId>`，无需表单显式填写

### Requirement: 未选择团队时的降级

平台 SHALL 在 `activeTeamId` 为空时将下拉显示为"选择团队"，禁止访问任务列表/新建页面，跳转到设置页并提示先选择团队。

#### Scenario: 首次访问无团队

- **WHEN** 用户首次登录且 localStorage 无团队 ID，直接访问 `/tasks`
- **THEN** 被路由守卫拦截，重定向到 `/settings` 并弹出 Notification 提示"请先选择团队"

