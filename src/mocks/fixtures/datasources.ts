/**
 * 数据源 Mock Fixtures。
 */

import type { DataSource } from '@/api/types'

const datasourceStore = new Map<string, DataSource>()
let idCounter = 1

function genId(): string {
  return `ds-${String(idCounter++).padStart(3, '0')}`
}

function nowIso(): string {
  return new Date().toISOString()
}

const seedDataSources: DataSource[] = [
  {
    id: genId(),
    team_id: 'team-demo',
    name: '主数据库 (PostgreSQL)',
    type: 'postgresql',
    host: 'db.insight-x.internal',
    port: 5432,
    database: 'analytics',
    user: 'analyst',
    password: '••••••••',
    schema: 'public',
    description: '核心业务数据库，含订单、用户、商品表',
    created_at: '2026-04-01T08:00:00Z',
    updated_at: '2026-04-15T10:30:00Z',
    status: 'connected',
  },
  {
    id: genId(),
    team_id: 'team-demo',
    name: 'ClickHouse 数仓',
    type: 'clickhouse',
    host: 'ch.insight-x.internal',
    port: 8123,
    database: 'events',
    user: 'readonly',
    password: '••••••••',
    description: '用户行为事件数据，用于漏斗分析',
    created_at: '2026-04-10T06:00:00Z',
    updated_at: '2026-04-20T14:00:00Z',
    status: 'connected',
  },
]

seedDataSources.forEach((ds) => datasourceStore.set(ds.id, ds))

export function getAllDataSources(): DataSource[] {
  return Array.from(datasourceStore.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export function getDataSourcesByTeam(teamId: string): DataSource[] {
  return getAllDataSources().filter((ds) => ds.team_id === teamId)
}

export function getDataSourceById(id: string): DataSource | undefined {
  return datasourceStore.get(id)
}

export function createDataSourceFixture(
  data: Omit<DataSource, 'id' | 'created_at' | 'updated_at' | 'status'>,
): DataSource {
  const ds: DataSource = {
    ...data,
    id: genId(),
    created_at: nowIso(),
    updated_at: nowIso(),
    status: 'disconnected',
  }
  datasourceStore.set(ds.id, ds)
  return ds
}

export function updateDataSourceFixture(
  id: string,
  patch: Partial<Omit<DataSource, 'id' | 'created_at'>>,
): DataSource | undefined {
  const existing = datasourceStore.get(id)
  if (!existing) return undefined
  const updated: DataSource = {
    ...existing,
    ...patch,
    updated_at: nowIso(),
  }
  datasourceStore.set(id, updated)
  return updated
}

export function deleteDataSourceFixture(id: string): boolean {
  return datasourceStore.delete(id)
}

/** 模拟连接测试：90% 成功率 */
export function simulateTestConnection(): {
  success: boolean
  message: string
  latency_ms: number
} {
  const success = Math.random() < 0.9
  const latency_ms = Math.round(50 + Math.random() * 450)
  return {
    success,
    message: success ? '连接成功' : '连接失败：认证被拒绝',
    latency_ms,
  }
}
