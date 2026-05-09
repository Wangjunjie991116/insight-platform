import { useState, useMemo } from 'react'
import { useRequest } from 'ahooks'
import { Table, Tag, Input, Select, Button, Modal, Space, Spin } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import { listTasks, runTask } from '@/api/tasks'
import type { TaskStatus, TaskResponse } from '@/api/types'
import { useTeamStore } from '@/store/teamStore'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'

import styles from './Tasks.module.scss'

const STATUS_MAP: Record<TaskStatus, { color: string; label: string }> = {
  completed: { color: 'success', label: '已完成' },
  running: { color: 'processing', label: '运行中' },
  pending: { color: 'default', label: '待执行' },
  failed: { color: 'error', label: '失败' },
}

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'completed', label: '已完成' },
  { value: 'running', label: '运行中' },
  { value: 'pending', label: '待执行' },
  { value: 'failed', label: '失败' },
]

export default function TaskListPage() {
  const navigate = useNavigate()
  const activeTeamId = useTeamStore((s) => s.activeTeamId)

  const [statusFilter, setStatusFilter] = useState<string>('')
  const [keyword, setKeyword] = useState('')
  const [rerunId, setRerunId] = useState<string | null>(null)

  const { data, loading, refresh } = useRequest(
    () => listTasks({ team_id: activeTeamId, page: 1, page_size: 200 }),
    { refreshDeps: [activeTeamId] },
  )

  const allTasks = data?.items ?? []

  // 客户端过滤
  const filtered = useMemo(() => {
    let result = allTasks
    if (statusFilter) result = result.filter((t) => t.status === statusFilter)
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(
        (t) => t.task_id.toLowerCase().includes(kw) || (t.message ?? '').toLowerCase().includes(kw),
      )
    }
    return result
  }, [allTasks, statusFilter, keyword])

  const handleRerun = async (taskId: string) => {
    try {
      await runTask(taskId)
      setRerunId(null)
      refresh()
    } catch {
      // error handled by apiClient interceptor
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'task_id',
      key: 'task_id',
      width: 140,
      render: (id: string) => (
        <a onClick={() => navigate(`/tasks/${id}`)} style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {id.length > 12 ? `…${id.slice(-8)}` : id}
        </a>
      ),
    },
    {
      title: '业务目标',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: TaskStatus) => <Tag color={STATUS_MAP[s]?.color}>{STATUS_MAP[s]?.label}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (v: string) => new Date(v).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 160,
      render: (v: string) => new Date(v).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: TaskResponse) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => navigate(`/tasks/${record.task_id}`)}>
            详情
          </Button>
          {record.status !== 'running' && (
            <Button type="link" size="small" onClick={() => setRerunId(record.task_id)}>
              重跑
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <PageHeader
        title="任务列表"
        onRefresh={refresh}
        loading={loading}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/tasks/new')}>
            新建任务
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          style={{ width: 120 }}
        />
        <Input
          className={styles.search}
          placeholder="搜索任务 ID / 目标"
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          allowClear
        />
      </div>

      {loading && allTasks.length === 0 ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="暂无任务"
          description={allTasks.length === 0 ? '点击"新建任务"创建第一个分析任务' : '没有匹配的任务'}
        />
      ) : (
        <Table<TaskResponse>
          dataSource={filtered}
          columns={columns}
          rowKey="task_id"
          size="middle"
          pagination={{ pageSize: 15, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
        />
      )}

      <Modal
        open={!!rerunId}
        title="确认重跑"
        onOk={() => rerunId && handleRerun(rerunId)}
        onCancel={() => setRerunId(null)}
        okText="确认重跑"
        cancelText="取消"
      >
        <p>确认要重新执行此任务吗？</p>
      </Modal>
    </div>
  )
}
