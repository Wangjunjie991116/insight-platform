import styles from './index.module.scss'

export interface ConfidenceRingProps {
  /** 0-1 的置信度 */
  value: number
  /** 环直径，默认 48 */
  size?: number
  /** 是否显示右侧文字标签 */
  showLabel?: boolean
  className?: string
}

export function ConfidenceRing({ value, size = 48, showLabel = true, className }: ConfidenceRingProps) {
  const clamped = Math.min(1, Math.max(0, value))
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clamped)

  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      <div className={styles.ring} style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle className={styles.track} cx={size / 2} cy={size / 2} r={radius} />
          <circle
            className={styles.bar}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className={styles.value}>{Math.round(clamped * 100)}%</span>
      </div>
      {showLabel && <span className={styles.label}>置信度</span>}
    </div>
  )
}

export default ConfidenceRing
