/**
 * Axios 实例封装。
 *
 * - baseURL 从 VITE_API_BASE_URL 读取
 * - 请求拦截器注入 team_id（从 teamStore 读取）
 * - 响应拦截器统一处理 4xx/5xx 错误，用 Antd notification 提示
 */

import { notification } from 'antd'
import axios, { type AxiosInstance, type AxiosError } from 'axios'

import { useTeamStore } from '@/store/teamStore'

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：注入 team_id
apiClient.interceptors.request.use((config) => {
  const teamId = useTeamStore.getState().activeTeamId
  if (teamId) {
    config.headers['X-Team-Id'] = teamId
    if (config.data && typeof config.data === 'object' && !config.data.team_id) {
      config.data.team_id = teamId
    }
    // GET 请求自动拼 team_id 查询参数
    if (config.method === 'get' || !config.method) {
      config.params = { ...config.params, team_id: teamId }
    }
  }
  return config
})

// 响应拦截器：统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    const status = error.response?.status
    const detail = error.response?.data?.detail || error.message || '未知错误'

    if (status === 401) {
      return Promise.reject(error)
    }

    if (error.config?.url?.includes('/health')) {
      return Promise.reject(error)
    }

    notification.error({
      message: `请求失败 (${status ?? '网络'})`,
      description: detail,
      duration: 4,
    })

    return Promise.reject(error)
  },
)
