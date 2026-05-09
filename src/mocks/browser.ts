/**
 * MSW Service Worker 初始化入口（浏览器端）。
 */

import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
