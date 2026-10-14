import { Component, lazy, type ComponentType, type ReactNode } from 'react'

// Every deploy renames the JS chunks and the old names 404. A tab opened before a deploy then fails
// to load the next page and showed a white screen. Fix: reload once (fresh HTML → current chunks);
// if it still fails, show a message with a reload button instead of a blank page.
const KEY = 'loo-chunk-reload'
export function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last < 15000) return false // already tried: don't loop
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch { /* storage blocked: still reload once per page load */ }
  window.location.reload()
  return true
}

export function lazyPage<T extends ComponentType<object>>(load: () => Promise<{ default: T }>) {
  return lazy(() => load().catch(err => {
    if (reloadOnce()) return new Promise<{ default: T }>(() => {}) // page is reloading
    throw err
  }))
}

export class PageErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="wrap" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <h1>אופס, העמוד לא נטען 🐾</h1>
        <p>כנראה שהאתר התעדכן בזמן שהיה פתוח. רעננו ונמשיך.</p>
        <button className="btn btn-gold" onClick={() => window.location.reload()}>רענון העמוד</button>
      </div>
    )
  }
}
