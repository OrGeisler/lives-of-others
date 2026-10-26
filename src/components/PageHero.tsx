import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/lang'

// Slim header shared by the inner content pages (/dogs, /about, /homes, /volunteer, /donate, /contact)
export default function PageHero({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  const { t, to } = useLang()
  return (
    <section className="page-hero">
      <div className="wrap page-hero-inner">
        <nav className="page-crumbs" aria-label={t('מיקום באתר', 'You are here')}><Link to={to('/')}>{t('בית', 'Home')}</Link> <span aria-hidden="true">›</span> <span>{title}</span></nav>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
        {children}
      </div>
    </section>
  )
}
