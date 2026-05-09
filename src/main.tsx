/**
 * 应用入口。
 *
 * 顺序：
 *   1. 导入全局样式（含 CSS reset 与 Antd 关键覆盖）
 *   2. 启动 MSW（仅开发期且 VITE_ENABLE_MOCK=true）
 *   3. 挂载 ThemeProvider（内部顺带注入 Antd ConfigProvider 与 echarts 主题）
 *   4. 渲染 <App />
 *
 * MSW 启动放在渲染前，保证首屏请求就能被拦截到；
 * 生产环境通过 import.meta.env.DEV 分支让 bundler tree-shake 掉整段 mock 代码。
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import { ThemeProvider } from '@/theme/ThemeProvider'


import './styles/global.scss'

async function enableMockIfNeeded() {
  // 双重守卫：只在开发环境 + 显式开启 mock 时启动 worker
  if (!import.meta.env.DEV) return
  if (import.meta.env.VITE_ENABLE_MOCK !== 'true') return

  try {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    })
    // 开发调试用
    console.info('[MSW] mock worker started')
  } catch (err) {
    // mocks 文件可能尚未创建（§3 才补齐），此处静默降级以不阻断开发
    console.warn('[MSW] disabled:', err)
  }
}

async function bootstrap() {
  await enableMockIfNeeded()

  const container = document.getElementById('root')
  if (!container) throw new Error('#root not found')

  createRoot(container).render(
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>,
  )
}

void bootstrap()
