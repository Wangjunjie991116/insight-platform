/**
 * ThemeToken → Antd 5 ThemeConfig 映射。
 *
 * 职责：把本项目 token 映射到 Antd 官方 token（同名但结构不同），
 *       只在这里做"翻译"，业务组件永远只认 ThemeToken，不直接消费 Antd token。
 */

import type { ThemeConfig } from 'antd'
import { theme as antdTheme } from 'antd'

import type { ThemeToken } from './tokens/types'

export function toAntdTheme(token: ThemeToken): ThemeConfig {
  const { seed, map, shape, mode } = token

  return {
    algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: seed.primary,
      colorSuccess: seed.success,
      colorWarning: seed.warning,
      colorError: seed.error,
      colorInfo: seed.info,
      colorLink: map.text.link,
      colorTextBase: map.text.primary,
      colorBgBase: mode === 'dark' ? '#0C0A09' : '#FFFFFF',
      borderRadius: shape.radius.md,
      borderRadiusLG: shape.radius.lg,
      borderRadiusSM: shape.radius.sm,
      borderRadiusXS: shape.radius.sm - 2,
      fontFamily: shape.font.family,
      fontSize: shape.font.sizeBase,
      fontSizeLG: shape.font.sizeLg,
      fontSizeSM: shape.font.sizeSm,
      motionDurationFast: `${shape.motion.fast}ms`,
      motionDurationMid: `${shape.motion.base}ms`,
      motionDurationSlow: `${shape.motion.slow}ms`,
      wireframe: false,
    },
    components: {
      Layout: {
        headerBg: 'transparent',
        bodyBg: 'transparent',
        siderBg: 'transparent',
      },
      Menu: {
        itemBg: 'transparent',
        subMenuItemBg: 'transparent',
        itemSelectedBg: 'rgba(245, 158, 11, 0.12)',
        itemHoverBg: 'rgba(245, 158, 11, 0.08)',
      },
      Card: {
        colorBgContainer: map.bg.surface,
        headerBg: 'transparent',
      },
      Table: {
        headerBg: 'transparent',
        rowHoverBg: 'rgba(245, 158, 11, 0.06)',
      },
      Button: {
        primaryShadow: '0 4px 12px -4px rgba(245, 158, 11, 0.45)',
      },
      Modal: {
        contentBg: map.bg.elevated,
      },
      Drawer: {
        colorBgElevated: map.bg.elevated,
      },
      Steps: {
        colorPrimary: seed.primary,
      },
    },
  }
}
