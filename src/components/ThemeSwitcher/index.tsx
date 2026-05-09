/**
 * 主题切换组件：顶栏下拉，展示 4 个主题名 + 色块预览。
 */

import { Dropdown, type MenuProps } from 'antd'
import { BgColorsOutlined } from '@ant-design/icons'

import { useThemeStore } from '@/store/themeStore'
import { THEME_IDS, getTheme } from '@/theme/tokens'

export default function ThemeSwitcher() {
  const { activeThemeId, setActiveThemeId } = useThemeStore()

  const menuItems: MenuProps['items'] = THEME_IDS.map((id) => {
    const theme = getTheme(id)
    return {
      key: id,
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: theme.seed.primary,
              boxShadow: `0 0 4px ${theme.seed.primary}40`,
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          />
          {theme.name}
        </span>
      ),
    }
  })

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    setActiveThemeId(key as typeof activeThemeId)
  }

  const currentTheme = getTheme(activeThemeId)

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleClick, selectedKeys: [activeThemeId] }} trigger={['click']}>
      <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <BgColorsOutlined />
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: currentTheme.seed.primary,
          }}
        />
        {currentTheme.name}
      </span>
    </Dropdown>
  )
}
