/**
 * 应用主布局：Antd Layout + 自定义顶栏/侧栏 + 玻璃态内容区。
 *
 * 不使用 @ant-design/pro-components（peer 暂未支持 antd 6）。
 */

import { Suspense, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Spin, Avatar, Tooltip } from 'antd'
import {
  DashboardOutlined,
  UnorderedListOutlined,
  PlusCircleOutlined,
  DatabaseOutlined,
  BulbOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'

import TeamSwitcher from '@/components/TeamSwitcher'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useTeamStore } from '@/store/teamStore'

import styles from './AppLayout.module.scss'

const { Header, Sider, Content } = Layout

const siderItems = [
  { key: '/overview', icon: <DashboardOutlined />, label: '概览' },
  { key: '/tasks', icon: <UnorderedListOutlined />, label: '任务列表' },
  { key: '/tasks/new', icon: <PlusCircleOutlined />, label: '新建任务' },
  { key: '/datasources', icon: <DatabaseOutlined />, label: '数据源' },
  { key: '/insights', icon: <BulbOutlined />, label: '洞察' },
  { key: '/settings', icon: <SettingOutlined />, label: '设置' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const activeTeamId = useTeamStore((s) => s.activeTeamId)

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  // 根据当前路径高亮侧栏
  const selectedKey = location.pathname.startsWith('/tasks/') && location.pathname !== '/tasks/new'
    ? '/tasks'
    : location.pathname

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo} />
          <span className={`ix-gradient-text ${styles.brand}`}>Insight</span>
        </div>
        <div className={styles.headerRight}>
          <TeamSwitcher />
          <span className={styles.divider} />
          <ThemeSwitcher />
          <span className={styles.divider} />
          <Tooltip title="用户设置">
            <Avatar size={28} icon={<UserOutlined />} className={styles.avatar} />
          </Tooltip>
        </div>
      </Header>

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className={styles.sider}
          width={180}
          theme="light"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={siderItems}
            onClick={handleMenuClick}
            className={styles.menu}
          />
        </Sider>

        <Content className={styles.content}>
          {activeTeamId ? (
            <Suspense fallback={<Spin size="large" className={styles.spin} />}>
              <Outlet />
            </Suspense>
          ) : (
            <div className={styles.noTeam}>
              <p>请先选择团队以开始使用</p>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
