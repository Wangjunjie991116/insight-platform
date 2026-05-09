import { useMemo } from 'react'
import { useRequest } from 'ahooks'
import { Spin } from 'antd'

import { listTasks, getResult } from '@/api/tasks'
import type { Insight, AnalysisResult } from '@/api/types'
import { useTeamStore } from '@/store/teamStore'
import PageHeader from '@/components/PageHeader'
import ConfidenceRing from '@/components/ConfidenceRing'
import ThemedChart from '@/components/ThemedChart'
import EmptyState from '@/components/EmptyState'

import styles from './Insights.module.scss'

function detectChartType(data: Record<string, unknown>): 'funnel' | 'bar' | 'pie' | null {
  if (data.funnel && typeof data.funnel === 'object') return 'funnel'
  if (data.pie || data.pie_data) return 'pie'
  if (data.bar || data.bar_data || Array.isArray(data.values)) return 'bar'
  return null
}

function InsightChart({ data }: { data: Record<string, unknown> }) {
  const chartType = detectChartType(data)

  if (chartType === 'funnel') {
    const funnel = data.funnel as { steps?: string[]; values?: number[] }
    if (!funnel?.steps || !funnel?.values) return null
    return (
      <div className={styles.chartWrap}>
        <ThemedChart
          option={{
            tooltip: { trigger: 'item' },
            series: [{
              type: 'funnel',
              left: '10%',
              width: '80%',
              sort: 'descending',
              gap: 4,
              label: { show: true, position: 'inside', fontSize: 12 },
              data: funnel.steps.map((name, i) => ({ name, value: funnel.values![i] })),
            }],
          }}
          height={200}
        />
      </div>
    )
  }

  if (chartType === 'bar') {
    const values = (data.values ?? data.bar_data) as number[] | undefined
    const labels = (data.labels ?? data.categories) as string[] | undefined
    if (!values || !labels) return null
    return (
      <div className={styles.chartWrap}>
        <ThemedChart
          option={{
            tooltip: { trigger: 'axis' },
            grid: { left: 40, right: 16, top: 16, bottom: 28 },
            xAxis: { type: 'category', data: labels },
            yAxis: { type: 'value' },
            series: [{ type: 'bar', data: values }],
          }}
          height={200}
        />
      </div>
    )
  }

  if (chartType === 'pie') {
    const pieData = (data.pie ?? data.pie_data) as { name: string; value: number }[] | undefined
    if (!pieData) return null
    return (
      <div className={styles.chartWrap}>
        <ThemedChart
          option={{
            tooltip: { trigger: 'item' },
            series: [{
              type: 'pie',
              radius: ['30%', '60%'],
              data: pieData,
            }],
          }}
          height={200}
        />
      </div>
    )
  }

  return null
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <ConfidenceRing value={insight.confidence ?? 0} size={40} showLabel={false} />
        <div className={styles.cardBody}>
          <div className={styles.cardTitle}>{insight.title}</div>
          <div className={styles.cardDesc}>{insight.description}</div>
          {insight.impact && <div className={styles.cardImpact}>影响：{insight.impact}</div>}
        </div>
      </div>
      {insight.data_support && <InsightChart data={insight.data_support} />}
    </div>
  )
}

export default function InsightsPage() {
  const activeTeamId = useTeamStore((s) => s.activeTeamId)

  const { data: taskList, loading } = useRequest(
    () => listTasks({ team_id: activeTeamId, page: 1, page_size: 100 }),
    { refreshDeps: [activeTeamId] },
  )

  const completedTasks = useMemo(
    () => (taskList?.items ?? []).filter((t) => t.status === 'completed'),
    [taskList],
  )

  // 逐个获取结果
  const { data: allResults } = useRequest(
    async () => {
      const results = await Promise.all(
        completedTasks.map((t) => getResult(t.task_id).catch(() => null)),
      )
      return results.filter((r): r is AnalysisResult => r != null)
    },
    { ready: completedTasks.length > 0, refreshDeps: [completedTasks.length] },
  )

  const groupedInsights = useMemo(() => {
    const groups: Record<string, Insight[]> = {}
    const results = allResults ?? []
    results.forEach((r, i) => {
      const goal = completedTasks[i]?.message || `任务 ${i + 1}`
      if (r.insights?.length) {
        groups[goal] = r.insights
      }
    })
    return groups
  }, [allResults, completedTasks])

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }} />
  }

  const entries = Object.entries(groupedInsights)

  return (
    <div className={styles.page}>
      <PageHeader title="洞察" subtitle={`${completedTasks.length} 个已完成任务`} />

      {entries.length === 0 ? (
        <EmptyState title="暂无洞察" description="完成分析任务后，洞察将在此聚合展示" />
      ) : (
        entries.map(([goal, insights]) => (
          <div key={goal} className={styles.group}>
            <div className={styles.groupTitle}>{goal}</div>
            {insights.map((ins, i) => (
              <InsightCard key={i} insight={ins} />
            ))}
          </div>
        ))
      )}
    </div>
  )
}
