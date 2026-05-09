import { useState, useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Button, Tooltip, message } from 'antd'
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons'

import styles from './index.module.scss'

export interface CodeViewerProps {
  code: string
  language?: string
  title?: string
  filename?: string
  className?: string
}

export function CodeViewer({ code, language = 'python', title, filename, className }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    message.success('已复制')
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `code.${language === 'python' ? 'py' : language === 'sql' ? 'sql' : 'txt'}`
    a.click()
    URL.revokeObjectURL(url)
  }, [code, filename, language])

  // 用 CSS 变量构建 prism 主题
  const prismStyle = {
    'pre[class*="language-"]': {
      background: 'var(--ix-code-bg)',
      color: 'var(--ix-code-text)',
      margin: 0,
      padding: '16px',
      fontSize: '13px',
      lineHeight: 1.6,
    },
    'code[class*="language-"]': {
      background: 'var(--ix-code-bg)',
      color: 'var(--ix-code-text)',
    },
    token: {
      keyword: { color: 'var(--ix-code-keyword)' },
      string: { color: 'var(--ix-code-string)' },
      comment: { color: 'var(--ix-code-comment)' },
      number: { color: 'var(--ix-code-number)' },
      function: { color: 'var(--ix-code-keyword)' },
      operator: { color: 'var(--ix-code-text)' },
      punctuation: { color: 'var(--ix-code-text)' },
    },
  } as Record<string, React.CSSProperties>

  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      {(title || filename) && (
        <div className={styles.header}>
          <span className={styles.title}>{title || filename}</span>
          <div className={styles.actions}>
            <Tooltip title={copied ? '已复制' : '复制'}>
              <Button type="text" size="small" icon={<CopyOutlined />} onClick={handleCopy} />
            </Tooltip>
            <Tooltip title="下载">
              <Button type="text" size="small" icon={<DownloadOutlined />} onClick={handleDownload} />
            </Tooltip>
          </div>
        </div>
      )}
      <SyntaxHighlighter language={language} style={prismStyle} className={styles.code} showLineNumbers>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeViewer
