import { useEffect, useState, useCallback } from 'react'
import { DataContext } from './AppDataContext.js'
import { initialData } from './schema.js'
import { supabase } from '../utils/supabase.js'

export function AppDataProvider({ children }) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [toast, setToast] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [
        { data: projects },
        { data: workers },
        { data: materials },
        { data: expenses },
        { data: tasks }
      ] = await Promise.all([
        supabase.from('projects').select('*').order('id', { ascending: false }),
        supabase.from('workers').select('*').order('id', { ascending: false }),
        supabase.from('materials').select('*').order('id', { ascending: false }),
        supabase.from('expenses').select('*').order('id', { ascending: false }),
        supabase.from('tasks').select('*').order('id', { ascending: false })
      ])

      setData(current => ({
        ...current,
        projects: projects || [],
        workers: workers || [],
        materials: materials || [],
        expenses: expenses || [],
        tasks: tasks || []
      }))
    } catch (err) {
      console.error('Error fetching data from Supabase:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer)
  }, [toast])

  const projects = data.projects
  const projectNames = projects.map((project) => project.name)
  const workerNames = data.workers.map((worker) => worker.name)

  const openForm = (type, item = null, defaults = {}) => {
    let workerDefaults = {}
    if (type === 'workers' && !item) {
      const nextWorkerNumber = Math.max(0, ...data.workers.map((worker) => Number(worker.employee_id?.match(/(\d+)$/)?.[1] || 0))) + 1
      workerDefaults = {
        employee_id: `BT-W-${String(nextWorkerNumber).padStart(3, '0')}`,
        join_date: new Date().toISOString().slice(0, 10),
        status: 'On site',
        wage: 0,
        salary: 0
      }
    }
    setForm(item ? { ...item } : { ...workerDefaults, ...defaults });
    setModal({ type, id: item?.id ?? null })
  }

  const closeForm = () => setModal(null)

  const saveForm = async (event) => {
    event.preventDefault()
    const { type, id } = modal
    const clean = { ...form }
    
    // Remove local id for inserts
    if (!id) {
      delete clean.id;
    }
    
    // Clean up empty strings for foreign keys
    if (clean.project === "") clean.project = null;
    if (clean.assignee === "") clean.assignee = null;

    Object.keys(clean).forEach((key) => {
      if (['budget', 'progress', 'wage', 'quantity', 'threshold', 'cost', 'amount', 'age', 'experience', 'salary'].includes(key)) {
        clean[key] = Number(clean[key] || 0)
      }
    })

    if (type === 'projects' && (clean.progress < 0 || clean.progress > 100)) {
      setToast('Progress must be between 0 and 100%');
      return
    }

    try {
      if (id) {
        const { error } = await supabase.from(type).update(clean).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from(type).insert(clean)
        if (error) throw error
      }
      
      await fetchData()
      closeForm();
      setToast(id ? 'Changes saved' : 'New record added')
    } catch (err) {
      console.error(err)
      setToast('Error saving: ' + err.message)
    }
  }

  const removeRecord = async (type, item) => {
    if (!window.confirm(`Delete “${item.name || item.title}”? This cannot be undone.`)) return false
    
    try {
      const { error } = await supabase.from(type).delete().eq('id', item.id)
      if (error) throw error
      
      await fetchData()
      setToast('Record deleted')
      return true
    } catch (err) {
      console.error(err)
      setToast('Error deleting: ' + err.message)
      return false
    }
  }

  return (
    <DataContext.Provider value={{
      data, setData, modal, form, setForm, toast, setToast, loading,
      projects, projectNames, workerNames, openForm, closeForm, saveForm, removeRecord
    }}>
      {children}
    </DataContext.Provider>
  )
}
