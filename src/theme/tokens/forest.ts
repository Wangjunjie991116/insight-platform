/**
 * Forest 主题（占位）：墨绿森系，亮色。
 */

import { sunriseTheme } from './sunrise'
import type { ThemeToken } from './types'


export const forestTheme: ThemeToken = {
  ...sunriseTheme,
  id: 'forest',
  name: '林语',
  mode: 'light',
  seed: {
    primary: '#059669',
    primaryHover: '#10B981',
    primaryActive: '#047857',
    secondary: '#0D9488',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#DC2626',
    info: '#0EA5E9',
    gray: sunriseTheme.seed.gray,
  },
  map: {
    ...sunriseTheme.map,
    bg: {
      page: 'radial-gradient(120% 90% at 0% 0%, #F0FDF4 0%, #DCFCE7 55%, #BBF7D0 100%)',
      surface: 'rgba(255, 255, 255, 0.72)',
      surfaceHover: 'rgba(255, 255, 255, 0.88)',
      elevated: 'rgba(247, 254, 249, 0.96)',
      mask: 'rgba(6, 78, 59, 0.45)',
    },
    text: {
      primary: '#064E3B',
      secondary: '#065F46',
      tertiary: '#047857',
      disabled: '#A7F3D0',
      onPrimary: '#FFFFFF',
      link: '#0D9488',
    },
    border: {
      subtle: 'rgba(5, 150, 105, 0.14)',
      default: 'rgba(5, 150, 105, 0.26)',
      strong: 'rgba(13, 148, 136, 0.52)',
    },
    status: sunriseTheme.map.status,
    brand: {
      gradient: 'linear-gradient(135deg, #6EE7B7 0%, #10B981 45%, #047857 100%)',
      glow: '0 16px 40px -12px rgba(5, 150, 105, 0.35), 0 4px 12px -4px rgba(13, 148, 136, 0.25)',
    },
  },
  alias: {
    ...sunriseTheme.alias,
    card: {
      bg: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.65)',
      shadow:
        '0 16px 40px -16px rgba(5, 150, 105, 0.22), 0 2px 8px -2px rgba(13, 148, 136, 0.18)',
      blur: '24px',
    },
    layout: {
      headerBg: 'rgba(255, 255, 255, 0.72)',
      siderBg: 'rgba(240, 253, 244, 0.78)',
      contentBg: 'transparent',
    },
    chart: {
      series: ['#059669', '#0D9488', '#10B981', '#22C55E', '#84CC16', '#14B8A6'],
      axis: 'rgba(6, 95, 70, 0.45)',
      grid: 'rgba(5, 150, 105, 0.18)',
      tooltipBg: 'rgba(6, 78, 59, 0.92)',
      tooltipText: '#F0FDF4',
    },
  },
}
