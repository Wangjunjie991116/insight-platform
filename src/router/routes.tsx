/**
 * 路由常量定义。
 *
 * 实际路由树在 App.tsx 中用 BrowserRouter + Routes 构建，
 * 以确保 ThemeProvider context 穿透到路由子树。
 */

export const ROUTE_PATHS = {
  overview: '/overview',
  tasks: '/tasks',
  newTask: '/tasks/new',
  taskDetail: '/tasks/:id',
  datasources: '/datasources',
  insights: '/insights',
  settings: '/settings',
} as const

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS]
