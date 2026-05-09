/**
 * 主题注册表：集中导出四套主题，供 Store / Provider 与设置页使用。
 */


import { auroraTheme } from './aurora'
import { forestTheme } from './forest'
import { midnightTheme } from './midnight'
import { sunriseTheme } from './sunrise'
import type { ThemeId, ThemeToken } from './types'

export const themeRegistry: Record<ThemeId, ThemeToken> = {
  sunrise: sunriseTheme,
  aurora: auroraTheme,
  midnight: midnightTheme,
  forest: forestTheme,
}

/** 默认主题 ID：首次加载、用户未设置偏好时使用 */
export const DEFAULT_THEME_ID: ThemeId = 'aurora'

/** 主题 ID 列表，可迭代用于选择器渲染 */
export const THEME_IDS: ThemeId[] = ['sunrise', 'aurora', 'midnight', 'forest']

export function getTheme(id: ThemeId): ThemeToken {
  return themeRegistry[id] ?? themeRegistry[DEFAULT_THEME_ID]
}

export * from './types'
