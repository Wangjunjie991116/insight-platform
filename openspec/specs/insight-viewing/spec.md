# insight-viewing Specification

## Purpose
TBD - created by archiving change add-web-platform-mvp. Update Purpose after archive.
## Requirements
### Requirement: 洞察卡片流

平台 SHALL 在任务详情"洞察"Tab 以卡片流展示 `insights[]`，每张卡片含：标题、描述、置信度进度环、潜在影响文案、数据支撑折叠区（展示 `data_support` 对象树）。卡片采用玻璃态样式，hover 时上浮 2px。

#### Scenario: 展示多条洞察

- **WHEN** 任务返回 5 条洞察
- **THEN** 页面渲染 5 张卡片；每张右上角显示置信度百分比（来自 `confidence * 100`）

#### Scenario: 置信度可视化

- **WHEN** 某条洞察 confidence = 0.85
- **THEN** 卡片右上角环形进度显示 85%，颜色随 token `chart.series[0]` 渐变

### Requirement: 数据字典可视化

平台 SHALL 在任务详情"数据"Tab 展示 `data_dict`：左侧为表清单（含行数 tag），右侧为选中表的字段列表（含类型、是否关键字段、业务含义）。下方展示表关系 relations 的简易图（echarts graph series）。

#### Scenario: 切换表

- **WHEN** 用户点击左侧表名
- **THEN** 右侧刷新该表的 columns 列表，is_key 字段以金色星标标识

#### Scenario: 关系图

- **WHEN** `relations` 数组非空
- **THEN** 底部展示节点-连线图，节点为表，连线为外键关系，hover 节点显示 column 信息

### Requirement: 分析计划展示

平台 SHALL 在任务详情"计划"Tab 以 Collapse 列表展示 `analysis_plan.metrics` 与 `analysis_plan.steps`。步骤以有序列表编号呈现，每步展示目的 / 输入 / 输出 / 预期图表。

#### Scenario: 计划为空

- **WHEN** 任务未执行到步骤 2，analysis_plan 为 `{}`
- **THEN** Tab 显示 skeleton + 提示"分析策略生成中"

### Requirement: 洞察配图（echarts）

平台 SHALL 为漏斗类洞察自动渲染 echarts 漏斗图；包含百分比/趋势类数据的洞察渲染对应图表（bar / line）。图表由通用组件 `<ThemedChart>` 封装，自动订阅当前主题。

#### Scenario: 漏斗数据

- **WHEN** 洞察的 data_support 包含 `funnel: [{stage, users}]`
- **THEN** 卡片底部渲染漏斗图，颜色序列走 token 的 chart.series，块间渐变

#### Scenario: 主题切换图表跟随

- **WHEN** 用户切换主题（theme-tokens 能力）
- **THEN** 所有图表 300ms 内重新着色，无闪屏

### Requirement: 概览页数据大屏

平台 SHALL 在 `/overview` 提供团队级概览：今日/本周任务数、成功率环形图、最近 7 天任务趋势折线图、最近 5 条任务摘要、状态分布饼图。所有指标基于任务列表本地计算，不要求后端新增接口。

#### Scenario: 进入概览

- **WHEN** 用户登录后默认跳转或点击"概览"菜单
- **THEN** 页面展示四块玻璃态卡片，数字有 100ms 入场动画，图表有 token 主色渐变

