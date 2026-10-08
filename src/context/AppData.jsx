import { useEffect, useState } from 'react'
import { DataContext } from './AppDataContext.js'
import { initialData } from './schema.js'

const loadInitial = () => {
  try { return { ...initialData, ...(JSON.parse(localStorage.getItem('buildtrack-data') || '{}')) } } catch { return initialData }
}

export function AppDataProvider({ children }) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [toast, setToast] = useState('')
  useEffect(() => { const timer = window.setTimeout(() => { setData(loadInitial()); setLoading(false) }, 0); return () => window.clearTimeout(timer) }, [])
  useEffect(() => { if (!loading) localStorage.setItem('buildtrack-data', JSON.stringify(data)) }, [data, loading])
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer) }, [toast])
  const projects = data.projects
  const projectNames = projects.map((project) => project.name)
  const workerNames = data.workers.map((worker) => worker.name)
  const openForm = (type, item = null, defaults = {}) => { setForm(item ? { ...item } : { ...defaults }); setModal({ type, id: item?.id ?? null }) }
  const closeForm = () => setModal(null)
  const saveForm = (event) => {
    event.preventDefault()
    const { type, id } = modal
    const clean = { ...form }
    Object.keys(clean).forEach((key) => { if (['budget', 'progress', 'wage', 'quantity', 'threshold', 'cost', 'amount'].includes(key)) clean[key] = Number(clean[key] || 0) })
    if (type === 'projects' && (clean.progress < 0 || clean.progress > 100)) { setToast('Progress must be between 0 and 100%'); return }
    setData((current) => ({ ...current, [type]: id ? current[type].map((row) => row.id === id ? { ...row, ...clean } : row) : [{ ...clean, id: Date.now() }, ...current[type]] }))
    closeForm(); setToast(id ? 'Changes saved' : 'New record added')
  }
  const removeRecord = (type, item) => {
    if (!window.confirm(`Delete “${item.name || item.title}”? This cannot be undone.`)) return
    setData((current) => ({ ...current, [type]: current[type].filter((row) => row.id !== item.id) }))
    setToast('Record deleted')
  }
  return <DataContext.Provider value={{ data, setData, modal, form, setForm, toast, setToast, loading, projects, projectNames, workerNames, openForm, closeForm, saveForm, removeRecord }}>{children}</DataContext.Provider>
}
