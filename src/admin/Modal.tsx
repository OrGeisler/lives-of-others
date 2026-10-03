import { useEffect, useRef, type ReactNode } from 'react'

export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { ref.current?.showModal() }, [])
  return (
    <dialog ref={ref} className="ad-modal" onClose={onClose} onCancel={onClose}>
      <div className="ad-modal-head">
        <h2>{title}</h2>
        <button className="ad-x" onClick={onClose} aria-label="סגירה">✕</button>
      </div>
      <div className="ad-modal-body">{children}</div>
    </dialog>
  )
}
