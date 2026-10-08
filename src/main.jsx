import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import './App.css'
import App from './App.jsx'

const savedTheme = localStorage.getItem('buildtrack-theme') || 'light'
document.documentElement.dataset.theme = savedTheme

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
