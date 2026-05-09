/**
 * ThemeToken → CSS 变量扁平化。
 *
 * 产出形如 `{ '--ix-bg-page': '...', '--ix-chart-series-0': '...' }` 的对象，
 * 由 ThemeProvider 在运行时写到 :root 上；SCSS / 内联 style 只通过 var(--ix-*) 消费。
 *
 * 命名规则：--ix-<group>-<key>（嵌套对象递归展开，用 - 连接；数组用索引）。
 * 保留原始色值（含 rgba / gradient），不做任何转换。
 */

import type { ThemeToken } from './tokens/types'

type CssVarMap = Record<string, string>

/** 将嵌套对象展平为 CSS 变量映射 */
function flatten(prefix: string, value: unknown, out: CssVarMap): void {
  if (value == null) return

  if (typeof value === 'string' || typeof value === 'number') {
    // 数值类统一写为 px（radius/spacing/font.size），纯数字字段约定即此
    const cssValue = typeof value === 'number' ? `${value}px` : value
    out[prefix] = cssValue
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, idx) => flatten(`${prefix}-${idx}`, item, out))
    return
  }

  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      // 驼峰 → 连字符，便于阅读且与 CSS 惯例一致
      const kebab = k.replace(/([A-Z])/g, '-$1').toLowerCase()
      flatten(`${prefix}-${kebab}`, v, out)
    }
  }
}

/**
 * 把 ThemeToken 转为可写入 :root 的 CSS 变量对象。
 * 只展开 map / alias / shape 三层，seed 视为实现细节不外泄。
 */
export function toCssVars(token: ThemeToken): CssVarMap {
  const out: CssVarMap = {}
  flatten('--ix', { bg: token.map.bg }, out)
  flatten('--ix', { text: token.map.text }, out)
  flatten('--ix', { border: token.map.border }, out)
  flatten('--ix', { status: token.map.status }, out)
  flatten('--ix', { brand: token.map.brand }, out)
  flatten('--ix', { card: token.alias.card }, out)
  flatten('--ix', { layout: token.alias.layout }, out)
  flatten('--ix', { chart: token.alias.chart }, out)
  flatten('--ix', { code: token.alias.code }, out)
  flatten('--ix', { step: token.alias.step }, out)
  flatten('--ix', { radius: token.shape.radius }, out)
  flatten('--ix', { spacing: token.shape.spacing }, out)
  flatten('--ix', { font: token.shape.font }, out)
  flatten('--ix', { motion: token.shape.motion }, out)
  // seed 的主色也暴露几个常用值，方便 SCSS 引用
  out['--ix-color-primary'] = token.seed.primary
  out['--ix-color-primary-hover'] = token.seed.primaryHover
  out['--ix-color-primary-active'] = token.seed.primaryActive
  out['--ix-color-secondary'] = token.seed.secondary
  return out
}

/**
 * 把 CSS 变量映射应用到某个 DOM 元素（默认为 :root）。
 * 返回此次被设置的 key 列表，便于后续主题切换时精确清理。
 */
export function applyCssVars(vars: CssVarMap, target: HTMLElement = document.documentElement): string[] {
  const keys: string[] = []
  for (const [k, v] of Object.entries(vars)) {
    target.style.setProperty(k, v)
    keys.push(k)
  }
  // color-scheme 跟随主题 mode，帮助浏览器原生控件（滚动条等）自动适配
  return keys
}
