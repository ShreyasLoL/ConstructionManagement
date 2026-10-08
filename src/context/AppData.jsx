import { useEffect, useState } from 'react'
import { DataContext } from './AppDataContext.js'
import { initialData } from './schema.js'

const loadInitial = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('buildtrack-data') || '{}')
    const workers = (stored.workers || initialData.workers).map((worker) => {
      const seeded = initialData.workers.find((item) => item.id === worker.id) || {}
      return { ...seeded, ...worker, employee_id: worker.employee_id || seeded.employee_id || `BT-W-${String(worker.id).padStart(3, '0')}`, age: worker.age ?? seeded.age ?? '', experience: worker.experience ?? seeded.experience ?? '', salary: worker.salary ?? seeded.salary ?? '', join_date: worker.join_date ?? seeded.join_date ?? '', notes: worker.notes ?? seeded.notes ?? '' }
    })
    return { ...initialData, ...stored, workers }
  } catch { return initialData }
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
  const openForm = (type, item = null, defaults = {}) => {
    let workerDefaults = {}
    if (type === 'workers' && !item) {
      const nextWorkerNumber = Math.max(0, ...data.workers.map((worker) => Number(worker.employee_id?.match(/(\d+)$/)?.[1] || 0))) + 1
      workerDefaults = { employee_id: `BT-W-${String(nextWorkerNumber).padStart(3, '0')}`, join_date: new Date().toISOString().slice(0, 10), status: 'On site', wage: 0, salary: 0 }
    }
    setForm(item ? { ...item } : { ...workerDefaults, ...defaults }); setModal({ type, id: item?.id ?? null })
  }
  const closeForm = () => setModal(null)
  const saveForm = (event) => {
    event.preventDefault()
    const { type, id } = modal
    const clean = { ...form }
    Object.keys(clean).forEach((key) => { if (['budget', 'progress', 'wage', 'quantity', 'threshold', 'cost', 'amount', 'age', 'experience', 'salary'].includes(key)) clean[key] = Number(clean[key] || 0) })
    if (type === 'projects' && (clean.progress < 0 || clean.progress > 100)) { setToast('Progress must be between 0 and 100%'); return }
    setData((current) => ({ ...current, [type]: id ? current[type].map((row) => row.id === id ? { ...row, ...clean } : row) : [{ ...clean, id: Date.now() }, ...current[type]] }))
    closeForm(); setToast(id ? 'Changes saved' : 'New record added')
  }
  const removeRecord = (type, item) => {
    if (!window.confirm(`Delete “${item.name || item.title}”? This cannot be undone.`)) return false
    setData((current) => ({ ...current, [type]: current[type].filter((row) => row.id !== item.id) }))
    setToast('Record deleted')
    return true
  }
  return <DataContext.Provider value={{ data, setData, modal, form, setForm, toast, setToast, loading, projects, projectNames, workerNames, openForm, closeForm, saveForm, removeRecord }}>{children}</DataContext.Provider>
}
