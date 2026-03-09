import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/styles.scss'
import logoUrl from './assets/images/logo.svg'

const favicon = document.querySelector('link[rel="icon"]')
if (favicon) favicon.href = logoUrl

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
