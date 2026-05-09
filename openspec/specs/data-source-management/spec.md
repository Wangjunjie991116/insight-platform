# data-source-management Specification

## Purpose
TBD - created by archiving change add-web-platform-mvp. Update Purpose after archive.
## Requirements
### Requirement: 数据源列表

平台 SHALL 在 `/datasources` 提供当前团队的数据源列表，以卡片流形式展示，每张卡片包含：名称、数据库类型、主机/库、最近连接状态、操作按钮（编辑 / 删除 / 测试连接 / 复制连接串）。

#### Scenario: 查看列表

- **WHEN** 用户进入 `/datasources`
- **THEN** 页面拉取数据源（MSW mock 或后端），以玻璃态卡片网格展示；空态显示引导"新建数据源"按钮

#### Scenario: 刷新

- **WHEN** 用户点击右上角刷新按钮
- **THEN** 重新发起请求（无缓存），列表状态更新

### Requirement: 新建数据源

平台 SHALL 提供新建数据源的弹窗表单，字段包含：名称、db_type（下拉 postgresql / sqlite / mysql）、host、port、database、user、password、schema。提交后写入本地 mock 存储（MSW 内存字典）。

#### Scenario: 完整填写提交

- **WHEN** 用户填完必填项并提交
- **THEN** 弹窗关闭，列表新增一张卡片，Notification 显示"数据源创建成功"

#### Scenario: 表单校验

- **WHEN** 用户未填 database 字段即提交
- **THEN** 表单阻止提交并在字段下显示红色错误提示

### Requirement: 连接测试

平台 SHALL 在数据源卡片上提供"测试连接"按钮，点击后调用 mock 接口模拟连接尝试，返回 success / failure 并在卡片上以图标颜色呈现。

#### Scenario: 测试成功

- **WHEN** 用户点击"测试连接"且 mock 返回 200
- **THEN** 卡片状态图标变为绿色对勾，tooltip 显示"最近连接：刚刚"

#### Scenario: 测试失败

- **WHEN** mock 返回错误
- **THEN** 卡片状态图标变红，tooltip 显示错误信息

### Requirement: 编辑与删除

平台 SHALL 允许用户编辑已有数据源或删除（需二次确认）。删除操作不影响已创建的任务。

#### Scenario: 删除确认

- **WHEN** 用户点击删除
- **THEN** 弹出 Modal 要求输入数据源名称以二次确认；匹配才执行删除

### Requirement: 新建任务时复用数据源

在 `/tasks/new` 向导中，用户 SHALL 能从下拉中选择已有数据源，而不必重复填写连接信息。

#### Scenario: 选择已有

- **WHEN** 用户在新建任务向导的"选择数据源"步骤
- **THEN** 下拉展示当前团队全部数据源，选中后连接字段自动填充并只读

