/**
 * ThemeToken → ECharts 主题 JSON。
 *
 * echarts.registerTheme(name, themeJson) 接受一个 plain object，
 * 这里生成与当前 Token 对齐的配置：颜色系列、文本、轴线、提示框、留白。
 *
 * 系列色支持两种形态：
 *   - 纯色字符串（默认，速度快）
 *   - 线性渐变对象（强调视觉时使用，Chart 组件可选择传入 seriesGradient=true）
 */

import type { ThemeToken } from './tokens/types'

/** echarts 线性渐变构造器（from top to bottom） */
function linearGradient(from: string, to: string) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: from },
      { offset: 1, color: to },
    ],
  }
}

export interface ToEchartsThemeOptions {
  /** 是否把系列色转换为渐变（柱/面积适用），默认 false */
  seriesGradient?: boolean
}

export function toEchartsTheme(token: ThemeToken, options: ToEchartsThemeOptions = {}) {
  const { alias, map, shape } = token
  const { series, axis, grid, tooltipBg, tooltipText } = alias.chart

  const color = options.seriesGradient
    ? series.map((c, i) => linearGradient(c, series[(i + 2) % series.length]))
    : series

  return {
    color,
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: shape.font.family,
      color: map.text.primary,
    },
    title: {
      textStyle: { color: map.text.primary, fontWeight: 600 },
      subtextStyle: { color: map.text.tertiary },
    },
    legend: {
      textStyle: { color: map.text.secondary },
      inactiveColor: map.text.disabled,
    },
    tooltip: {
      backgroundColor: tooltipBg,
      borderWidth: 0,
      textStyle: { color: tooltipText, fontSize: shape.font.sizeSm },
      extraCssText: `backdrop-filter: blur(12px); border-radius: ${shape.radius.md}px;`,
    },
    grid: {
      left: 24,
      right: 24,
      top: 36,
      bottom: 28,
      containLabel: true,
      borderColor: grid,
    },
    categoryAxis: axisStyle(axis, grid, map.text.tertiary),
    valueAxis: axisStyle(axis, grid, map.text.tertiary),
    logAxis: axisStyle(axis, grid, map.text.tertiary),
    timeAxis: axisStyle(axis, grid, map.text.tertiary),
    line: {
      itemStyle: { borderWidth: 2 },
      lineStyle: { width: 3 },
      symbolSize: 8,
      symbol: 'circle',
      smooth: true,
    },
    bar: {
      itemStyle: {
        borderRadius: [shape.radius.sm, shape.radius.sm, 0, 0],
      },
    },
    pie: {
      itemStyle: {
        borderColor: 'transparent',
        borderWidth: 2,
      },
    },
    funnel: {
      label: { color: map.text.primary, fontWeight: 500 },
      itemStyle: { borderColor: 'transparent', borderWidth: 1 },
    },
    graph: {
      lineStyle: { color: alias.chart.grid, width: 1 },
      itemStyle: { borderWidth: 0 },
      label: { color: map.text.secondary },
    },
  }
}

function axisStyle(axisColor: string, gridColor: string, labelColor: string) {
  return {
    axisLine: { show: true, lineStyle: { color: axisColor } },
    axisTick: { show: false },
    axisLabel: { color: labelColor },
    splitLine: { show: true, lineStyle: { color: gridColor, type: 'dashed' } },
  }
}

/** 主题名常量：ThemedChart 统一使用这个名字引用当前主题 */
export const ECHARTS_THEME_NAME = 'insight-active'
