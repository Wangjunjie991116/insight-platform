/**
 * echarts 按需注册：集中声明项目用到的组件与图表类型。
 *
 * 为什么放在这里：echarts/core 默认不带任何图表和组件，需显式 use()
 * 统一在此注册，业务代码只需 import ThemedChart，不再各自操心 echarts 内部。
 */

import {
  BarChart,
  LineChart,
  PieChart,
  FunnelChart,
  GraphChart,
  ScatterChart,
  GaugeChart,
  RadarChart,
} from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  VisualMapComponent,
  ToolboxComponent,
} from 'echarts/components'
import { use as echartsUse } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

// 图表类型

// 组件

let registered = false

/** 幂等注册：多次调用不重复 use */
export function registerEcharts(): void {
  if (registered) return
  echartsUse([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    FunnelChart,
    GraphChart,
    ScatterChart,
    GaugeChart,
    RadarChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    MarkLineComponent,
    MarkAreaComponent,
    MarkPointComponent,
    VisualMapComponent,
    ToolboxComponent,
  ])
  registered = true
}
