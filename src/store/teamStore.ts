/**
 * 团队状态：当前团队 ID 与团队列表，localStorage 持久化。
 *
 * apiClient 的请求拦截器通过 subscribe 监听 activeTeamId 变化，
 * 无需每次请求都读 localStorage。
 */

import { create } from 'zustand'

export interface Team {
  id: string
  name: string
  avatar?: string
}

const STORAGE_KEY = 'insight-platform:activeTeamId'

// MVP 阶段硬编码团队列表，后续对接 /api/v1/teams 接口
const MOCK_TEAMS: Team[] = [
  { id: 'team-alpha', name: 'Alpha 团队', avatar: '🅰️' },
  { id: 'team-beta', name: 'Beta 团队', avatar: '🅱️' },
  { id: 'team-gamma', name: 'Gamma 团队', avatar: '🅶️' },
]

function readInitialTeamId(): string {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

interface TeamState {
  activeTeamId: string
  teams: Team[]
  setActiveTeamId: (id: string) => void
}

export const useTeamStore = create<TeamState>((set) => ({
  activeTeamId: readInitialTeamId(),
  teams: MOCK_TEAMS,
  setActiveTeamId: (id) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // ignore
    }
    set({ activeTeamId: id })
  },
}))
