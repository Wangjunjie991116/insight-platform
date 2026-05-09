/**
 * Aurora 主题（占位）：紫蓝极光，亮色。
 * 与 sunrise 结构完全对齐，仅替换色值，用于验证切主题机制。
 */

import { sunriseTheme } from './sunrise'
import type { ThemeToken } from './types'


export const auroraTheme: ThemeToken = {
  ...sunriseTheme,
  id: 'aurora',
  name: '极光',
  mode: 'light',
  seed: {
    primary: '#6366F1',
    primaryHover: '#818CF8',
    primaryActive: '#4F46E5',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#F43F5E',
    info: '#38BDF8',
    gray: sunriseTheme.seed.gray,
  },
  map: {
    ...sunriseTheme.map,
    bg: {
      page: 'radial-gradient(120% 90% at 0% 0%, #F5F3FF 0%, #EEF2FF 55%, #E0E7FF 100%)',
      surface: 'rgba(255, 255, 255, 0.72)',
      surfaceHover: 'rgba(255, 255, 255, 0.88)',
      elevated: 'rgba(250, 249, 255, 0.96)',
      mask: 'rgba(30, 27, 75, 0.45)',
    },
    text: {
      primary: '#1E1B4B',
      secondary: '#3730A3',
      tertiary: '#6366F1',
      disabled: '#A5B4FC',
      onPrimary: '#FFFFFF',
      link: '#8B5CF6',
    },
    border: {
      subtle: 'rgba(99, 102, 241, 0.14)',
      default: 'rgba(99, 102, 241, 0.26)',
      strong: 'rgba(139, 92, 246, 0.52)',
    },
    status: sunriseTheme.map.status,
    brand: {
      gradient: 'linear-gradient(135deg, #A5B4FC 0%, #6366F1 45%, #8B5CF6 100%)',
      glow: '0 16px 40px -12px rgba(99, 102, 241, 0.35), 0 4px 12px -4px rgba(139, 92, 246, 0.25)',
    },
  },
  alias: {
    ...sunriseTheme.alias,
    card: {
      bg: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.65)',
      shadow:
        '0 16px 40px -16px rgba(99, 102, 241, 0.22), 0 2px 8px -2px rgba(139, 92, 246, 0.18)',
      blur: '24px',
    },
    layout: {
      headerBg: 'rgba(255, 255, 255, 0.72)',
      siderBg: 'rgba(245, 243, 255, 0.78)',
      contentBg: 'transparent',
    },
    chart: {
      series: ['#6366F1', '#8B5CF6', '#A78BFA', '#38BDF8', '#4F46E5', '#C084FC'],
      axis: 'rgba(55, 48, 163, 0.45)',
      grid: 'rgba(99, 102, 241, 0.18)',
      tooltipBg: 'rgba(30, 27, 75, 0.92)',
      tooltipText: '#F5F3FF',
    },
  },
}
