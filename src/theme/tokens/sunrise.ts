/**
 * Sunrise 主题：黄橙 AI 科技感，亮色。
 *
 * 设计意图：
 *   - 主色选琥珀金 #F59E0B，辅色烧橙 #EA580C，传递"数据燃起洞察"氛围
 *   - 背景使用米白偏暖的渐变，卡片半透明玻璃态悬浮其上
 *   - 图表系列色在主色温区内渐变，避免多色噪声
 */

import type { ThemeToken } from './types'

export const sunriseTheme: ThemeToken = {
  id: 'sunrise',
  name: '晨曦',
  mode: 'light',
  seed: {
    primary: '#F59E0B',
    primaryHover: '#FBBF24',
    primaryActive: '#D97706',
    secondary: '#EA580C',
    success: '#10B981',
    warning: '#FACC15',
    error: '#DC2626',
    info: '#38BDF8',
    gray: {
      50: '#FAFAF9',
      100: '#F5F5F4',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A8A29E',
      500: '#78716C',
      600: '#57534E',
      700: '#44403C',
      800: '#292524',
      900: '#1C1917',
    },
  },
  map: {
    bg: {
      // 页面底色：米白 → 淡橙径向，烘托暖色氛围
      page: 'radial-gradient(120% 90% at 0% 0%, #FFF8EE 0%, #FFEED9 55%, #FDE4C2 100%)',
      surface: 'rgba(255, 255, 255, 0.72)',
      surfaceHover: 'rgba(255, 255, 255, 0.88)',
      elevated: 'rgba(255, 253, 248, 0.96)',
      mask: 'rgba(28, 25, 23, 0.45)',
    },
    text: {
      primary: '#1C1917',
      secondary: '#44403C',
      tertiary: '#78716C',
      disabled: '#A8A29E',
      onPrimary: '#FFFFFF',
      link: '#EA580C',
    },
    border: {
      subtle: 'rgba(245, 158, 11, 0.14)',
      default: 'rgba(245, 158, 11, 0.26)',
      strong: 'rgba(234, 88, 12, 0.52)',
    },
    status: {
      successBg: 'rgba(16, 185, 129, 0.12)',
      warningBg: 'rgba(250, 204, 21, 0.18)',
      errorBg: 'rgba(220, 38, 38, 0.12)',
      infoBg: 'rgba(56, 189, 248, 0.14)',
    },
    brand: {
      gradient: 'linear-gradient(135deg, #FDBA74 0%, #F97316 45%, #EA580C 100%)',
      glow: '0 16px 40px -12px rgba(234, 88, 12, 0.35), 0 4px 12px -4px rgba(245, 158, 11, 0.25)',
    },
  },
  alias: {
    card: {
      bg: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.65)',
      shadow:
        '0 16px 40px -16px rgba(234, 88, 12, 0.22), 0 2px 8px -2px rgba(245, 158, 11, 0.18)',
      blur: '24px',
    },
    layout: {
      headerBg: 'rgba(255, 255, 255, 0.72)',
      siderBg: 'rgba(255, 250, 240, 0.78)',
      contentBg: 'transparent',
    },
    chart: {
      // 主色温区内的 6 档，折线 / 柱 / 饼块 / 漏斗之间可复用
      series: ['#F59E0B', '#EA580C', '#FB923C', '#FBBF24', '#B45309', '#F97316'],
      axis: 'rgba(68, 64, 60, 0.45)',
      grid: 'rgba(120, 113, 108, 0.18)',
      tooltipBg: 'rgba(28, 25, 23, 0.92)',
      tooltipText: '#FFF8EE',
    },
    code: {
      bg: 'rgba(28, 25, 23, 0.92)',
      text: '#F5F5F4',
      keyword: '#FDBA74',
      string: '#FCD34D',
      comment: '#A8A29E',
      number: '#FCA5A5',
    },
    step: {
      pendingBorder: 'rgba(168, 162, 158, 0.45)',
      runningGradient: 'conic-gradient(from 0deg, #FDBA74, #F97316, #EA580C, #FDBA74)',
      successBorder: '#10B981',
      failBorder: '#DC2626',
    },
  },
  shape: {
    radius: { sm: 6, md: 10, lg: 16, xl: 24, round: 9999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
    font: {
      family: "'Inter', 'PingFang SC', 'Noto Sans SC', system-ui, -apple-system, sans-serif",
      familyMono: "'JetBrains Mono', 'SF Mono', 'Menlo', Consolas, monospace",
      sizeBase: 14,
      sizeLg: 16,
      sizeSm: 13,
      sizeXs: 12,
    },
    motion: {
      fast: 120,
      base: 220,
      slow: 360,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
  },
}
