import { useRequest } from 'ahooks'
import { Tag } from 'antd'
import axios from 'axios'

import { useTeamStore } from '@/store/teamStore'
import { useThemeStore } from '@/store/themeStore'
import { THEME_IDS, getTheme } from '@/theme/tokens'
import PageHeader from '@/components/PageHeader'

import styles from './Settings.module.scss'

export default function SettingsPage() {
  const { activeTeamId, teams, setActiveTeamId } = useTeamStore()
  const { activeThemeId, setActiveThemeId } = useThemeStore()

  const { data: health } = useRequest(
    async () => {
      try {
        const res = await axios.get('/api/v1/health', { timeout: 3000 })
        return res.data?.status === 'healthy' ? 'healthy' : 'unhealthy'
      } catch {
        return 'unhealthy'
      }
    },
  )

  return (
    <div className={styles.page}>
      <PageHeader title="设置" />

      {/* §13.1 团队切换 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>团队</div>
        <div className={styles.teamList}>
          {teams.map((t) => (
            <div
              key={t.id}
              className={`${styles.teamItem} ${t.id === activeTeamId ? styles.active : ''}`}
              onClick={() => setActiveTeamId(t.id)}
            >
              <span className={styles.teamName}>
                {t.avatar && <span>{t.avatar}</span>}
                {t.name}
              </span>
              {t.id === activeTeamId && <Tag color="blue">当前</Tag>}
            </div>
          ))}
        </div>
      </div>

      {/* §13.2 主题切换 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>主题</div>
        <div className={styles.themeGrid}>
          {THEME_IDS.map((id) => {
            const theme = getTheme(id)
            return (
              <div
                key={id}
                className={`${styles.themeCard} ${id === activeThemeId ? styles.active : ''}`}
                onClick={() => setActiveThemeId(id)}
              >
                <div
                  className={styles.themeSwatch}
                  style={{ background: theme.seed.primary, boxShadow: `0 2px 8px ${theme.seed.primary}40` }}
                />
                <div className={styles.themeName}>{theme.name}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* §13.3 关于 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>关于</div>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>版本</span>
          <span className={styles.aboutValue}>0.1.0 (MVP)</span>
        </div>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>技术栈</span>
          <span className={styles.aboutValue}>React 18 + Antd 6 + Vite 8 + ECharts 5</span>
        </div>
        <div className={styles.aboutRow}>
          <span className={styles.aboutLabel}>API 状态</span>
          <span className={styles.aboutValue} style={{ color: health === 'healthy' ? 'var(--ix-color-success)' : 'var(--ix-color-error)' }}>
            {health === 'healthy' ? '● 正常' : health === 'unhealthy' ? '● 异常' : '○ 检测中...'}
          </span>
        </div>
      </div>
    </div>
  )
}
