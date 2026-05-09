/**
 * API 类型定义。
 *
 * 主要来源：
 *   - insight-x/docs/openapi.yaml 中定义的 Schema
 *   - 设计文档中补充的列表查询、数据源管理类型
 */

// ─── 基础类型 ───

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface DatabaseConfig {
  host: string
  port?: number
  database: string
  user: string
  password: string
  schema?: string
}

// ─── 任务相关 ───

export interface CreateTaskRequest {
  team_id: string
  db_config: DatabaseConfig
  business_doc: string
  business_goal: string
}

export interface TaskResponse {
  task_id: string
  team_id: string
  status: TaskStatus
  created_at: string
  updated_at: string
  message?: string
}

export interface ListTasksParams {
  team_id: string
  status?: TaskStatus
  keyword?: string
  page?: number
  page_size?: number
}

export interface ListTasksResponse {
  items: TaskResponse[]
  total: number
  page: number
  page_size: number
}

// ─── 分析结果 ───

export interface TableColumn {
  name: string
  data_type: string
  is_nullable?: boolean
  description?: string
  is_key?: boolean
}

export interface TableInfo {
  name: string
  description?: string
  columns?: TableColumn[]
  row_count?: number
}

export interface DataDictionary {
  tables?: TableInfo[]
  relations?: Record<string, unknown>[]
  key_fields?: string[]
  summary?: string
}

export interface Insight {
  title: string
  description: string
  data_support?: Record<string, unknown>
  impact?: string
  confidence?: number
}

export interface Strategy {
  name: string
  target_segment?: string
  trigger_condition?: string
  action?: string
  expected_effect?: string
  risk_assessment?: string
  config?: Record<string, unknown>
}

export interface ExecutionResult {
  success: boolean
  output?: Record<string, unknown>
  logs?: string
  error?: string | null
  duration_ms?: number
}

export interface AnalysisResult {
  task_id: string
  data_dict?: DataDictionary
  analysis_plan?: Record<string, unknown>
  generated_code?: string
  execution_result?: ExecutionResult
  insights?: Insight[]
  strategies?: Strategy[]
}

// ─── 通用响应 ───

export interface ErrorResponse {
  detail: string
}

export interface HealthResponse {
  status: 'healthy'
}

// ─── 数据源管理（前端 mock 层使用） ───

export type DataSourceType = 'postgresql' | 'mysql' | 'clickhouse' | 'bigquery'

export interface DataSource {
  id: string
  team_id: string
  name: string
  type: DataSourceType
  host: string
  port: number
  database: string
  user: string
  password: string
  schema?: string
  description?: string
  created_at: string
  updated_at: string
  status: 'connected' | 'disconnected' | 'testing'
}

export interface CreateDataSourceRequest {
  team_id: string
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

export interface UpdateDataSourceRequest {
  name?: string
  type?: DataSourceType
  host?: string
  port?: number
  database?: string
  user?: string
  password?: string
  schema?: string
  description?: string
}

export interface TestConnectionRequest {
  type: DataSourceType
  host: string
  port: number
  database: string
  user: string
  password: string
  schema?: string
}

export interface TestConnectionResponse {
  success: boolean
  message: string
  latency_ms?: number
}
