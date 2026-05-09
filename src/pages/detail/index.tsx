import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Tag, Button, Alert, Tabs, Spin } from 'antd'
import { RedoOutlined } from '@ant-design/icons'

import { getTask, runTask, getResult } from '@/api/tasks'
import type { TaskStatus, AnalysisResult, Insight } from '@/api/types'
import StepProgress from '@/components/StepProgress'
import type { StepStatus } from '@/components/StepProgress'
import ConfidenceRing from '@/components/ConfidenceRing'
import CodeViewer from '@/components/CodeViewer'
import JsonTree from '@/components/JsonTree'
import DataDictView from '@/components/DataDictView'
import EmptyState from '@/components/EmptyState'

import styles from './Detail.module.scss'

const STATUS_MAP: Record<TaskStatus, { color: string; label: string }> = {
  completed: { color: 'success', label: '已完成' },
  running: { color: 'processing', label: '运行中' },
  pending: { color: 'default', label: '待执行' },
  failed: { color: 'error', label: '失败' },
}

const PIPELINE_STEPS = [
  { title: '数据理解', agent: 'Agent 1' },
  { title: '策略设计', agent: 'Agent 2' },
  { title: '代码生成', agent: 'Agent 3' },
  { title: '代码执行', agent: 'Agent 4' },
  { title: '洞察生成', agent: 'Agent 5' },
]

interface PlanStep {
  agent?: string
  name?: string
  description?: string
}

function getPipelineSteps(status: TaskStatus, result?: AnalysisResult) {
  const plan = result?.analysis_plan as Record<string, unknown> | undefined
  const planSteps = (plan?.steps ?? []) as PlanStep[]
  const stepCount = planSteps.length || 5

  return PIPELINE_STEPS.slice(0, stepCount).map((s, i) => {
    let stepStatus: StepStatus = 'pending'
    if (status === 'completed') {
      stepStatus = 'success'
    } else if (status === 'running') {
      stepStatus = i < 2 ? 'success' : i === 2 ? 'running' : 'pending'
    } else if (status === 'failed') {
      stepStatus = i < 3 ? 'success' : i === 3 ? 'fail' : 'pending'
    }
    return {
      title: s.title,
      description: planSteps[i]?.description ?? s.agent,
      status: stepStatus,
    }
  })
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--ix-border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <ConfidenceRing value={insight.confidence ?? 0} size={44} showLabel={false} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{insight.title}</div>
          <div style={{ fontSize: 13, color: 'var(--ix-text-tertiary)', marginBottom: 8 }}>{insight.description}</div>
          {insight.impact && (
            <div style={{ fontSize: 13, color: 'var(--ix-color-primary)' }}>影响：{insight.impact}</div>
          )}
        </div>
      </div>
      {insight.data_support && (
        <div style={{ marginTop: 12 }}>
          <JsonTree data={insight.data_support} defaultExpandDepth={1} />
        </div>
      )}
    </div>
  )
}

export default function TaskDetailPage() {
  const { id: taskId } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('insights')
  const pollingRef = useRef<ReturnType<typeof setInterval>>()

  const { data: task, loading: taskLoading, refresh: refreshTask } = useRequest(
    () => getTask(taskId!),
    { ready: !!taskId, refreshDeps: [taskId] },
  )

  const { data: result, refresh: refreshResult } = useRequest(
    () => getResult(taskId!),
    {
      ready: !!taskId && task?.status === 'completed',
      refreshDeps: [taskId, task?.status],
      manual: false,
    },
  )

  // §9.3 轮询：running 时每 3s 刷新
  useEffect(() => {
    if (task?.status === 'running') {
      pollingRef.current = setInterval(() => {
        refreshTask()
      }, 3000)
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [task?.status, refreshTask])

  // 完成时刷新结果
  useEffect(() => {
    if (task?.status === 'completed' && !result) {
      refreshResult()
    }
  }, [task?.status, result, refreshResult])

  const handleRerun = async () => {
    if (!taskId) return
    try {
      await runTask(taskId)
      refreshTask()
    } catch {}
  }

  if (taskLoading && !task) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }} />
  }

  if (!task) {
    return <EmptyState title="任务不存在" description="请检查任务 ID 是否正确" />
  }

  const pipelineSteps = getPipelineSteps(task.status, result)

  const tabItems = [
    {
      key: 'insights',
      label: '洞察',
      children: result?.insights?.length ? (
        <div>{result.insights.map((ins, i) => <InsightCard key={i} insight={ins} />)}</div>
      ) : (
        <EmptyState title="暂无洞察" description="任务完成后将自动生成洞察" />
      ),
    },
    {
      key: 'data',
      label: '数据',
      children: result?.data_dict ? (
        <DataDictView data={result.data_dict} />
      ) : (
        <EmptyState title="暂无数据" description="任务完成后将展示数据字典" />
      ),
    },
    {
      key: 'plan',
      label: '计划',
      children: result?.analysis_plan ? (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>{(result.analysis_plan as Record<string, unknown>).objective as string}</div>
          <JsonTree data={result.analysis_plan} defaultExpandDepth={2} />
        </div>
      ) : (
        <EmptyState title="暂无计划" />
      ),
    },
    {
      key: 'code',
      label: '代码',
      children: result?.generated_code ? (
        <CodeViewer code={result.generated_code} language="python" title="分析脚本" filename="analysis.py" />
      ) : (
        <EmptyState title="暂无代码" />
      ),
    },
    {
      key: 'result',
      label: '结果',
      children: result?.execution_result?.output ? (
        <JsonTree data={result.execution_result.output} defaultExpandDepth={2} />
      ) : (
        <EmptyState title="暂无结果" />
      ),
    },
    {
      key: 'logs',
      label: '日志',
      children: result?.execution_result?.logs ? (
        <CodeViewer code={result.execution_result.logs} language="plaintext" title="执行日志" />
      ) : (
        <EmptyState title="暂无日志" />
      ),
    },
  ]

  return (
    <div className={styles.page}>
      {/* §9.1 元信息卡 */}
      <div className={styles.metaCard}>
        <div className={styles.metaLeft}>
          <div className={styles.metaTitle}>{task.message || task.task_id}</div>
          <div className={styles.metaInfo}>
            <span>ID: {task.task_id}</span>
            <span>团队: {task.team_id}</span>
            <Tag color={STATUS_MAP[task.status]?.color}>{STATUS_MAP[task.status]?.label}</Tag>
            <span>创建: {new Date(task.created_at).toLocaleString('zh-CN')}</span>
            <span>更新: {new Date(task.updated_at).toLocaleString('zh-CN')}</span>
          </div>
        </div>
        {task.status !== 'running' && (
          <Button icon={<RedoOutlined />} onClick={handleRerun}>
            重跑
          </Button>
        )}
      </div>

      {/* §9.5 失败提示 */}
      {task.status === 'failed' && (
        <Alert type="error" message="任务执行失败" description={task.message} showIcon />
      )}

      {/* §9.2 流水线进度 */}
      <div className={styles.pipelineSection}>
        <div className={styles.pipelineTitle}>执行流水线</div>
        <StepProgress steps={pipelineSteps} />
      </div>

      {/* §9.4 Tabs */}
      {task.status === 'completed' ? (
        <div className={styles.tabCard}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        </div>
      ) : (
        <div className={styles.tabCard}>
          <EmptyState
            title={task.status === 'running' ? '分析进行中' : '等待执行'}
            description={task.status === 'running' ? '流水线执行中，请稍候...' : '任务待执行'}
          />
        </div>
      )}
    </div>
  )
}
