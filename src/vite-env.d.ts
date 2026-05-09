/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_MOCK: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// SCSS Modules 声明
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
