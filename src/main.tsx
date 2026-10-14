import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { reloadOnce } from './lib/staleChunks'
import './styles/style.css'
import './styles/app.css'
import './styles/montage.css'

// a chunk (or its CSS) from an older deploy is gone: reload to get the current one
window.addEventListener('vite:preloadError', e => { if (reloadOnce()) e.preventDefault() })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
