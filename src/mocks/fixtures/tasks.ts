/**
 * 任务 Mock Fixtures。
 *
 * 含：
 *   - 初始任务数据集（多状态覆盖）
 *   - pending→running→completed/failed 状态流转模拟
 *   - 内存存储 + 按 team_id 过滤
 */

import type { TaskResponse, TaskStatus, AnalysisResult } from '@/api/types'

/** 内存中的任务仓库（开发期 mock，重启即重置） */
const taskStore = new Map<string, TaskResponse>()
const resultStore = new Map<string, AnalysisResult>()

let idCounter = 1

function genId(): string {
  return `task-${String(idCounter++).padStart(4, '0')}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString()
}

// ─── 初始数据 ───

const seedTasks: TaskResponse[] = [
  {
    task_id: genId(),
    team_id: 'team-demo',
    status: 'completed',
    created_at: minutesAgo(120),
    updated_at: minutesAgo(95),
    message: '分析完成，生成 3 条洞察',
  },
  {
    task_id: genId(),
    team_id: 'team-demo',
    status: 'running',
    created_at: minutesAgo(30),
    updated_at: minutesAgo(5),
    message: 'Agent 3 代码生成中',
  },
  {
    task_id: genId(),
    team_id: 'team-demo',
    status: 'pending',
    created_at: minutesAgo(10),
    updated_at: minutesAgo(10),
    message: '等待执行',
  },
  {
    task_id: genId(),
    team_id: 'team-demo',
    status: 'failed',
    created_at: minutesAgo(180),
    updated_at: minutesAgo(170),
    message: '沙箱执行超时',
  },
  {
    task_id: genId(),
    team_id: 'team-demo',
    status: 'completed',
    created_at: minutesAgo(300),
    updated_at: minutesAgo(280),
    message: '分析完成，生成 5 条洞察',
  },
]

seedTasks.forEach((t) => taskStore.set(t.task_id, t))

// ─── 对外 API ───

export function getAllTasks(): TaskResponse[] {
  return Array.from(taskStore.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export function getTasksByTeam(teamId: string): TaskResponse[] {
  return getAllTasks().filter((t) => t.team_id === teamId)
}

export function getTaskById(taskId: string): TaskResponse | undefined {
  return taskStore.get(taskId)
}

export function createTaskFixture(
  teamId: string,
  _businessGoal: string,
): TaskResponse {
  const task: TaskResponse = {
    task_id: genId(),
    team_id: teamId,
    status: 'pending',
    created_at: nowIso(),
    updated_at: nowIso(),
    message: '任务已创建',
  }
  taskStore.set(task.task_id, task)
  return task
}

export function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  message?: string,
): TaskResponse | undefined {
  const task = taskStore.get(taskId)
  if (!task) return undefined
  const updated: TaskResponse = {
    ...task,
    status,
    updated_at: nowIso(),
    message: message ?? task.message,
  }
  taskStore.set(taskId, updated)
  return updated
}

export function setTaskResult(taskId: string, result: AnalysisResult): void {
  resultStore.set(taskId, result)
}

export function getTaskResult(taskId: string): AnalysisResult | undefined {
  return resultStore.get(taskId)
}

/**
 * 启动状态流转：
 *   1. 立即置为 running
 *   2. 约 12–18s 后随机完成（90% completed / 10% failed）
 */
export function startTaskLifecycle(taskId: string): void {
  const task = taskStore.get(taskId)
  if (!task || task.status !== 'pending') return

  updateTaskStatus(taskId, 'running', 'Agent 流水线执行中')

  const delay = 12_000 + Math.random() * 6_000
  const succeed = Math.random() < 0.9

  setTimeout(() => {
    if (succeed) {
      updateTaskStatus(taskId, 'completed', '分析完成')
      // 预置结果数据（由 insights fixture 提供）
      import('./insights')
        .then(({ buildResultForTask }) => {
          setTaskResult(taskId, buildResultForTask(taskId))
        })
        .catch(() => {
          // 若 insights fixture 尚未加载，静默跳过
        })
    } else {
      updateTaskStatus(taskId, 'failed', '沙箱执行异常终止')
    }
  }, delay)
}
