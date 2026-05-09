/**
 * Midnight 主题（占位）：深色模式。
 * 把 map/alias 层替换为暗色，验证亮暗切换的完整性。
 */

import { sunriseTheme } from './sunrise'
import type { ThemeToken } from './types'


export const midnightTheme: ThemeToken = {
  ...sunriseTheme,
  id: 'midnight',
  name: '子夜',
  mode: 'dark',
  seed: {
    primary: '#FBBF24',
    primaryHover: '#FCD34D',
    primaryActive: '#F59E0B',
    secondary: '#F97316',
    success: '#34D399',
    warning: '#FACC15',
    error: '#F87171',
    info: '#60A5FA',
    gray: sunriseTheme.seed.gray,
  },
  map: {
    bg: {
      page: 'radial-gradient(120% 90% at 0% 0%, #1C1917 0%, #0C0A09 60%, #030712 100%)',
      surface: 'rgba(41, 37, 36, 0.65)',
      surfaceHover: 'rgba(68, 64, 60, 0.75)',
      elevated: 'rgba(28, 25, 23, 0.95)',
      mask: 'rgba(3, 7, 18, 0.65)',
    },
    text: {
      primary: '#FAFAF9',
      secondary: '#D6D3D1',
      tertiary: '#A8A29E',
      disabled: '#57534E',
      onPrimary: '#1C1917',
      link: '#FBBF24',
    },
    border: {
      subtle: 'rgba(251, 191, 36, 0.16)',
      default: 'rgba(251, 191, 36, 0.28)',
      strong: 'rgba(249, 115, 22, 0.5)',
    },
    status: {
      successBg: 'rgba(52, 211, 153, 0.16)',
      warningBg: 'rgba(250, 204, 21, 0.18)',
      errorBg: 'rgba(248, 113, 113, 0.18)',
      infoBg: 'rgba(96, 165, 250, 0.18)',
    },
    brand: {
      gradient: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 45%, #B45309 100%)',
      glow: '0 16px 40px -12px rgba(251, 191, 36, 0.4), 0 4px 12px -4px rgba(249, 115, 22, 0.3)',
    },
  },
  alias: {
    ...sunriseTheme.alias,
    card: {
      bg: 'rgba(41, 37, 36, 0.55)',
      border: '1px solid rgba(251, 191, 36, 0.18)',
      shadow:
        '0 16px 40px -16px rgba(0, 0, 0, 0.6), 0 2px 8px -2px rgba(251, 191, 36, 0.12)',
      blur: '28px',
    },
    layout: {
      headerBg: 'rgba(28, 25, 23, 0.72)',
      siderBg: 'rgba(12, 10, 9, 0.78)',
      contentBg: 'transparent',
    },
    chart: {
      series: ['#FBBF24', '#F97316', '#FB923C', '#FCD34D', '#60A5FA', '#34D399'],
      axis: 'rgba(214, 211, 209, 0.45)',
      grid: 'rgba(168, 162, 158, 0.18)',
      tooltipBg: 'rgba(250, 250, 249, 0.95)',
      tooltipText: '#1C1917',
    },
    code: {
      bg: 'rgba(12, 10, 9, 0.96)',
      text: '#F5F5F4',
      keyword: '#FBBF24',
      string: '#FCD34D',
      comment: '#78716C',
      number: '#FCA5A5',
    },
    step: {
      pendingBorder: 'rgba(120, 113, 108, 0.55)',
      runningGradient: 'conic-gradient(from 0deg, #FCD34D, #F59E0B, #B45309, #FCD34D)',
      successBorder: '#34D399',
      failBorder: '#F87171',
    },
  },
}
