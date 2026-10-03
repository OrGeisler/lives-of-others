import { useState } from 'react'
import Modal from './Modal'
import { Field } from './ui'

// A friendly replacement for window.prompt(): a small form in a dialog.
export default function AskText({ title, label, hint, okLabel = 'הוספה', onOk, onClose }: {
  title: string; label: string; hint?: string; okLabel?: string
  onOk: (value: string) => void | Promise<void>; onClose: () => void
}) {
  const [v, setV] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <Modal title={title} onClose={onClose}>
      <form className="ad-form" onSubmit={async e => { e.preventDefault(); if (!v.trim()) return; setBusy(true); await onOk(v.trim()); setBusy(false) }}>
        <Field label={label} hint={hint}><input autoFocus required value={v} onChange={e => setV(e.target.value)} /></Field>
        <div className="ad-form-actions">
          <button className="ad-btn primary big" disabled={busy}>{okLabel}</button>
          <button type="button" className="ad-btn ghost" onClick={onClose}>ביטול</button>
        </div>
      </form>
    </Modal>
  )
}
