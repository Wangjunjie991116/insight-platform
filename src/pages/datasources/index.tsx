import { useState } from 'react'
import { useRequest } from 'ahooks'
import {
  Button, Modal, Form, Input, Select, InputNumber, Spin, message, Popconfirm,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ApiOutlined } from '@ant-design/icons'

import {
  listDataSources, createDataSource, updateDataSource, deleteDataSource, testConnection,
} from '@/api/datasources'
import type { DataSource, DataSourceType } from '@/api/types'
import { useTeamStore } from '@/store/teamStore'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'

import styles from './Datasources.module.scss'

const DS_TYPE_OPTIONS: { value: DataSourceType; label: string }[] = [
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'clickhouse', label: 'ClickHouse' },
  { value: 'bigquery', label: 'BigQuery' },
]

const DEFAULT_PORTS: Record<DataSourceType, number> = {
  postgresql: 5432,
  mysql: 3306,
  clickhouse: 8123,
  bigquery: 443,
}

interface FormValues {
  name: string
  type: DataSourceType
  host: string
  port: number
  database: string
  user: string
  password: string
  schema?: string
  description?: string
}

export default function DataSourcesPage() {
  const activeTeamId = useTeamStore((s) => s.activeTeamId)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<DataSource | null>(null)
  const [testing, setTesting] = useState(false)
  const [form] = Form.useForm<FormValues>()

  const { data: datasources = [], loading, refresh } = useRequest(
    () => listDataSources(activeTeamId),
    { refreshDeps: [activeTeamId] },
  )

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ type: 'postgresql', port: 5432 })
    setModalOpen(true)
  }

  const openEdit = (ds: DataSource) => {
    setEditing(ds)
    form.setFieldsValue({
      name: ds.name,
      type: ds.type,
      host: ds.host,
      port: ds.port,
      database: ds.database,
      user: ds.user,
      password: ds.password,
      schema: ds.schema,
      description: ds.description,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      if (editing) {
        await updateDataSource(editing.id, values)
        message.success('更新成功')
      } else {
        await createDataSource({ team_id: activeTeamId, ...values })
        message.success('创建成功')
      }
      setModalOpen(false)
      refresh()
    } catch {}
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDataSource(id)
      message.success('已删除')
      refresh()
    } catch {}
  }

  const handleTest = async () => {
    const values = await form.validateFields(['type', 'host', 'port', 'database', 'user', 'password'])
    setTesting(true)
    try {
      const res = await testConnection(values as Parameters<typeof testConnection>[0])
      if (res.success) {
        message.success(`连接成功 (${res.latency_ms ?? '?'}ms)`)
      } else {
        message.error(`连接失败: ${res.message}`)
      }
    } catch {
      message.error('连接测试异常')
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }} />
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="数据源管理"
        onRefresh={refresh}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新建数据源
          </Button>
        }
      />

      {datasources.length === 0 ? (
        <EmptyState title="暂无数据源" description="创建数据源以开始分析任务" />
      ) : (
        <div className={styles.grid}>
          {datasources.map((ds) => (
            <div key={ds.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardName}>{ds.name}</span>
                <span className={styles.cardType}>{ds.type}</span>
              </div>
              <div className={styles.cardInfo}>
                <span>{ds.host}:{ds.port}/{ds.database}</span>
                {ds.description && <span>{ds.description}</span>}
              </div>
              <div className={styles.cardActions}>
                <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(ds)}>
                  编辑
                </Button>
                <Popconfirm
                  title="确认删除"
                  description={`输入 "${ds.name}" 确认删除`}
                  onConfirm={() => handleDelete(ds.id)}
                  okText="删除"
                  cancelText="取消"
                >
                  <Button type="text" size="small" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? '编辑数据源' : '新建数据源'}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? '保存' : '创建'}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="如：生产库" />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select options={DS_TYPE_OPTIONS} onChange={(v: DataSourceType) => form.setFieldsValue({ port: DEFAULT_PORTS[v] })} />
          </Form.Item>
          <Form.Item name="host" label="主机" rules={[{ required: true, message: '请输入主机地址' }]}>
            <Input placeholder="如：localhost" />
          </Form.Item>
          <Form.Item name="port" label="端口" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} max={65535} />
          </Form.Item>
          <Form.Item name="database" label="数据库" rules={[{ required: true, message: '请输入数据库名' }]}>
            <Input placeholder="如：mydb" />
          </Form.Item>
          <Form.Item name="user" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="schema" label="Schema">
            <Input placeholder="可选" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="可选" />
          </Form.Item>
          <Form.Item>
            <Button icon={<ApiOutlined />} loading={testing} onClick={handleTest}>
              测试连接
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
