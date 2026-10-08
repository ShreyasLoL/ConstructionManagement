import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Plus } from 'lucide-react'
import { useAppData } from '../../context/useAppData.js'
import { formatINR } from '../../utils/formatINR.js'
import PageHeading from '../../components/PageHeading.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Card from '../../components/ui/Card.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import RecordActions from '../../components/RecordActions.jsx'
import './ProjectDetail.css'

const tabs = ['Overview', 'Tasks', 'Workers', 'Materials', 'Costs']
const relativeActivityTime = (activity) => {
  if (!activity.created_at) return activity.time || ''
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(activity.created_at).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`
  return `${Math.floor(seconds / 86400)} d ago`
}
export default function ProjectDetail() {
  const { id } = useParams()
  const { data, openForm } = useAppData()
  const [tab, setTab] = useState('Overview')
  const project = data.projects.find((item) => String(item.id) === id)
  if (!project) return <div className="project-detail-page"><PageHeading title="Project not found" description="This project may have been removed." action={<Link to="/projects" className="button button-secondary">Back to projects</Link>} /></div>
  const expenses = data.expenses.filter((row) => row.project === project.name)
  const tasks = data.tasks.filter((row) => row.project === project.name)
  const workers = data.workers.filter((row) => row.project === project.name)
  const materials = data.materials.filter((row) => row.project === project.name)
  const spent = expenses.reduce((sum, row) => sum + Number(row.amount || 0), 0)
  const details = {
    Tasks: { type: 'tasks', rows: tasks, label: 'Add task', columns: [{ key: 'title', label: 'Task' }, { key: 'assignee', label: 'Assigned worker' }, { key: 'due', label: 'Due date' }, { key: 'priority', label: 'Priority', render: (row) => <Badge status={row.priority}>{row.priority}</Badge> }, { key: 'status', label: 'Status', render: (row) => <Badge status={row.status}>{row.status}</Badge> }] },
    Workers: { type: 'workers', rows: workers, label: 'Add worker', columns: [{ key: 'name', label: 'Name', render: (row) => <Link to={{ pathname: '/workers', search: `?worker=${encodeURIComponent(row.id)}` }}>{row.name}</Link> }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status', render: (row) => <Badge status={row.status}>{row.status}</Badge> }, { key: 'wage', label: 'Daily wage', numeric: true, render: (row) => formatINR(row.wage) }] },
    Materials: { type: 'materials', rows: materials, label: 'Add material', columns: [{ key: 'name', label: 'Material' }, { key: 'quantity', label: 'Available', numeric: true, render: (row) => `${row.quantity} ${row.unit}` }, { key: 'threshold', label: 'Minimum', numeric: true }, { key: 'stock', label: 'Stock status', render: (row) => <Badge status={row.quantity <= row.threshold ? 'High' : 'Completed'}>{row.quantity <= row.threshold ? 'Low stock' : 'Healthy'}</Badge> }] },
    Costs: { type: 'expenses', rows: expenses, label: 'Add expense', columns: [{ key: 'title', label: 'Description' }, { key: 'category', label: 'Category' }, { key: 'date', label: 'Date' }, { key: 'amount', label: 'Amount', numeric: true, render: (row) => formatINR(row.amount) }] },
  }
  const activeDetail = details[tab]
  const columns = activeDetail ? [...activeDetail.columns, { key: 'actions', label: '', className: 'actions-col', render: (row) => <RecordActions type={activeDetail.type} row={row} /> }] : []
  const createRecord = () => openForm(activeDetail.type, null, { project: project.name })
  return <div className="project-detail-page"><Link className="project-back-link" to="/projects"><ChevronLeft aria-hidden="true" />All projects</Link>
    <PageHeading title={project.name} description={`${project.location} · ${project.start} — ${project.end}`} action={<Badge status={project.status}>{project.status}</Badge>} />
    <div className="project-facts"><Card><span>Progress</span><ProgressBar value={project.progress} label="Project progress" /></Card><Card><span>Budget</span><strong>{formatINR(project.budget)}</strong></Card><Card><span>Spent</span><strong>{formatINR(spent)}</strong></Card></div>
    <nav className="project-tabs" aria-label="Project sections">{tabs.map((item) => <button type="button" onClick={() => setTab(item)} className={tab === item ? 'selected' : ''} aria-current={tab === item ? 'page' : undefined} key={item}>{item}</button>)}</nav>
    {tab === 'Overview' ? <div className="project-overview-grid"><Card><h2>Project overview</h2><p>{workers.length} workers · {tasks.filter((row) => row.status !== 'Completed').length} open tasks · {materials.filter((row) => row.quantity <= row.threshold).length} low stock</p><div className="project-overview-links">{tabs.slice(1).map((item) => <button type="button" key={item} onClick={() => setTab(item)}>{item}<span aria-hidden="true">›</span></button>)}</div></Card><Card><h2>Recent activity</h2>{data.activities.filter((item) => item.project === project.name).slice(0, 4).map((activity) => <p className="project-activity" key={activity.id}>{activity.text}<small>{relativeActivityTime(activity)}</small></p>)}{!data.activities.some((item) => item.project === project.name) && <p>No recent activity recorded.</p>}</Card></div> : <section className="project-tab-content"><header><div><h2>{tab}</h2><p>{activeDetail.rows.length} records</p></div><Button onClick={createRecord}><Plus aria-hidden="true" />{activeDetail.label}</Button></header><DataTable rows={activeDetail.rows} columns={columns} emptyTitle={`No ${tab.toLowerCase()} yet`} emptyText="Add a record to this project." /></section>}
  </div>
}
