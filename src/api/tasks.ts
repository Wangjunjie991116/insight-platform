/**
 * 任务管理 API。
 *
 * 覆盖完整生命周期：列表查询 → 创建 → 详情 → 执行 → 结果。
 */

import { apiClient } from './client'
import type {
  CreateTaskRequest,
  ListTasksParams,
  ListTasksResponse,
  TaskResponse,
  AnalysisResult,
} from './types'

/** GET /tasks — 任务列表（支持分页、状态过滤、关键词搜索） */
export function listTasks(params: ListTasksParams): Promise<ListTasksResponse> {
  return apiClient
    .get('/tasks', { params })
    .then((res) => res.data)
}

/** POST /tasks — 创建分析任务 */
export function createTask(data: CreateTaskRequest): Promise<TaskResponse> {
  return apiClient.post('/tasks', data).then((res) => res.data)
}

/** GET /tasks/:id — 任务详情 */
export function getTask(taskId: string): Promise<TaskResponse> {
  return apiClient.get(`/tasks/${taskId}`).then((res) => res.data)
}

/** POST /tasks/:id/run — 启动 Agent 流水线执行 */
export function runTask(taskId: string): Promise<AnalysisResult> {
  return apiClient.post(`/tasks/${taskId}/run`).then((res) => res.data)
}

/** GET /tasks/:id/result — 获取完整分析结果 */
export function getResult(taskId: string): Promise<AnalysisResult> {
  return apiClient.get(`/tasks/${taskId}/result`).then((res) => res.data)
}
