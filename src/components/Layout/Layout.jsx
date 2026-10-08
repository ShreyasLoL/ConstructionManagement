import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAppData } from '../../context/useAppData.js'
import RecordModal from '../RecordModal.jsx'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import PageSkeleton from '../ui/PageSkeleton.jsx'
import './Layout.css'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { toast, loading } = useAppData()
  return <div className="app-layout"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="app-content"><Topbar onMenu={() => setMenuOpen(true)} /><main className="page-content">{loading ? <PageSkeleton /> : <Outlet />}</main></div><RecordModal />{toast && <div role="status" aria-live="polite" className="toast-message">{toast}</div>}</div>
}
