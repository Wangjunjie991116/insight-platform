import type { ReactNode } from 'react'
import { Button, Tooltip } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import styles from './index.module.scss'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  onRefresh?: () => void
  loading?: boolean
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, onRefresh, loading, actions, className }: PageHeaderProps) {
  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      <div className={styles.left}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      <div className={styles.actions}>
        {onRefresh && (
          <Tooltip title="刷新">
            <Button type="text" icon={<ReloadOutlined spin={loading} />} onClick={onRefresh} />
          </Tooltip>
        )}
        {actions}
      </div>
    </div>
  )
}

export default PageHeader
