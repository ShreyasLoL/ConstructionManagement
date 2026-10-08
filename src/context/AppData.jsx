import { useCallback, useEffect, useState } from 'react'
import { DataContext } from './AppDataContext.js'
import { initialData } from './schema.js'
import { supabase, supabaseConfigured } from '../utils/supabase.js'

export function AppDataProvider({ children }) {
  const [data, setData] = useState(initialData)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(supabaseConfigured)
  const [loading, setLoading] = useState(true)
  const [backendError, setBackendError] = useState(supabaseConfigured ? '' : 'Supabase is not configured. Add the project URL and publishable key to .env.local, then restart Vite.')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [toast, setToast] = useState('')
  const userId = user?.id

  useEffect(() => {
    if (!supabase) return undefined

    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      const nextUser = session?.user || null
      setUser(nextUser)
      setAuthLoading(false)
      setLoading(Boolean(nextUser))
      if (!nextUser) setData(initialData)
    })

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!active) return
      if (error) setBackendError(error.message)
      setUser(session?.user || null)
      setAuthLoading(false)
    }).catch((error) => {
      if (active) {
        setBackendError(error.message)
        setAuthLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!supabase || !userId) return
    try {
      const results = await Promise.all([
        supabase.from('projects').select('*').order('id', { ascending: false }),
        supabase.from('workers').select('*').order('id', { ascending: false }),
        supabase.from('materials').select('*').order('id', { ascending: false }),
        supabase.from('expenses').select('*').order('id', { ascending: false }),
        supabase.from('tasks').select('*').order('id', { ascending: false }),
        supabase.from('activities').select('*').order('id', { ascending: false }),
        supabase.from('settings').select('*').limit(1).maybeSingle(),
      ])
      const failed = results.find(({ error }) => error)
      if (failed?.error) throw failed.error
      const [projects, workers, materials, expenses, tasks, activities, settings] = results.map(({ data: rows }) => rows)
      setData({
        projects: projects || [],
        workers: workers || [],
        materials: materials || [],
        expenses: expenses || [],
        tasks: tasks || [],
        activities: activities || [],
        settings: settings || null,
      })
      setBackendError('')
    } catch (error) {
      console.error('Could not load BuildTrack records from Supabase:', error)
      setBackendError(error.message || 'Could not load records from Supabase.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return undefined
    let active = true
    Promise.resolve().then(() => {
      if (active) void fetchData()
    })
    return () => { active = false }
  }, [fetchData, userId])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const signIn = async (email, password) => {
    if (!supabase) return { error: new Error('Supabase is not configured.') }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoading(false)
    return { error }
  }

  const signOut = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) setBackendError(error.message)
  }

  const refreshData = () => {
    setLoading(true)
    void fetchData()
  }

  const projects = data.projects
  const projectNames = projects.map((project) => project.name)
  const workerNames = data.workers.map((worker) => worker.name)

  const openForm = (type, item = null, defaults = {}) => {
    const workerDefaults = type === 'workers' && !item ? {
      employee_id: `BT-W-${String(Math.max(0, ...data.workers.map((worker) => Number(worker.employee_id?.match(/(\d+)$/)?.[1] || 0))) + 1).padStart(3, '0')}`,
      join_date: new Date().toISOString().slice(0, 10),
      status: 'On site',
      wage: 0,
      salary: 0,
    } : {}
    setForm(item ? { ...item } : { ...workerDefaults, ...defaults })
    setModal({ type, id: item?.id ?? null })
  }

  const closeForm = () => setModal(null)

  const saveForm = async (event) => {
    event.preventDefault()
    if (!supabase || !modal) return
    const { type, id } = modal
    const clean = { ...form }
    if (!id) delete clean.id
    if (clean.project === '') clean.project = null
    if (clean.assignee === '') clean.assignee = null
    Object.keys(clean).forEach((key) => {
      if (['budget', 'progress', 'wage', 'quantity', 'threshold', 'cost', 'amount', 'age', 'experience', 'salary'].includes(key)) clean[key] = Number(clean[key] || 0)
    })
    if (type === 'projects' && (clean.progress < 0 || clean.progress > 100)) {
      setToast('Progress must be between 0 and 100%')
      return
    }
    try {
      const result = id
        ? await supabase.from(type).update(clean).eq('id', id)
        : await supabase.from(type).insert(clean)
      if (result.error) throw result.error
      const recordName = clean.name || clean.title || 'record'
      const projectName = type === 'projects' ? clean.name : clean.project
      const activity = await supabase.from('activities').insert({
        text: `${id ? 'Updated' : 'Added'} ${type.slice(0, -1)}: ${recordName}`,
        project: projectName || null,
        time: 'Just now',
        color: id ? 'blue' : 'green',
      })
      if (activity.error) console.warn('Record saved, but its activity could not be recorded:', activity.error)
      await fetchData()
      closeForm()
      setToast(id ? 'Changes saved' : 'New record added')
    } catch (error) {
      console.error('Could not save the record to Supabase:', error)
      setToast(`Could not save: ${error.message}`)
    }
  }

  const removeRecord = async (type, item) => {
    if (!supabase || !window.confirm(`Delete “${item.name || item.title}”? This cannot be undone.`)) return false
    try {
      const { error } = await supabase.from(type).delete().eq('id', item.id)
      if (error) throw error
      if (type !== 'projects' && item.project) {
        const activity = await supabase.from('activities').insert({
          text: `Removed ${type.slice(0, -1)}: ${item.name || item.title || 'record'}`,
          project: item.project,
          time: 'Just now',
          color: 'orange',
        })
        if (activity.error) console.warn('Record deleted, but its activity could not be recorded:', activity.error)
      }
      await fetchData()
      setToast('Record deleted')
      return true
    } catch (error) {
      console.error('Could not delete the record from Supabase:', error)
      setToast(`Could not delete: ${error.message}`)
      return false
    }
  }

  return <DataContext.Provider value={{
    data, setData, user, authLoading, supabaseConfigured, backendError, loading,
    modal, form, setForm, toast, setToast, projects, projectNames, workerNames,
    openForm, closeForm, saveForm, removeRecord, signIn, signOut, refreshData,
  }}>{children}</DataContext.Provider>
}
