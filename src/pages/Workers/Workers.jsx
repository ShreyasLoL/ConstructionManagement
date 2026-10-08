import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, FileText, Plus, Search } from 'lucide-react'
import { useAppData } from '../../context/useAppData.js'
import PageHeading from '../../components/PageHeading.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Card from '../../components/ui/Card.jsx'
import WorkerDetail from './WorkerDetail.jsx'
import './Workers.css'

export default function Workers() {
  const { data, openForm } = useAppData()
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedWorkerId = searchParams.get('worker')
  const setSelectedWorkerId = (id) => {
    const next = new URLSearchParams(searchParams)
    if (id) next.set('worker', id)
    else next.delete('worker')
    setSearchParams(next, { replace: true })
  }
  const workers = useMemo(() => data.workers.filter((worker) => `${worker.name} ${worker.employee_id} ${worker.role} ${worker.project}`.toLowerCase().includes(query.toLowerCase().trim())), [data.workers, query])
  const selectedWorker = data.workers.find((worker) => String(worker.id) === String(selectedWorkerId))
  return <div className="workers-page"><PageHeading title="Workers" description="Personnel records, work notes, and project assignments." action={<Button onClick={() => openForm('workers')}><Plus aria-hidden="true" />Add worker</Button>} />
    <div className="worker-notes-toolbar"><label><Search aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search workers" aria-label="Search workers" /></label><span>{workers.length} personnel records</span></div>
    {workers.length ? <div className="worker-notes-list">{workers.map((worker) => <button className="worker-note-card" type="button" onClick={() => setSelectedWorkerId(worker.id)} key={worker.id} aria-label={`Open personnel notes for ${worker.name}`}><span className="worker-note-icon"><FileText aria-hidden="true" /></span><span className="worker-note-main"><strong>{worker.name}</strong><small>{worker.role} · {worker.project}</small><span className="worker-note-preview">{worker.notes || 'No notes have been added yet.'}</span></span><span className="worker-note-meta"><span className="worker-id">{worker.employee_id || 'ID pending'}</span><Badge status={worker.status}>{worker.status}</Badge></span><ArrowUpRight className="worker-note-open" aria-hidden="true" /></button>)}</div> : <Card className="worker-empty"><FileText aria-hidden="true" /><strong>{query ? 'No workers match that search' : 'No worker records yet'}</strong><span>{query ? 'Try another name, ID, role, or project.' : 'Add your first personnel record to start the directory.'}</span></Card>}
    {selectedWorker && <WorkerDetail worker={selectedWorker} onClose={() => setSelectedWorkerId(null)} />}
  </div>
}
