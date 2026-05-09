import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons'

import styles from './index.module.scss'

export type StepStatus = 'pending' | 'running' | 'success' | 'fail'

export interface StepItem {
  title: string
  description?: string
  status: StepStatus
}

export interface StepProgressProps {
  steps: StepItem[]
  className?: string
}

function DotIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'running':
      return <LoadingOutlined />
    case 'success':
      return <CheckOutlined />
    case 'fail':
      return <CloseOutlined />
    default:
      return null
  }
}

export function StepProgress({ steps, className }: StepProgressProps) {
  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const lineStatus = step.status === 'success' ? 'success' : step.status === 'fail' ? 'fail' : undefined

        return (
          <div key={step.title} className={styles.step}>
            <div className={styles.rail}>
              <div className={`${styles.dot} ${styles[step.status]}`}>
                <DotIcon status={step.status} />
              </div>
              {!isLast && <div className={`${styles.line} ${lineStatus ? styles[lineStatus] : ''}`} />}
            </div>
            <div className={styles.body}>
              <div className={styles.title}>{step.title}</div>
              {step.description && <div className={styles.desc}>{step.description}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StepProgress
