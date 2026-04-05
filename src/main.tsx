import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// ✅ H-02: Frame-busting — capa adicional anti-Clickjacking.
// frame-ancestors en <meta> es ignorado por spec W3C; esta es la mitigación
// válida para GitHub Pages (que no permite configurar HTTP response headers).
if (globalThis.top !== null && globalThis.top !== globalThis.self) {
  globalThis.top.location.replace(globalThis.location.href);
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
