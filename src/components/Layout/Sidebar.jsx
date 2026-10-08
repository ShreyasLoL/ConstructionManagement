import { NavLink } from 'react-router-dom'
import { BriefcaseBusiness, CalendarDays, HardHat, LayoutDashboard, LogOut, Package, Users, Wallet } from 'lucide-react'
import { useAppData } from '../../context/useAppData.js'
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
  const { data, user, signOut } = useAppData()
  const workspaceName = data?.settings?.workspace_name || 'Workspace'
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Account'
  const workspaceInitial = workspaceName.charAt(0).toUpperCase()
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)

  return <><button className={`sidebar-scrim ${open ? 'visible' : ''}`} onClick={onClose} aria-label="Close navigation" tabIndex={open ? 0 : -1} /><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><NavLink to="/dashboard" className="sidebar-brand" onClick={onClose} aria-label="BuildTrack home"><span className="brand-mark"><HardHat aria-hidden="true" /></span><span>BuildTrack</span></NavLink><div className="workspace-switcher"><span className="workspace-initial">{workspaceInitial}</span><span>{workspaceName}</span></div><nav className="sidebar-nav" aria-label="Main navigation">{items.map(({ to, label, Icon }) => <NavLink key={to} to={to} aria-label={label} title={label} className={({ isActive }) => `sidebar-link ${isActive || (to === '/projects' && location.pathname.startsWith('/projects/')) ? 'active' : ''}`} onClick={onClose}><Icon aria-hidden="true" /><span>{label}</span></NavLink>)}</nav><div className="sidebar-user"><span className="user-avatar">{userInitials}</span><span className="user-name">{userName}</span><button type="button" className="sidebar-sign-out" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut aria-hidden="true" /></button></div></aside></>
}
