import { useState, useEffect, useCallback } from 'react'
import { useRequest } from 'ahooks'
import { Steps, Select, Input, Button, message, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

import { listDataSources } from '@/api/datasources'
import { createTask, runTask } from '@/api/tasks'
import type { DataSource } from '@/api/types'
import { useTeamStore } from '@/store/teamStore'
import PageHeader from '@/components/PageHeader'

import styles from './NewTask.module.scss'

const DRAFT_KEY = 'insight-platform:draft-task'

interface Draft {
  datasourceId: string
  businessDoc: string
  businessGoal: string
}

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { datasourceId: '', businessDoc: '', businessGoal: '' }
}

function saveDraft(d: Draft) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)) } catch {}
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch {}
}

export default function NewTaskPage() {
  const navigate = useNavigate()
  const activeTeamId = useTeamStore((s) => s.activeTeamId)

  const [current, setCurrent] = useState(0)
  const [draft, setDraft] = useState<Draft>(loadDraft)
  const [submitting, setSubmitting] = useState(false)

  const { data: datasources = [], loading: dsLoading } = useRequest(
    () => listDataSources(activeTeamId),
    { refreshDeps: [activeTeamId] },
  )

  // 自动保存草稿
  useEffect(() => { saveDraft(draft) }, [draft])

  const update = useCallback(<K extends keyof Draft>(key: K, val: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: val }))
  }, [])

  const handleSubmit = async () => {
    if (!draft.datasourceId) { message.warning('请选择数据源'); return }
    if (!draft.businessDoc.trim()) { message.warning('请填写业务文档'); return }
    if (!draft.businessGoal.trim()) { message.warning('请填写业务目标'); return }

    const ds = datasources.find((d: DataSource) => d.id === draft.datasourceId)
    if (!ds) { message.error('数据源不存在'); return }

    setSubmitting(true)
    try {
      const task = await createTask({
        team_id: activeTeamId,
        db_config: {
          host: ds.host,
          port: ds.port,
          database: ds.database,
          user: ds.user,
          password: ds.password,
          schema: ds.schema,
        },
        business_doc: draft.businessDoc,
        business_goal: draft.businessGoal,
      })
      await runTask(task.task_id)
      clearDraft()
      message.success('任务已创建并开始执行')
      navigate(`/tasks/${task.task_id}`)
    } catch {
      // handled by interceptor
    } finally {
      setSubmitting(false)
    }
  }

  const canNext = current === 0
    ? !!draft.datasourceId
    : current === 1
      ? draft.businessDoc.trim().length > 0 && draft.businessGoal.trim().length > 0
      : true

  const steps = [
    { title: '选择数据源' },
    { title: '描述业务' },
    { title: '确认提交' },
  ]

  return (
    <div className={styles.page}>
      <PageHeader
        title="新建任务"
        actions={
          <span className={styles.draftTag}>草稿自动保存</span>
        }
      />

      <Steps current={current} items={steps} size="small" />

      <div className={styles.stepContent}>
        {current === 0 && (
          <>
            <div className={styles.formItem}>
              <span className={styles.label}>数据源</span>
              {dsLoading ? <Spin /> : (
                <Select
                  value={draft.datasourceId || undefined}
                  onChange={(v) => update('datasourceId', v)}
                  placeholder="选择已有数据源"
                  style={{ width: '100%' }}
                  options={datasources.map((ds: DataSource) => ({
                    value: ds.id,
                    label: `${ds.name} (${ds.type} - ${ds.host}/${ds.database})`,
                  }))}
                />
              )}
              <span className={styles.hint}>如需新建数据源，请前往数据源管理页面</span>
            </div>
          </>
        )}

        {current === 1 && (
          <>
            <div className={styles.formItem}>
              <span className={styles.label}>业务文档</span>
              <Input.TextArea
                value={draft.businessDoc}
                onChange={(e) => update('businessDoc', e.target.value)}
                placeholder="描述业务场景、数据背景、关注重点..."
                rows={6}
                maxLength={5000}
                showCount
              />
            </div>
            <div className={styles.formItem}>
              <span className={styles.label}>业务目标</span>
              <Input.TextArea
                value={draft.businessGoal}
                onChange={(e) => update('businessGoal', e.target.value)}
                placeholder="明确本次分析的核心目标..."
                rows={3}
                maxLength={500}
                showCount
              />
            </div>
          </>
        )}

        {current === 2 && (
          <>
            <div className={styles.formItem}>
              <span className={styles.label}>数据源</span>
              <span>{datasources.find((d: DataSource) => d.id === draft.datasourceId)?.name || draft.datasourceId}</span>
            </div>
            <div className={styles.formItem}>
              <span className={styles.label}>业务文档</span>
              <span style={{ whiteSpace: 'pre-wrap' }}>{draft.businessDoc}</span>
            </div>
            <div className={styles.formItem}>
              <span className={styles.label}>业务目标</span>
              <span>{draft.businessGoal}</span>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <div>
            {current > 0 && <Button onClick={() => setCurrent(current - 1)}>上一步</Button>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {current < 2 && (
              <Button type="primary" disabled={!canNext} onClick={() => setCurrent(current + 1)}>
                下一步
              </Button>
            )}
            {current === 2 && (
              <Button type="primary" loading={submitting} onClick={handleSubmit}>
                提交并执行
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
