# theme-tokens · 主题 Token 体系与一键换肤

## ADDED Requirements

### Requirement: 三层 Design Token 结构

平台 SHALL 以三层结构组织 design tokens：seed tokens（原始色/间距/圆角/字号）、map tokens（语义色，如 `bg.page / text.primary / border.subtle`）、alias tokens（组件级，如 `card.bg / chart.series[0..]`）。所有 token 必须在 `src/theme/tokens/*.ts` 中以 TypeScript 类型 `ThemeToken` 定义，禁止在组件内书写魔法色值或常量。

#### Scenario: 开发者添加新颜色

- **WHEN** 开发者需要在新组件中使用一个品牌橙色
- **THEN** 必须先在 `sunrise.ts` 的 seed 或 map 层新增字段，再在组件中通过 `var(--ix-xxx)` 或 token 对象引用，不得直接写入 `#F97316`

#### Scenario: Token 类型校验

- **WHEN** 新增主题 `aurora.ts` 但缺少某个 map token
- **THEN** TypeScript 编译必须报错，阻止构建

### Requirement: 首套主题 sunrise（黄橙风）

平台 SHALL 以 `sunrise` 为默认主题，主色 `#F59E0B`，辅色 `#EA580C`，页面背景采用米白到淡橙的径向渐变，卡片采用半透明 + 24px backdrop-blur 玻璃态。

#### Scenario: 首次加载

- **WHEN** 用户首次进入应用（localStorage 无主题偏好）
- **THEN** 页面以 sunrise 主题渲染，顶栏/侧栏/卡片符合上述描述

#### Scenario: 保留用户偏好

- **WHEN** 用户在设置页切换主题并刷新
- **THEN** 页面以用户上次选择的主题渲染（localStorage 持久化 `activeThemeId`）

### Requirement: 一键切主题机制

平台 SHALL 提供运行时主题切换能力，切换时需同步更新：(a) Antd ConfigProvider 的 `theme.token`；(b) `:root` 上的 CSS 变量 `--ix-*`；(c) 已注册的 echarts 主题。切换必须在 300ms 内完成，且不触发页面重载。

#### Scenario: 主题切换成功

- **WHEN** 用户在设置页点击"切换到 aurora 主题"
- **THEN** 页面所有 Antd 组件、echarts 图表、自定义 SCSS 样式同步变色，不刷新页面

#### Scenario: 图表实时跟随

- **WHEN** 任务详情页打开时用户切换主题
- **THEN** 页面内 echarts 图表实例重建或重设 theme，颜色序列切换到新主题的 `chart.series` alias

### Requirement: 预留多主题接口

平台 SHALL 预留 `aurora / midnight / forest` 三套主题占位文件，字段齐备但值可为 sunrise 复制；本次不要求视觉精细化，仅验证切换机制可用。

#### Scenario: 切换到占位主题

- **WHEN** 开发者在 devtools 手动触发 `useThemeStore.setState({activeThemeId:'aurora'})`
- **THEN** 无任何运行时报错，页面渲染不崩溃

### Requirement: 样式消费必须走 CSS 变量

所有 SCSS / inline style / Antd 组件配置 SHALL 通过 CSS 变量 `--ix-*` 或主题 token 引用颜色/间距/圆角；禁止在 `*.scss` 中硬编码色值（允许的例外：`transparent / currentColor / 纯黑白调试注释`）。

#### Scenario: Lint 级约束

- **WHEN** CI 运行样式检查
- **THEN** 检测到 `.scss` 中出现 `#[0-9a-fA-F]{3,8}` 色值（白名单之外）时报警告
