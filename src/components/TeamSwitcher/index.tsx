/**
 * 团队切换组件：顶栏下拉，未选择时引导到 /settings。
 *
 * 切换后全局 teamStore 更新，apiClient 自动带上新 team_id。
 */

import { Dropdown, type MenuProps } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { useTeamStore } from '@/store/teamStore'

export default function TeamSwitcher() {
  const navigate = useNavigate()
  const { activeTeamId, teams, setActiveTeamId } = useTeamStore()

  const activeTeam = teams.find((t) => t.id === activeTeamId)

  const menuItems: MenuProps['items'] = [
    ...teams.map((team) => ({
      key: team.id,
      label: (
        <span>
          {team.avatar} {team.name}
        </span>
      ),
    })),
    { type: 'divider' as const },
    {
      key: 'manage',
      label: '管理团队…',
    },
  ]

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'manage') {
      navigate('/settings')
      return
    }
    setActiveTeamId(key)
  }

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleClick, selectedKeys: activeTeamId ? [activeTeamId] : [] }} trigger={['click']}>
      <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <TeamOutlined />
        {activeTeam ? `${activeTeam.avatar} ${activeTeam.name}` : '选择团队'}
      </span>
    </Dropdown>
  )
}
