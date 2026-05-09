import { useMemo } from 'react'
import { useRequest } from 'ahooks'
import { Tag, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

import { listTasks } from '@/api/tasks'
import type { TaskStatus } from '@/api/types'
import { useTeamStore } from '@/store/teamStore'
import ThemedChart from '@/components/ThemedChart'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'

import styles from './Overview.module.scss'

const STATUS_MAP: Record<TaskStatus, { color: string; label: string }> = {
  completed: { color: 'success', label: '已完成' },
  running: { color: 'processing', label: '运行中' },
  pending: { color: 'default', label: '待执行' },
  failed: { color: 'error', label: '失败' },
}

export default function OverviewPage() {
  const navigate = useNavigate()
  const activeTeamId = useTeamStore((s) => s.activeTeamId)

  const { data, loading, refresh } = useRequest(
    () => listTasks({ team_id: activeTeamId, page: 1, page_size: 100 }),
    { refreshDeps: [activeTeamId] },
  )

  const tasks = data?.items ?? []

  const metrics = useMemo(() => {
    const now = Date.now()
    const todayStart = new Date().setHours(0, 0, 0, 0)
    const weekStart = now - 7 * 24 * 3600_000

    const todayTasks = tasks.filter((t) => new Date(t.created_at).getTime() >= todayStart)
    const weekTasks = tasks.filter((t) => new Date(t.created_at).getTime() >= weekStart)
    const completedTasks = tasks.filter((t) => t.status === 'completed')
    const successRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

    const durations = completedTasks
      .map((t) => new Date(t.updated_at).getTime() - new Date(t.created_at).getTime())
      .filter((d) => d > 0)
    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 60_000)
      : 0

    return { todayCount: todayTasks.length, weekCount: weekTasks.length, successRate, avgDuration }
  }, [tasks])

  const trendData = useMemo(() => {
    const days: string[] = []
    const counts: number[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayStart = new Date(d).setHours(0, 0, 0, 0)
      const dayEnd = dayStart + 24 * 3600_000
      days.push(`${d.getMonth() + 1}/${d.getDate()}`)
      counts.push(tasks.filter((t) => {
        const ts = new Date(t.created_at).getTime()
        return ts >= dayStart && ts < dayEnd
      }).length)
    }
    return { days, counts }
  }, [tasks])

  const statusDist = useMemo(() => {
    const dist: Record<string, number> = { completed: 0, running: 0, pending: 0, failed: 0 }
    tasks.forEach((t) => { dist[t.status] = (dist[t.status] ?? 0) + 1 })
    return dist
  }, [tasks])

  const recent = tasks.slice(0, 5)

  if (loading && tasks.length === 0) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }} />
  }

  if (tasks.length === 0) {
    return (
      <div>
        <PageHeader title="概览" onRefresh={refresh} loading={loading} />
        <EmptyState title="暂无任务" description="创建第一个分析任务开始使用" />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader title="概览" subtitle={activeTeamId} onRefresh={refresh} loading={loading} />

      <div className={styles.kpiGrid}>
        <div className={styles.kpi}>
          <span className={styles.kpiLabel}>今日任务</span>
          <span className={styles.kpiValue}>{metrics.todayCount}</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiLabel}>本周任务</span>
          <span className={styles.kpiValue}>{metrics.weekCount}</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiLabel}>成功率</span>
          <span className={styles.kpiValue}>{metrics.successRate}%</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiLabel}>平均耗时</span>
          <span className={styles.kpiValue}>{metrics.avgDuration}<span className={styles.kpiExtra}> 分钟</span></span>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>近 7 天任务趋势</div>
          <ThemedChart
            option={{
              tooltip: { trigger: 'axis' },
              grid: { left: 40, right: 16, top: 16, bottom: 28 },
              xAxis: { type: 'category', data: trendData.days },
              yAxis: { type: 'value', minInterval: 1 },
              series: [{
                type: 'line',
                data: trendData.counts,
                smooth: true,
                areaStyle: { opacity: 0.15 },
                symbolSize: 6,
              }],
            }}
            height={240}
          />
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>状态分布</div>
          <ThemedChart
            option={{
              tooltip: { trigger: 'item' },
              legend: { bottom: 0, itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 12 } },
              series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                label: { show: false },
                data: Object.entries(statusDist)
                  .filter(([, v]) => v > 0)
                  .map(([k, v]) => ({ name: STATUS_MAP[k as TaskStatus]?.label ?? k, value: v })),
              }],
            }}
            height={240}
          />
        </div>
      </div>

      <div className={styles.recentCard}>
        <div className={styles.recentTitle}>最近任务</div>
        {recent.map((t) => (
          <div
            key={t.task_id}
            className={styles.recentItem}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/tasks/${t.task_id}`)}
          >
            <div className={styles.recentLeft}>
              <span className={styles.recentId}>{t.message || t.task_id}</span>
              <span className={styles.recentTime}>
                {new Date(t.created_at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <Tag color={STATUS_MAP[t.status]?.color}>{STATUS_MAP[t.status]?.label}</Tag>
          </div>
        ))}
      </div>
    </div>
  )
}
