/**
 * 应用根组件（MVP 阶段）。
 *
 * 当前只渲染一个占位欢迎页，用来验证：
 *   - ThemeProvider 正常工作（Antd 组件跟随主题）
 *   - SCSS token 变量在 :root 上生效
 *   - ThemedChart 可渲染示例
 *
 * 路由、布局、页面将在 §4 / §6-§13 陆续接入，接入后本文件仅负责挂载 <RouterProvider>。
 */

import { Button, Segmented, Space, Tag, Typography } from 'antd'

import styles from './App.module.scss'

import ThemedChart from '@/components/ThemedChart'
import { useThemeStore } from '@/store/themeStore'
import { THEME_IDS, getTheme } from '@/theme/tokens'


const { Title, Paragraph } = Typography

// 示例 option：漏斗图 + 模拟转化数据，用来直观验证图表主题切换
const demoFunnelOption = {
  title: { text: '示例 · 用户转化漏斗', left: 'center' },
  tooltip: { trigger: 'item' as const, formatter: '{b}: {c} 人 ({d}%)' },
  series: [
    {
      type: 'funnel' as const,
      left: '12%',
      right: '12%',
      top: 60,
      bottom: 20,
      sort: 'descending' as const,
      gap: 4,
      label: { show: true, position: 'inside' as const },
      data: [
        { value: 402, name: '首页浏览' },
        { value: 262, name: '商品浏览' },
        { value: 121, name: '加入购物车' },
        { value: 36, name: '发起结账' },
        { value: 13, name: '完成购买' },
      ],
    },
  ],
}

export default function App() {
  const activeThemeId = useThemeStore((s) => s.activeThemeId)
  const setActiveThemeId = useThemeStore((s) => s.setActiveThemeId)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo} />
          <Title level={3} style={{ margin: 0 }} className="ix-gradient-text">
            Insight 洞察分析平台
          </Title>
          <Tag color="gold">MVP · Token 体系就绪</Tag>
        </div>
        <Segmented
          value={activeThemeId}
          onChange={(v) => setActiveThemeId(v as typeof activeThemeId)}
          options={THEME_IDS.map((id) => ({ label: getTheme(id).name, value: id }))}
        />
      </header>

      <section className={`${styles.panel} ix-glass`}>
        <Title level={4} style={{ marginTop: 0 }}>
          地基自检
        </Title>
        <Paragraph type="secondary">
          切换右上角主题，观察背景渐变、卡片玻璃态、按钮色、漏斗图系列色是否同步变化。
          如果四项全部跟随，说明 token → CSSVars → Antd ConfigProvider → echarts.registerTheme
          链路通畅，可以进入后续页面开发。
        </Paragraph>
        <Space wrap>
          <Button type="primary">主色按钮</Button>
          <Button>次级按钮</Button>
          <Button danger>危险按钮</Button>
          <Tag color="processing">进行中</Tag>
          <Tag color="success">已完成</Tag>
          <Tag color="warning">待处理</Tag>
          <Tag color="error">失败</Tag>
        </Space>
      </section>

      <section className={`${styles.panel} ix-glass`} style={{ padding: 0 }}>
        <ThemedChart option={demoFunnelOption} height={360} />
      </section>
    </div>
  )
}
