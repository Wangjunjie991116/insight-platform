import { useState } from 'react'
import { Table, Tag } from 'antd'

import type { DataDictionary, TableColumn } from '@/api/types'

import styles from './index.module.scss'

export interface DataDictViewProps {
  data: DataDictionary
  className?: string
}

export function DataDictView({ data, className }: DataDictViewProps) {
  const tables = data.tables ?? []
  const [activeIdx, setActiveIdx] = useState(0)
  const activeTable = tables[activeIdx]

  const columns = [
    { title: '字段名', dataIndex: 'name', key: 'name', width: 160 },
    { title: '类型', dataIndex: 'data_type', key: 'data_type', width: 120 },
    {
      title: '可空',
      dataIndex: 'is_nullable',
      key: 'is_nullable',
      width: 60,
      render: (v?: boolean) => (v ? <Tag>YES</Tag> : <Tag>NO</Tag>),
    },
    {
      title: '键',
      dataIndex: 'is_key',
      key: 'is_key',
      width: 60,
      render: (v?: boolean) => (v ? <Tag color="blue">KEY</Tag> : '-'),
    },
    { title: '说明', dataIndex: 'description', key: 'description', ellipsis: true },
  ]

  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      <div className={styles.tableList}>
        {tables.length === 0 && <div className={styles.empty}>无表信息</div>}
        {tables.map((t, i) => (
          <div
            key={t.name}
            className={`${styles.tableItem} ${i === activeIdx ? styles.active : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            {t.name}
          </div>
        ))}
      </div>

      <div className={styles.fieldDetail}>
        {activeTable ? (
          <>
            <div style={{ marginBottom: 12, fontWeight: 600 }}>{activeTable.description || activeTable.name}</div>
            <Table<TableColumn>
              dataSource={activeTable.columns ?? []}
              columns={columns}
              rowKey="name"
              size="small"
              pagination={false}
            />
          </>
        ) : (
          <div className={styles.empty}>选择左侧表查看字段详情</div>
        )}
      </div>
    </div>
  )
}

export default DataDictView
