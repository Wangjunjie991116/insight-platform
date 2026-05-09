/**
 * 应用根组件：挂载路由。
 *
 * 使用 BrowserRouter + Routes，确保 ThemeProvider 的 context
 * 能穿透到路由子树。ThemeProvider 在 main.tsx 外层已包裹。
 */

import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Spin } from 'antd'

import AppLayout from '@/layouts/AppLayout'
import { ROUTE_PATHS } from '@/router/routes'

// 懒加载页面
const LazyOverview = lazy(() => import('@/pages/overview'))
const LazyTaskList = lazy(() => import('@/pages/tasks'))
const LazyNewTask = lazy(() => import('@/pages/new'))
const LazyTaskDetail = lazy(() => import('@/pages/detail'))
const LazyDataSources = lazy(() => import('@/pages/datasources'))
const LazyInsights = lazy(() => import('@/pages/insights'))
const LazySettings = lazy(() => import('@/pages/settings'))

const fallback = <Spin size="large" style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }} />

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Suspense fallback={fallback}><LazyOverview /></Suspense>} />
          <Route path={ROUTE_PATHS.overview} element={<Suspense fallback={fallback}><LazyOverview /></Suspense>} />
          <Route path={ROUTE_PATHS.tasks} element={<Suspense fallback={fallback}><LazyTaskList /></Suspense>} />
          <Route path={ROUTE_PATHS.newTask} element={<Suspense fallback={fallback}><LazyNewTask /></Suspense>} />
          <Route path={ROUTE_PATHS.taskDetail} element={<Suspense fallback={fallback}><LazyTaskDetail /></Suspense>} />
          <Route path={ROUTE_PATHS.datasources} element={<Suspense fallback={fallback}><LazyDataSources /></Suspense>} />
          <Route path={ROUTE_PATHS.insights} element={<Suspense fallback={fallback}><LazyInsights /></Suspense>} />
          <Route path={ROUTE_PATHS.settings} element={<Suspense fallback={fallback}><LazySettings /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
