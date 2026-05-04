import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function updateScale() {
  const pad = 32
  const scaleX = (window.innerWidth  - pad) / 1134
  const scaleY = (window.innerHeight - pad) / 744
  document.documentElement.style.setProperty('--scale', Math.min(scaleX, scaleY) * 0.85)
}

updateScale()
window.addEventListener('resize', updateScale)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
