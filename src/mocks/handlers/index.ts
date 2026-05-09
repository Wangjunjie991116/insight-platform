/**
 * MSW Handlers 汇总入口。
 */

import { datasourceHandlers } from './datasources'
import { taskHandlers } from './tasks'

export const handlers = [...taskHandlers, ...datasourceHandlers]
