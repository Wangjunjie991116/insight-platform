/**
 * MSW Handlers：数据源管理。
 *
 * 覆盖端点：
 *   GET    /api/v1/datasources
 *   POST   /api/v1/datasources
 *   PUT    /api/v1/datasources/:id
 *   DELETE /api/v1/datasources/:id
 *   POST   /api/v1/datasources/test
 */

import { http, HttpResponse } from 'msw'

import {
  getDataSourcesByTeam,
  createDataSourceFixture,
  updateDataSourceFixture,
  deleteDataSourceFixture,
  simulateTestConnection,
} from '../fixtures/datasources'

import type {
  CreateDataSourceRequest,
  UpdateDataSourceRequest,
  TestConnectionRequest,
} from '@/api/types'

export const datasourceHandlers = [
  /** GET /datasources */
  http.get('/api/v1/datasources', ({ request }) => {
    const url = new URL(request.url)
    const teamId = url.searchParams.get('team_id')

    if (!teamId) {
      return HttpResponse.json({ detail: '缺少 team_id 参数' }, { status: 400 })
    }

    const items = getDataSourcesByTeam(teamId)
    return HttpResponse.json(items)
  }),

  /** POST /datasources */
  http.post('/api/v1/datasources', async ({ request }) => {
    const body = (await request.json()) as CreateDataSourceRequest
    if (!body.team_id || !body.name || !body.host || !body.database) {
      return HttpResponse.json({ detail: '请求参数不完整' }, { status: 422 })
    }

    const ds = createDataSourceFixture(body)
    return HttpResponse.json(ds, { status: 201 })
  }),

  /** PUT /datasources/:id */
  http.put('/api/v1/datasources/:id', async ({ params, request }) => {
    const id = params.id as string
    const body = (await request.json()) as UpdateDataSourceRequest

    const updated = updateDataSourceFixture(id, body)
    if (!updated) {
      return HttpResponse.json({ detail: '数据源不存在' }, { status: 404 })
    }
    return HttpResponse.json(updated)
  }),

  /** DELETE /datasources/:id */
  http.delete('/api/v1/datasources/:id', ({ params }) => {
    const id = params.id as string
    const existed = deleteDataSourceFixture(id)
    if (!existed) {
      return HttpResponse.json({ detail: '数据源不存在' }, { status: 404 })
    }
    return new HttpResponse(null, { status: 204 })
  }),

  /** POST /datasources/test */
  http.post('/api/v1/datasources/test', async ({ request }) => {
    const body = (await request.json()) as TestConnectionRequest
    if (!body.host || !body.port || !body.database || !body.user) {
      return HttpResponse.json({ detail: '连接参数不完整' }, { status: 422 })
    }

    const result = simulateTestConnection()
    return HttpResponse.json(result)
  }),
]
