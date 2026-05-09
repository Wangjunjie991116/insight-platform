/**
 * 主题提供者：应用顶层唯一。
 *
 * 职责（按执行顺序）：
 *   1. 订阅 themeStore 的 activeThemeId，解析当前 ThemeToken
 *   2. 将 token 扁平化写入 :root CSS 变量（同时清理旧变量）
 *   3. 调 echarts.registerTheme 覆盖同名主题，驱动 <ThemedChart> 重绘
 *   4. 将 Antd ThemeConfig 注入 ConfigProvider，子树 Antd 组件跟随切换
 *   5. 同步 color-scheme 与 data-theme 属性，便于 CSS 根据模式做微调
 */

import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import * as echarts from 'echarts/core'
import { useEffect, useMemo, useRef, type PropsWithChildren } from 'react'


import { toAntdTheme } from './toAntdToken'
import { applyCssVars, toCssVars } from './toCssVars'
import { ECHARTS_THEME_NAME, toEchartsTheme } from './toEchartsTheme'
import { getTheme } from './tokens'

import { useThemeStore } from '@/store/themeStore'

/**
 * 应用主题并返回一个清理旧 CSS 变量的函数。
 * 切主题时先调用上一次返回的 cleanup，确保不会残留不存在于新主题的变量。
 */
function applyTheme(id: Parameters<typeof getTheme>[0]): { cleanup: () => void; appliedKeys: string[] } {
  const token = getTheme(id)
  const vars = toCssVars(token)
  const appliedKeys = applyCssVars(vars)

  // ECharts 主题是全局注册的，同名覆盖即可实现"一键换肤"
  const echartsTheme = toEchartsTheme(token)
  echarts.registerTheme(ECHARTS_THEME_NAME, echartsTheme)

  const root = document.documentElement
  root.dataset.theme = token.id
  root.dataset.mode = token.mode
  root.style.colorScheme = token.mode

  return {
    cleanup: () => {
      // 卸载时不清变量，只在"下一个主题来临时"清理旧的、且新主题不再定义的 key
      appliedKeys.forEach((k) => {
        if (!Object.prototype.hasOwnProperty.call(vars, k)) {
          root.style.removeProperty(k)
        }
      })
    },
    appliedKeys,
  }
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const activeThemeId = useThemeStore((s) => s.activeThemeId)
  const prevKeysRef = useRef<string[]>([])

  // token 只在 id 变化时重算，ConfigProvider 能获得稳定引用
  const antdTheme = useMemo(() => toAntdTheme(getTheme(activeThemeId)), [activeThemeId])

  useEffect(() => {
    const { appliedKeys } = applyTheme(activeThemeId)

    // 清理上轮独有 key：新主题没有的老变量要移除，避免颜色拖影
    const root = document.documentElement
    const next = new Set(appliedKeys)
    prevKeysRef.current.forEach((k) => {
      if (!next.has(k)) root.style.removeProperty(k)
    })
    prevKeysRef.current = appliedKeys
  }, [activeThemeId])

  return (
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  )
}
