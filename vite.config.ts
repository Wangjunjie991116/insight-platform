import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Vite 主配置：别名 @→src、Sass 预注入 token 门面、env 前缀 VITE_
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    envPrefix: 'VITE_',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 每个 SCSS 模块自动可用 tokens/mixins；SCSS 只消费 CSS 变量 var(--ix-*)，不参与真实颜色值
          additionalData: `@use "@/styles/tokens" as *;\n@use "@/styles/mixins" as *;\n`,
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName:
          mode === 'production' ? '[hash:base64:6]' : '[name]__[local]__[hash:base64:4]',
      },
    },
    server: {
      port: 5173,
      host: true,
      open: false,
      // 当不启用 MSW 时（VITE_ENABLE_MOCK=false），代理到本地 insight-x FastAPI
      proxy:
        env.VITE_ENABLE_MOCK === 'true'
          ? undefined
          : {
              '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
              },
            },
    },
    build: {
      target: 'es2022',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
              return 'react'
            }
            if (id.includes('node_modules/antd') || id.includes('node_modules/@ant-design')) {
              return 'antd'
            }
            if (id.includes('node_modules/echarts')) {
              return 'echarts'
            }
          },
        },
      },
    },
  }
})
