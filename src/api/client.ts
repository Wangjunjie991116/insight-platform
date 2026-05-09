/**
 * Axios 实例封装。
 *
 * - baseURL 从 VITE_API_BASE_URL 读取
 * - 请求拦截器注入 team_id（优先从 localStorage 读取，后续 §4 切到 teamStore）
 * - 响应拦截器统一处理 4xx/5xx 错误，用 Antd notification 提示
 */

import { notification } from 'antd'
import axios, { type AxiosInstance, type AxiosError } from 'axios'

const TEAM_STORAGE_KEY = 'insight-platform:activeTeamId'

/** 从 localStorage 读取当前团队 ID（§4 后迁移到 teamStore） */
function getActiveTeamId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(TEAM_STORAGE_KEY)
  } catch {
    return null
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：注入 team_id
apiClient.interceptors.request.use((config) => {
  const teamId = getActiveTeamId()
  if (teamId) {
    config.headers['X-Team-Id'] = teamId
    // 如果请求体是对象且没有 team_id，自动补上
    if (config.data && typeof config.data === 'object' && !config.data.team_id) {
      config.data.team_id = teamId
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

    // 静默处理 401（后续权限体系接入后再展开）
    if (status === 401) {
      return Promise.reject(error)
    }

    // 避免在 MSW /health 探活失败时刷屏
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
