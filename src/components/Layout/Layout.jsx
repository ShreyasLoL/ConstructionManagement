import { Outlet } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useAppData } from '../../context/useAppData.js'
import RecordModal from '../RecordModal.jsx'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import PageSkeleton from '../ui/PageSkeleton.jsx'
import './Layout.css'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { toast, loading, backendError, refreshData, user } = useAppData()
  return <div className="app-layout"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="app-content"><Topbar onMenu={() => setMenuOpen(true)} /><main className="page-content">{backendError && user && <div className="backend-error" role="alert"><span>Supabase: {backendError}</span><button type="button" onClick={refreshData} aria-label="Retry loading records"><RefreshCw aria-hidden="true" />Retry</button></div>}{loading ? <PageSkeleton /> : <Outlet />}</main></div><RecordModal />{toast && <div role="status" aria-live="polite" className="toast-message">{toast}</div>}</div>
}
