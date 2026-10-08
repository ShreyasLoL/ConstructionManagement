import { Menu, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppData } from '../../context/useAppData.js'
import './Topbar.css'

const routeTitles = { dashboard: 'Dashboard', projects: 'Projects', workers: 'Workers', materials: 'Materials', costs: 'Costs', schedule: 'Schedule' }
export default function Topbar({ onMenu }) {
  const { pathname } = useLocation()
  const { data, user } = useAppData()
  const [root, id] = pathname.split('/').filter(Boolean)
  const project = root === 'projects' && id ? data.projects.find((item) => String(item.id) === id) : null
  const worker = root === 'workers' && id ? data.workers.find((item) => String(item.id) === id) : null
  const title = project?.name || worker?.name || routeTitles[root] || (root === 'projects' ? 'Project not found' : 'Page not found')
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Account'
  const initials = displayName.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || localStorage.getItem('buildtrack-theme') || 'light')
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem('buildtrack-theme', next)
    setTheme(next)
  }
  const dark = theme === 'dark'
  return <header className="topbar"><button className="icon-button mobile-nav-toggle" onClick={onMenu} aria-label="Open navigation"><Menu /></button><h1>{title}</h1><div className="topbar-actions"><button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} title={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button><span className="topbar-avatar" aria-label={`Signed in as ${displayName}`}>{initials}</span></div></header>
}
