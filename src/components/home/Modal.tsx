import { useEffect, useRef, type ReactNode } from 'react'

// Thin wrapper over native <dialog>: open state from React, closes on ✕ / Esc / backdrop click.
export default function Modal({ open, onClose, className, label, children }: {
  open: boolean
  onClose: () => void
  className: string
  label?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={label}
      onClose={onClose}
      onClick={e => { if (e.target === ref.current) onClose() }}
    >
      {children}
    </dialog>
  )
}
