import type { HTMLAttributes, ReactNode } from 'react'

import styles from './index.module.scss'

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** 开启后 hover 上浮 + 光晕 */
  hoverable?: boolean
}

export function GlassCard({ hoverable, className, children, ...rest }: GlassCardProps) {
  return (
    <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className ?? ''}`} {...rest}>
      {children}
    </div>
  )
}

export default GlassCard
