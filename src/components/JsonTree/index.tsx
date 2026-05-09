import { useState } from 'react'

import styles from './index.module.scss'

export interface JsonTreeProps {
  data: unknown
  /** 默认展开层级，默认 2 */
  defaultExpandDepth?: number
  className?: string
}

export function JsonTree({ data, defaultExpandDepth = 2, className }: JsonTreeProps) {
  return (
    <div className={`${styles.wrap} ${className ?? ''}`}>
      <JsonNode value={data} depth={0} defaultExpandDepth={defaultExpandDepth} />
    </div>
  )
}

interface JsonNodeProps {
  value: unknown
  depth: number
  defaultExpandDepth: number
  keyHint?: string
}

function JsonNode({ value, depth, defaultExpandDepth, keyHint }: JsonNodeProps) {
  if (value === null || value === undefined) {
    return (
      <div className={styles.row}>
        {keyHint && <span className={styles.key}>{keyHint}: </span>}
        <span className={styles.null}>null</span>
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <div className={styles.row}>
        {keyHint && <span className={styles.key}>{keyHint}: </span>}
        <span className={styles.bool}>{String(value)}</span>
      </div>
    )
  }

  if (typeof value === 'number') {
    return (
      <div className={styles.row}>
        {keyHint && <span className={styles.key}>{keyHint}: </span>}
        <span className={styles.num}>{value}</span>
      </div>
    )
  }

  if (typeof value === 'string') {
    return (
      <div className={styles.row}>
        {keyHint && <span className={styles.key}>{keyHint}: </span>}
        <span className={styles.str}>&quot;{value}&quot;</span>
      </div>
    )
  }

  if (Array.isArray(value)) {
    return <JsonArray value={value} depth={depth} defaultExpandDepth={defaultExpandDepth} keyHint={keyHint} />
  }

  if (typeof value === 'object') {
    return <JsonObject value={value as Record<string, unknown>} depth={depth} defaultExpandDepth={defaultExpandDepth} keyHint={keyHint} />
  }

  return (
    <div className={styles.row}>
      {keyHint && <span className={styles.key}>{keyHint}: </span>}
      <span>{String(value)}</span>
    </div>
  )
}

function JsonArray({ value, depth, defaultExpandDepth, keyHint }: { value: unknown[]; depth: number; defaultExpandDepth: number; keyHint?: string }) {
  const [open, setOpen] = useState(depth < defaultExpandDepth)

  if (!open) {
    return (
      <div className={styles.row}>
        {keyHint && <span className={styles.key}>{keyHint}: </span>}
        <span className={styles.bracket} onClick={() => setOpen(true)}>[</span>
        <span className={styles.ellipsis} onClick={() => setOpen(true)}> …{value.length} items </span>
        <span className={styles.bracket} onClick={() => setOpen(true)}>]</span>
      </div>
    )
  }

  return (
    <>
      <div className={styles.row}>
        {keyHint && <span className={styles.key}>{keyHint}: </span>}
        <span className={styles.bracket} onClick={() => setOpen(false)}>[</span>
      </div>
      {value.map((item, i) => (
        <div key={i} style={{ paddingLeft: 16 }}>
          <JsonNode value={item} depth={depth + 1} defaultExpandDepth={defaultExpandDepth} />
        </div>
      ))}
      <div className={styles.row}>
        <span className={styles.bracket} onClick={() => setOpen(false)}>]</span>
      </div>
    </>
  )
}

function JsonObject({ value, depth, defaultExpandDepth, keyHint }: { value: Record<string, unknown>; depth: number; defaultExpandDepth: number; keyHint?: string }) {
  const [open, setOpen] = useState(depth < defaultExpandDepth)
  const entries = Object.entries(value)

  if (!open) {
    return (
      <div className={styles.row}>
        {keyHint && <span className={styles.key}>{keyHint}: </span>}
        <span className={styles.bracket} onClick={() => setOpen(true)}>{'{'}</span>
        <span className={styles.ellipsis} onClick={() => setOpen(true)}> …{entries.length} keys </span>
        <span className={styles.bracket} onClick={() => setOpen(true)}>{'}'}</span>
      </div>
    )
  }

  return (
    <>
      <div className={styles.row}>
        {keyHint && <span className={styles.key}>{keyHint}: </span>}
        <span className={styles.bracket} onClick={() => setOpen(false)}>{'{'}</span>
      </div>
      {entries.map(([k, v]) => (
        <div key={k} style={{ paddingLeft: 16 }}>
          <JsonNode value={v} depth={depth + 1} defaultExpandDepth={defaultExpandDepth} keyHint={k} />
        </div>
      ))}
      <div className={styles.row}>
        <span className={styles.bracket} onClick={() => setOpen(false)}>{'}'}</span>
      </div>
    </>
  )
}

export default JsonTree
