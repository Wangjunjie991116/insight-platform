/**
 * 主题 Token 类型定义。
 *
 * 三层结构（顺序表达抽象层级）：
 *   seed   — 原始 brand 色与灰阶，最底层、不直接被组件消费
 *   map    — 语义化：背景 / 文本 / 边框 / 品牌强调，跨组件共享
 *   alias  — 组件级：卡片 / 图表 / 布局，直接被组件样式消费
 *
 * 约定：
 *   1. 业务代码、SCSS、组件样式一律走 CSS 变量 var(--ix-*)，本文件只是事实源；
 *   2. 新增一层颜色或间距必须先在本类型上声明，确保四套主题同时补齐；
 *   3. 数值类（radius / spacing / font）只在这里以数字存，注入 CSS 时单位 px。
 */

// 当前内建主题 ID；新增主题时扩展该联合类型
export type ThemeId = 'sunrise' | 'aurora' | 'midnight' | 'forest'

// 亮/暗模式标识，用于 color-scheme 元信息与 Antd ConfigProvider 的 algorithm 选择
export type ThemeMode = 'light' | 'dark'

/** 10 档灰阶，50 最浅、900 最深，命名与 Tailwind 对齐便于直觉 */
export interface GrayScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

/** seed：底层原料色 */
export interface SeedTokens {
  primary: string
  primaryHover: string
  primaryActive: string
  secondary: string
  success: string
  warning: string
  error: string
  info: string
  gray: GrayScale
}

/** map：语义化 token，跨组件共享 */
export interface MapTokens {
  bg: {
    page: string // 页面最底层背景（通常为渐变）
    surface: string // 一级卡片/面板
    surfaceHover: string
    elevated: string // 弹窗、Popover 等浮层
    mask: string // 遮罩
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
    disabled: string
    onPrimary: string // 落在 primary 色块上的文字
    link: string
  }
  border: {
    subtle: string
    default: string
    strong: string
  }
  status: {
    successBg: string
    warningBg: string
    errorBg: string
    infoBg: string
  }
  brand: {
    /** 主渐变，卡片 / 按钮高亮 / logo 使用 */
    gradient: string
    /** 柔和光晕，玻璃态卡片阴影末端 */
    glow: string
  }
}

/** alias：组件级 token，直接对应视觉元素 */
export interface AliasTokens {
  card: {
    bg: string
    border: string
    shadow: string
    /** 玻璃态滤镜强度，如 "24px" */
    blur: string
  }
  layout: {
    headerBg: string
    siderBg: string
    contentBg: string
  }
  chart: {
    /** 系列色序列，至少 6 档 */
    series: [string, string, string, string, string, string]
    axis: string
    grid: string
    tooltipBg: string
    tooltipText: string
  }
  code: {
    bg: string
    text: string
    keyword: string
    string: string
    comment: string
    number: string
  }
  step: {
    pendingBorder: string
    runningGradient: string
    successBorder: string
    failBorder: string
  }
}

/** 非颜色类 token：间距 / 圆角 / 字号 / 动效 */
export interface ShapeTokens {
  radius: { sm: number; md: number; lg: number; xl: number; round: number }
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number }
  font: {
    family: string
    familyMono: string
    sizeBase: number
    sizeLg: number
    sizeSm: number
    sizeXs: number
  }
  motion: {
    /** 过渡时长，单位 ms */
    fast: number
    base: number
    slow: number
    /** 缓动函数 */
    easing: string
  }
}

/** 完整主题 Token */
export interface ThemeToken {
  id: ThemeId
  /** 中文展示名 */
  name: string
  mode: ThemeMode
  seed: SeedTokens
  map: MapTokens
  alias: AliasTokens
  shape: ShapeTokens
}
