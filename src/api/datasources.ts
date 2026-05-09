/**
 * 数据源管理 API。
 *
 * 开发期由 MSW 拦截，生产环境对接 insight-x 真实接口。
 */

import { apiClient } from './client'
import type {
  DataSource,
  CreateDataSourceRequest,
  UpdateDataSourceRequest,
  TestConnectionRequest,
  TestConnectionResponse,
} from './types'

/** GET /datasources — 当前团队的数据源列表 */
export function listDataSources(teamId: string): Promise<DataSource[]> {
  return apiClient
    .get('/datasources', { params: { team_id: teamId } })
    .then((res) => res.data)
}

/** POST /datasources — 新建数据源 */
export function createDataSource(data: CreateDataSourceRequest): Promise<DataSource> {
  return apiClient.post('/datasources', data).then((res) => res.data)
}

/** PUT /datasources/:id — 更新数据源 */
export function updateDataSource(
  id: string,
  data: UpdateDataSourceRequest,
): Promise<DataSource> {
  return apiClient.put(`/datasources/${id}`, data).then((res) => res.data)
}

/** DELETE /datasources/:id — 删除数据源 */
export function deleteDataSource(id: string): Promise<void> {
  return apiClient.delete(`/datasources/${id}`).then((res) => res.data)
}

/** POST /datasources/test — 测试连接 */
export function testConnection(data: TestConnectionRequest): Promise<TestConnectionResponse> {
  return apiClient.post('/datasources/test', data).then((res) => res.data)
}
