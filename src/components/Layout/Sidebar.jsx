import { NavLink } from 'react-router-dom'
import { BriefcaseBusiness, CalendarDays, HardHat, LayoutDashboard, Package, Users, Wallet } from 'lucide-react'
import './Sidebar.css'

const items = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', Icon: BriefcaseBusiness },
  { to: '/workers', label: 'Workers', Icon: Users },
  { to: '/materials', label: 'Materials', Icon: Package },
  { to: '/schedule', label: 'Schedule', Icon: CalendarDays },
  { to: '/costs', label: 'Costs', Icon: Wallet },
]
export default function Sidebar({ open, onClose }) {
  return <><button className={`sidebar-scrim ${open ? 'visible' : ''}`} onClick={onClose} aria-label="Close navigation" tabIndex={open ? 0 : -1} /><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><NavLink to="/dashboard" className="sidebar-brand" onClick={onClose} aria-label="BuildTrack home"><span className="brand-mark"><HardHat aria-hidden="true" /></span><span>BuildTrack</span></NavLink><button className="workspace-switcher" type="button"><span className="workspace-initial">N</span><span>Northstar Build Co.</span></button><nav className="sidebar-nav" aria-label="Main navigation">{items.map(({ to, label, Icon }) => <NavLink key={to} to={to} target="_blank" rel="noopener noreferrer" aria-label={`Open ${label} in a new tab`} title={`${label} (opens in a new tab)`} className={({ isActive }) => `sidebar-link ${isActive || (to === '/projects' && location.pathname.startsWith('/projects/')) ? 'active' : ''}`} onClick={onClose}><Icon aria-hidden="true" /><span>{label}</span></NavLink>)}</nav><div className="sidebar-user"><span className="user-avatar">AM</span><span className="user-name">Aarav Mehta</span></div></aside></>
}
