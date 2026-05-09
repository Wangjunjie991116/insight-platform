import type { ReactNode } from 'react'
import { InboxOutlined } from '@ant-design/icons'

import styles from './index.module.scss'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  className?: string
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      <div className={styles.icon}>{icon ?? <InboxOutlined style={{ fontSize: 48 }} />}</div>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.desc}>{description}</div>}
    </div>
  )
}

export default EmptyState
