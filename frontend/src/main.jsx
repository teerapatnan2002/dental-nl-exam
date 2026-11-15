import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Recover cleanly when a browser tab holds stale chunk references after a new deployment
window.addEventListener('vite:preloadError', (event) => {
  try {
    const key = 'nl_vite_preload_reload';
    const last = Number(sessionStorage.getItem(key) || '0');
    if (Date.now() - last > 15000) {
      sessionStorage.setItem(key, String(Date.now()));
      event.preventDefault();
      window.location.reload();
    }
  } catch {
    // Ignore storage failures
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
window.__NL_APP_MOUNTED = true;
