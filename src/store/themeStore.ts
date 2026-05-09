/**
 * 主题状态：当前主题 ID 与切换方法，localStorage 持久化。
 *
 * 为什么不用 zustand/middleware/persist：本项目只需持久化单字段，
 * 手写 getItem/setItem 更透明、不依赖中间件版本。
 */

import { create } from 'zustand'

import { DEFAULT_THEME_ID, THEME_IDS } from '@/theme/tokens'
import type { ThemeId } from '@/theme/tokens/types'

const STORAGE_KEY = 'insight-platform:activeThemeId'

/** 从 localStorage 安全读取 ID，非法值回退到默认 */
function readInitialThemeId(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME_ID
  try {
    const v = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null
    return v && THEME_IDS.includes(v) ? v : DEFAULT_THEME_ID
  } catch {
    return DEFAULT_THEME_ID
  }
}

interface ThemeState {
  activeThemeId: ThemeId
  setActiveThemeId: (id: ThemeId) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  activeThemeId: readInitialThemeId(),
  setActiveThemeId: (id) => {
    // 写入前先落库，避免 React 批处理与异步副作用造成二次渲染前缓存未更新
    try {
      window.localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // 隐私模式 / 额度满时忽略
    }
    set({ activeThemeId: id })
  },
}))
