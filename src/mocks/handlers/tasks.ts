/**
 * MSW Handlers：任务管理。
 *
 * 覆盖端点：
 *   GET    /api/v1/tasks
 *   POST   /api/v1/tasks
 *   GET    /api/v1/tasks/:id
 *   POST   /api/v1/tasks/:id/run
 *   GET    /api/v1/tasks/:id/result
 */

import { http, HttpResponse } from 'msw'

import {
  getTasksByTeam,
  getTaskById,
  createTaskFixture,
  startTaskLifecycle,
  getTaskResult,
} from '../fixtures/tasks'

import type { CreateTaskRequest, ListTasksParams } from '@/api/types'

export const taskHandlers = [
  /** GET /tasks — 列表查询 */
  http.get('/api/v1/tasks', ({ request }) => {
    const url = new URL(request.url)
    const teamId = url.searchParams.get('team_id')
    const status = url.searchParams.get('status') as ListTasksParams['status']
    const keyword = url.searchParams.get('keyword') || undefined

    if (!teamId) {
      return HttpResponse.json({ detail: '缺少 team_id 参数' }, { status: 400 })
    }

    let items = getTasksByTeam(teamId)

    if (status) {
      items = items.filter((t) => t.status === status)
    }
    if (keyword) {
      const kw = keyword.toLowerCase()
      items = items.filter(
        (t) =>
          t.task_id.toLowerCase().includes(kw) ||
          (t.message ?? '').toLowerCase().includes(kw),
      )
    }

    const page = Number(url.searchParams.get('page') ?? '1')
    const pageSize = Number(url.searchParams.get('page_size') ?? '20')
    const total = items.length
    const start = (page - 1) * pageSize
    const paginated = items.slice(start, start + pageSize)

    return HttpResponse.json({
      items: paginated,
      total,
      page,
      page_size: pageSize,
    })
  }),

  /** POST /tasks — 创建任务 */
  http.post('/api/v1/tasks', async ({ request }) => {
    const body = (await request.json()) as CreateTaskRequest
    if (!body.team_id || !body.business_doc || !body.business_goal) {
      return HttpResponse.json({ detail: '请求参数不完整' }, { status: 422 })
    }

    const task = createTaskFixture(body.team_id, body.business_goal)
    return HttpResponse.json(task, { status: 201 })
  }),

  /** GET /tasks/:id — 详情 */
  http.get('/api/v1/tasks/:taskId', ({ params }) => {
    const taskId = params.taskId as string
    const task = getTaskById(taskId)
    if (!task) {
      return HttpResponse.json({ detail: '任务不存在' }, { status: 404 })
    }
    return HttpResponse.json(task)
  }),

  /** POST /tasks/:id/run — 启动执行 */
  http.post('/api/v1/tasks/:taskId/run', ({ params }) => {
    const taskId = params.taskId as string
    const task = getTaskById(taskId)
    if (!task) {
      return HttpResponse.json({ detail: '任务不存在' }, { status: 404 })
    }

    startTaskLifecycle(taskId)

    // 立即返回当前状态（running），结果通过 /result 或轮询 /:id 获取
    return HttpResponse.json({
      task_id: taskId,
      status: 'running',
      message: 'Agent 流水线已启动',
    })
  }),

  /** GET /tasks/:id/result — 获取结果 */
  http.get('/api/v1/tasks/:taskId/result', ({ params }) => {
    const taskId = params.taskId as string
    const task = getTaskById(taskId)
    if (!task) {
      return HttpResponse.json({ detail: '任务不存在' }, { status: 404 })
    }

    if (task.status !== 'completed') {
      return HttpResponse.json(
        { detail: `任务尚未完成，当前状态：${task.status}` },
        { status: 400 },
      )
    }

    const result = getTaskResult(taskId)
    if (!result) {
      return HttpResponse.json({ detail: '结果数据缺失' }, { status: 500 })
    }

    return HttpResponse.json(result)
  }),
]
