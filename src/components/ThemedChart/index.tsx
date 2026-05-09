import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts/core'
import ReactEChartsMod from 'echarts-for-react/lib/core'
import { useMemo, type CSSProperties } from 'react'

import { registerEcharts } from '../echartsCore'

import { useThemeStore } from '@/store/themeStore'
import { ECHARTS_THEME_NAME } from '@/theme/toEchartsTheme'


const ReactECharts = (ReactEChartsMod as { default?: typeof ReactEChartsMod }).default ?? ReactEChartsMod

// 模块首次加载时注册一次，避免每个图表实例各自触发
registerEcharts()

export interface ThemedChartProps {
  /** echarts option 对象，传什么配置都支持 */
  option: EChartsOption
  /** 容器高度，默认 320 */
  height?: number | string
  /** 容器宽度，默认 100% */
  width?: number | string
  /** 额外类名 */
  className?: string
  /** 额外样式 */
  style?: CSSProperties
  /** 加载态遮罩 */
  loading?: boolean
  /** 是否根据容器自适应（默认 true） */
  autoResize?: boolean
  /** 点击事件（透传至 echarts）*/
  onEvents?: Record<string, (params: unknown) => void>
}

/**
 * 主题化 ECharts 封装：
 *  - 订阅 themeStore.activeThemeId，主题切换时用新 key 让组件重建（registerTheme 已覆盖同名主题，
 *    但 echarts-for-react 对主题变更不会自动重绘，所以这里用 key 强制 reinit）
 *  - 所有图表用同一个主题名 ECHARTS_THEME_NAME，主题定义在 ThemeProvider 注册
 */
export function ThemedChart({
  option,
  height = 320,
  width = '100%',
  className,
  style,
  loading,
  autoResize = true,
  onEvents,
}: ThemedChartProps) {
  const activeThemeId = useThemeStore((s) => s.activeThemeId)

  // 防止 option 引用变化触发过度重绘：浅记忆化
  const memoOption = useMemo(() => option, [option])

  return (
    <ReactECharts
      // key 变化强制销毁重建，让 ECHARTS_THEME_NAME 的最新注册生效
      key={activeThemeId}
      echarts={echarts}
      theme={ECHARTS_THEME_NAME}
      option={memoOption}
      style={{ height, width, ...style }}
      className={className}
      lazyUpdate
      showLoading={loading}
      opts={{ renderer: 'canvas' }}
      onEvents={onEvents}
      loadingOption={{
        text: '加载中',
        color: getComputedStyle(document.documentElement).getPropertyValue('--ix-color-primary').trim() || '#F59E0B',
        textColor: getComputedStyle(document.documentElement).getPropertyValue('--ix-text-secondary').trim() || '#44403C',
        maskColor: 'rgba(255, 255, 255, 0.4)',
        zlevel: 0,
      }}
      {...(autoResize ? { notMerge: true } : { notMerge: true })}
    />
  )
}

export default ThemedChart
