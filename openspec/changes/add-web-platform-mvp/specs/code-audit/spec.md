# code-audit · 生成代码与执行审计

## ADDED Requirements

### Requirement: 生成代码预览

平台 SHALL 在任务详情"代码"Tab 展示 Agent 生成的 Python 代码，使用只读代码编辑器（Monaco / react-syntax-highlighter 二选一，MVP 采用 react-syntax-highlighter + prism 主题对齐 token）。提供复制、下载 .py、行号显示功能。

#### Scenario: 查看代码

- **WHEN** 用户切到代码 Tab
- **THEN** 代码块展示 `generated_code` 字符串，高亮、行号可见

#### Scenario: 复制代码

- **WHEN** 用户点击复制按钮
- **THEN** 复制到剪贴板，Notification 提示"已复制"

#### Scenario: 下载

- **WHEN** 用户点击下载按钮
- **THEN** 以 `task_<id>_analysis.py` 为文件名下载

### Requirement: 执行结果 JSON 树

平台 SHALL 展示 `execution_result.output`，以可折叠 JSON 树形式呈现。树节点数组超过 50 条时虚拟滚动。

#### Scenario: 展开节点

- **WHEN** 用户点击 output 顶层 key
- **THEN** 展开下级键值对，数字型值靠右对齐，字符串型值着色区别

### Requirement: 执行日志

平台 SHALL 展示 `execution_result.logs` 原始文本，提供搜索、换行切换。当 `execution_result.error` 非空时，顶部以红色 Alert 展示错误摘要。

#### Scenario: 查看错误

- **WHEN** 任务失败且 logs 含 stack trace
- **THEN** 日志区预滚动到第一个 ERROR 行，搜索框支持高亮关键字

### Requirement: 执行元信息

平台 SHALL 在"代码"与"结果"Tab 顶部展示执行元信息：执行耗时（`duration_ms` 格式化为人类可读）、成功/失败标识、代码字符数、输出键数量。

#### Scenario: 展示元信息

- **WHEN** 任务完成，duration_ms = 87342
- **THEN** 展示"1 分 27 秒"，旁边 ✅ 图标
