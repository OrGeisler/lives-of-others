import { Link } from 'react-router-dom'

// Pink "be my guardian angel – virtual adoption" button (shown wherever the 3 main CTAs appear)
export default function AngelButton({ className = '' }: { className?: string }) {
  return (
    <Link to="/virtual-adoption" className={`btn btn-angel ${className}`.trim()}>
      <span className="angel-l1">
        <svg className="angel-ico" viewBox="0 0 64 46" width="34" height="24" aria-hidden="true">
          <ellipse cx="32" cy="6" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="2.6" />
          <path fill="currentColor" d="M31 16C24 9 13 8 3 13c10 2 16 9 22 18 3-4 5-8 6-11z" />
          <path fill="currentColor" d="M33 16c7-7 18-8 28-3-10 2-16 9-22 18-3-4-5-8-6-11z" />
        </svg>{' '}
        להיות המלאך השומר שלי
      </span>
      <span className="angel-l2">אימוץ וירטואלי</span>
    </Link>
  )
}
