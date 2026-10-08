import { useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, HardHat, LayoutDashboard, Menu, Package, Plus, Search, Settings2, Trash2, TrendingUp, Users, Wallet, X } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './App.css'

const today = new Date().toISOString().slice(0, 10)
const days = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10)
const seed = {
  projects: [
    { id: 1, name: 'Riverside Residences', client: 'Northstar Living', location: 'Pune, Maharashtra', start: '2025-11-10', end: days(28), budget: 4850000, status: 'In Progress', progress: 68, manager: 'Aarav Mehta' },
    { id: 2, name: 'Greenfield Office Park', client: 'Meridian Group', location: 'Bengaluru, Karnataka', start: '2025-08-01', end: days(52), budget: 7200000, status: 'In Progress', progress: 42, manager: 'Priya Nair' },
    { id: 3, name: 'Oakwood Community Center', client: 'City Development Corp.', location: 'Mumbai, Maharashtra', start: '2025-10-15', end: days(12), budget: 2650000, status: 'In Progress', progress: 84, manager: 'Rohan Shah' },
    { id: 4, name: 'Hillview School Extension', client: 'Hillview Education Trust', location: 'Nashik, Maharashtra', start: '2025-06-03', end: '2025-12-18', budget: 1950000, status: 'Completed', progress: 100, manager: 'Aarav Mehta' },
    { id: 5, name: 'Maple Street Townhomes', client: 'Cedar Homes', location: 'Hyderabad, Telangana', start: '2026-02-01', end: days(112), budget: 3800000, status: 'Planning', progress: 8, manager: 'Priya Nair' },
    { id: 6, name: 'Eastside Water Works', client: 'Municipal Works Dept.', location: 'Pune, Maharashtra', start: '2025-09-12', end: days(76), budget: 5600000, status: 'On Hold', progress: 31, manager: 'Rohan Shah' },
  ],
  workers: [
    { id: 1, name: 'Vikram Singh', role: 'Site Supervisor', phone: '+91 98765 43210', project: 'Riverside Residences', status: 'On site', wage: 1800 },
    { id: 2, name: 'Neha Kulkarni', role: 'Civil Engineer', phone: '+91 98234 56781', project: 'Greenfield Office Park', status: 'On site', wage: 2400 },
    { id: 3, name: 'Ramesh Patil', role: 'Mason', phone: '+91 97654 32109', project: 'Oakwood Community Center', status: 'On site', wage: 950 },
    { id: 4, name: 'Imran Khan', role: 'Electrician', phone: '+91 98901 23456', project: 'Riverside Residences', status: 'On leave', wage: 1250 },
    { id: 5, name: 'Sanjay Rao', role: 'Carpenter', phone: '+91 98123 45670', project: 'Greenfield Office Park', status: 'On site', wage: 1100 },
    { id: 6, name: 'Deepak Yadav', role: 'Laborer', phone: '+91 97412 34567', project: 'Oakwood Community Center', status: 'On site', wage: 700 },
    { id: 7, name: 'Anita Deshmukh', role: 'Plumber', phone: '+91 98876 54321', project: 'Riverside Residences', status: 'On site', wage: 1150 },
  ],
  materials: [
    { id: 1, name: 'OPC Cement (Grade 53)', category: 'Cement', quantity: 42, unit: 'bags', threshold: 50, cost: 390, supplier: 'BuildRight Supplies', project: 'Riverside Residences' },
    { id: 2, name: 'TMT Steel Bars (12mm)', category: 'Steel', quantity: 860, unit: 'kg', threshold: 200, cost: 68, supplier: 'Metro Steel Co.', project: 'Riverside Residences' },
    { id: 3, name: 'River Sand', category: 'Aggregates', quantity: 12, unit: 'tons', threshold: 5, cost: 1850, supplier: 'Shree Aggregates', project: 'Greenfield Office Park' },
    { id: 4, name: 'Red Clay Bricks', category: 'Masonry', quantity: 2800, unit: 'pcs', threshold: 500, cost: 9, supplier: 'Narmada Brickworks', project: 'Oakwood Community Center' },
    { id: 5, name: 'Electrical Conduit (20mm)', category: 'Electrical', quantity: 18, unit: 'lengths', threshold: 25, cost: 85, supplier: 'Electra Trade Hub', project: 'Riverside Residences' },
    { id: 6, name: 'Crushed Stone (20mm)', category: 'Aggregates', quantity: 28, unit: 'tons', threshold: 8, cost: 1250, supplier: 'Shree Aggregates', project: 'Oakwood Community Center' },
  ],
  expenses: [
    { id: 1, title: 'Foundation steel delivery', category: 'Materials', amount: 164000, date: days(-2), project: 'Riverside Residences', notes: 'TMT bars, phase 2' },
    { id: 2, title: 'Weekly crew payroll', category: 'Labour', amount: 87500, date: days(-3), project: 'Riverside Residences', notes: 'Site team, week 23' },
    { id: 3, title: 'Tower crane rental', category: 'Equipment', amount: 62000, date: days(-5), project: 'Greenfield Office Park', notes: 'Monthly hire' },
    { id: 4, title: 'Concrete mixer transport', category: 'Transportation', amount: 18500, date: days(-7), project: 'Oakwood Community Center', notes: '' },
    { id: 5, title: 'Cement and aggregates', category: 'Materials', amount: 94500, date: days(-8), project: 'Greenfield Office Park', notes: 'Supplier invoice #BR-442' },
    { id: 6, title: 'Safety equipment', category: 'Other', amount: 12800, date: days(-10), project: 'Oakwood Community Center', notes: 'PPE restock' },
  ],
  tasks: [
    { id: 1, title: 'Pour level 4 slab', project: 'Riverside Residences', assignee: 'Vikram Singh', start: today, due: days(2), status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Electrical rough-in inspection', project: 'Riverside Residences', assignee: 'Imran Khan', start: days(1), due: days(4), status: 'Pending', priority: 'Medium' },
    { id: 3, title: 'Submit structural drawings', project: 'Greenfield Office Park', assignee: 'Neha Kulkarni', start: today, due: days(6), status: 'In Progress', priority: 'High' },
    { id: 4, title: 'Install fire safety systems', project: 'Oakwood Community Center', assignee: 'Sanjay Rao', start: days(2), due: days(12), status: 'Pending', priority: 'Medium' },
    { id: 5, title: 'Finish exterior masonry', project: 'Oakwood Community Center', assignee: 'Ramesh Patil', start: days(-3), due: days(-1), status: 'Completed', priority: 'Low' },
    { id: 6, title: 'Site utility coordination', project: 'Greenfield Office Park', assignee: 'Neha Kulkarni', start: days(3), due: days(17), status: 'Pending', priority: 'Low' },
  ],
  activities: [
    { id: 1, text: 'Steel delivery recorded', project: 'Riverside Residences', time: '12 min ago', color: 'orange' },
    { id: 2, text: 'Slab inspection passed', project: 'Oakwood Community Center', time: '1 hour ago', color: 'green' },
    { id: 3, text: 'Task assigned to Neha Kulkarni', project: 'Greenfield Office Park', time: '3 hours ago', color: 'blue' },
    { id: 4, text: 'Weekly payroll expense added', project: 'Riverside Residences', time: 'Yesterday', color: 'purple' },
  ],
}

const navItems = [
  { id: 'Dashboard', icon: LayoutDashboard }, { id: 'Projects', icon: BriefcaseBusiness },
  { id: 'Workers', icon: Users }, { id: 'Materials', icon: Package },
  { id: 'Costs', icon: Wallet }, { id: 'Schedule', icon: CalendarDays },
]
const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const readData = () => {
  try { const saved = localStorage.getItem('buildtrack-data'); return saved ? { ...seed, ...JSON.parse(saved) } : seed }
  catch { return seed }
}
const statusClass = (status) => status?.toLowerCase().replaceAll(' ', '-') || 'pending'

function StatusBadge({ status }) { return <span className={`badge ${statusClass(status)}`}><i />{status}</span> }
function Progress({ value }) { return <div className="progress-wrap"><div className="progress-track"><span style={{ width: `${value}%` }} /></div><span className="progress-value">{value}%</span></div> }
function SectionHeading({ eyebrow, title, subtitle, action }) { return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div> }
function StatCard({ icon: Icon, label, value, detail, tone = 'orange', trend }) { return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19} /></div><div className="stat-meta">{label}{trend && <span className="trend"><ArrowUpRight size={13} />{trend}</span>}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></article> }

function Modal({ title, onClose, onSubmit, children }) {
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}><section className="modal" role="dialog" aria-modal="true"><div className="modal-head"><div><span className="eyebrow">PROJECT CONTROL</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><form onSubmit={onSubmit}><div className="form-grid">{children}</div><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button type="submit" className="button primary"><Check size={16} />Save changes</button></div></form></section></div>
}

function Field({ label, name, value, onChange, required = true, type = 'text', options, placeholder, step }) {
  return <label className="field"><span>{label}{required && <b> *</b>}</span>{options ? <select name={name} value={value || ''} onChange={onChange} required={required}><option value="">Select {label.toLowerCase()}</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select> : <input name={name} type={type} value={value ?? ''} onChange={onChange} required={required} placeholder={placeholder} step={step} />}</label>
}

const fieldDefs = {
  projects: [
    ['name', 'Project name'], ['client', 'Client name'], ['location', 'Location'], ['start', 'Start date', 'date'], ['end', 'End date', 'date'], ['budget', 'Budget (₹)', 'number'], ['status', 'Status', 'select', ['Planning', 'In Progress', 'On Hold', 'Completed']], ['progress', 'Progress (%)', 'number'], ['manager', 'Project manager'],
  ],
  workers: [['name', 'Full name'], ['role', 'Role', 'select', ['Engineer', 'Supervisor', 'Mason', 'Electrician', 'Plumber', 'Carpenter', 'Laborer']], ['phone', 'Phone number'], ['project', 'Project', 'select', 'projects'], ['status', 'Status', 'select', ['On site', 'On leave']], ['wage', 'Daily wage (₹)', 'number']],
  materials: [['name', 'Material name'], ['category', 'Category', 'select', ['Cement', 'Steel', 'Aggregates', 'Masonry', 'Electrical', 'Plumbing', 'Other']], ['quantity', 'Quantity', 'number'], ['unit', 'Unit'], ['threshold', 'Low stock alert at', 'number'], ['cost', 'Cost per unit (₹)', 'number'], ['supplier', 'Supplier'], ['project', 'Project', 'select', 'projects']],
  expenses: [['title', 'Expense description'], ['category', 'Category', 'select', ['Materials', 'Labour', 'Equipment', 'Transportation', 'Other']], ['amount', 'Amount (₹)', 'number'], ['date', 'Date', 'date'], ['project', 'Project', 'select', 'projects'], ['notes', 'Notes', 'text', null, false]],
  tasks: [['title', 'Task name'], ['project', 'Project', 'select', 'projects'], ['assignee', 'Assign worker', 'select', 'workers'], ['start', 'Start date', 'date'], ['due', 'Due date', 'date'], ['status', 'Status', 'select', ['Pending', 'In Progress', 'Completed']], ['priority', 'Priority', 'select', ['High', 'Medium', 'Low']]],
}

function App() {
  const [data, setData] = useState(readData)
  const [page, setPage] = useState('Dashboard')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All statuses')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')
  useEffect(() => { localStorage.setItem('buildtrack-data', JSON.stringify(data)) }, [data])
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer) } }, [toast])
  const projects = data.projects
  const projectNames = projects.map((p) => p.name)
  const workerNames = data.workers.map((w) => w.name)
  const totalBudget = projects.filter((p) => p.status !== 'Completed').reduce((sum, p) => sum + Number(p.budget || 0), 0)
  const spent = data.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const activeProjects = projects.filter((p) => p.status === 'In Progress').length
  const upcoming = data.tasks.filter((t) => t.status !== 'Completed' && t.due >= today).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 4)
  const chartData = useMemo(() => [
    { month: 'May', budget: 620, actual: 510 }, { month: 'Jun', budget: 680, actual: 590 }, { month: 'Jul', budget: 720, actual: 650 },
    { month: 'Aug', budget: 780, actual: 690 }, { month: 'Sep', budget: 850, actual: 760 }, { month: 'Oct', budget: 920, actual: 810 },
  ], [])
  const addNew = (type) => { setForm({}); setModal({ type, id: null }) }
  const editItem = (type, item) => { setForm({ ...item }); setModal({ type, id: item.id }) }
  const removeItem = (type, item) => {
    if (!window.confirm(`Delete “${item.name || item.title}”? This cannot be undone.`)) return
    setData((current) => ({ ...current, [type]: current[type].filter((row) => row.id !== item.id) }))
    setToast('Record deleted')
  }
  const handleSave = (event) => {
    event.preventDefault()
    const { type, id } = modal
    const clean = { ...form }
    Object.keys(clean).forEach((key) => { if (['budget', 'progress', 'wage', 'quantity', 'threshold', 'cost', 'amount'].includes(key)) clean[key] = Number(clean[key] || 0) })
    if (type === 'projects' && (clean.progress < 0 || clean.progress > 100)) { setToast('Progress must be between 0 and 100%'); return }
    setData((current) => ({ ...current, [type]: id ? current[type].map((row) => row.id === id ? { ...row, ...clean } : row) : [{ ...clean, id: Date.now() }, ...current[type]] }))
    setModal(null)
    setToast(id ? 'Changes saved' : 'New record added')
  }
  const handlePage = (newPage) => { setPage(newPage); setQuery(''); setFilter('All statuses'); setMobileOpen(false) }
  const actionButton = (label, type) => <button className="button primary" onClick={() => addNew(type)}><Plus size={16} />{label}</button>

  const renderDashboard = () => <>
    <SectionHeading eyebrow={new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} title="Good morning, Aarav" subtitle="Here’s what’s happening across your sites today." action={<button className="button secondary" onClick={() => handlePage('Schedule')}><CalendarDays size={16} />View schedule</button>} />
    <div className="stats-grid">
      <StatCard icon={BriefcaseBusiness} label="Total projects" value={projects.length} detail={`${activeProjects} currently in progress`} trend="12%" />
      <StatCard icon={TrendingUp} label="Active projects" value={activeProjects} detail="Currently in progress" tone="blue" />
      <StatCard icon={Check} label="Completed projects" value={projects.filter((p) => p.status === 'Completed').length} detail="This year" tone="green" />
      <StatCard icon={Users} label="Total workforce" value={data.workers.length} detail={`${data.workers.filter((w) => w.status === 'On site').length} workers on site`} tone="purple" />
      <StatCard icon={Package} label="Material cost" value={money(data.materials.reduce((sum, m) => sum + m.quantity * m.cost, 0))} detail="Current inventory value" tone="orange" />
      <StatCard icon={Wallet} label="Total project cost" value={money(projects.reduce((sum, p) => sum + Number(p.budget || 0), 0))} detail="Combined project budgets" tone="green" />
    </div>
    <div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h2>Project expenditure</h2><p>Monthly budget vs. actual spend</p></div><button className="select-button" onClick={() => handlePage('Costs')}>Last 6 months <ChevronDown size={14} /></button></div><div className="chart-legend"><span><i className="legend-dot orange" />Budget</span><span><i className="legend-dot dark" />Actual spend</span></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id="budgetFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f29a38" stopOpacity={0.17} /><stop offset="100%" stopColor="#f29a38" stopOpacity={0} /></linearGradient><linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#273647" stopOpacity={0.12} /><stop offset="100%" stopColor="#273647" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f2" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8d969f', fontSize: 11 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8d969f', fontSize: 11 }} tickFormatter={(v) => `₹${v}k`} /><Tooltip formatter={(v) => [`₹${v}k`, '']} contentStyle={{ border: '1px solid #edf0f2', borderRadius: 9, fontSize: 12 }} /><Area type="monotone" dataKey="budget" stroke="#ed9a3e" strokeWidth={2} fill="url(#budgetFill)" /><Area type="monotone" dataKey="actual" stroke="#33485c" strokeWidth={2} fill="url(#actualFill)" /></AreaChart></ResponsiveContainer></div><div className="chart-foot"><span>Active project budget</span><strong>{money(totalBudget)}</strong><span className="spend-chip"><ArrowDownRight size={14} />{totalBudget ? Math.round((spent / totalBudget) * 100) : 0}% spent</span></div></section>
      <section className="panel deadlines-panel"><div className="panel-heading"><div><h2>Upcoming deadlines</h2><p>Tasks that need attention</p></div><button className="text-link" onClick={() => handlePage('Schedule')}>View all <ChevronRight size={15} /></button></div><div className="deadline-list">{upcoming.map((task) => <div className="deadline-item" key={task.id}><div className="deadline-date"><b>{new Date(`${task.due}T00:00:00`).getDate()}</b><span>{new Date(`${task.due}T00:00:00`).toLocaleString('en-IN', { month: 'short' })}</span></div><div className="deadline-info"><strong>{task.title}</strong><span>{task.project}</span><small><Users size={12} />{task.assignee}</small></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div>)}</div></section></div>
    <div className="dashboard-grid lower-grid"><section className="panel projects-panel"><div className="panel-heading"><div><h2>Project overview</h2><p>Track progress across your active sites</p></div><button className="text-link" onClick={() => handlePage('Projects')}>All projects <ChevronRight size={15} /></button></div><div className="table-scroll"><table><thead><tr><th>Project</th><th>Manager</th><th>Status</th><th>Progress</th></tr></thead><tbody>{projects.slice(0, 4).map((p) => <tr key={p.id}><td><strong>{p.name}</strong><small>{p.location}</small></td><td>{p.manager}</td><td><StatusBadge status={p.status} /></td><td><Progress value={p.progress} /></td></tr>)}</tbody></table></div></section><section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest updates from your team</p></div><button className="icon-button" aria-label="Activity settings"><Settings2 size={17} /></button></div><div className="activity-list">{data.activities.slice(0, 4).map((a) => <div className="activity-item" key={a.id}><span className={`activity-mark ${a.color}`}><Activity size={14} /></span><div><strong>{a.text}</strong><span>{a.project}</span><small>{a.time}</small></div></div>)}</div></section></div>
    <div className="budget-strip"><div className="budget-symbol"><TrendingUp size={19} /></div><div className="budget-copy"><strong>Portfolio budget health</strong><span>Combined budget for active projects</span></div><div className="budget-bar"><div><span style={{ width: `${totalBudget ? Math.min(100, Math.round(spent / totalBudget * 100)) : 0}%` }} /></div><small>{totalBudget ? Math.min(100, Math.round(spent / totalBudget * 100)) : 0}% utilized</small></div><strong className="budget-number">{money(totalBudget - spent)} <small>remaining</small></strong></div>
  </>

  const filtered = (type, fields, statusField = 'status') => {
    const term = query.toLowerCase().trim()
    return data[type].filter((item) => (!term || fields.some((key) => String(item[key] || '').toLowerCase().includes(term))) && (filter === 'All statuses' || (type === 'materials' ? filter === 'low' ? item.quantity <= item.threshold : filter === 'healthy' ? item.quantity > item.threshold : true : item[statusField] === filter)))
  }
  const tablePage = (type, title, subtitle, defs, columns, searchFields, filters, buttonText, summary) => <>
    <SectionHeading eyebrow="SITE OPERATIONS" title={title} subtitle={subtitle} action={actionButton(buttonText, type)} />
    {summary && <div className="inline-summary">{summary}</div>}
    <div className="toolbar"><label className="search-box"><Search size={17} /><input placeholder={`Search ${title.toLowerCase()}...`} value={query} onChange={(e) => setQuery(e.target.value)} /><kbd>⌘ K</kbd></label><label className="filter-box"><Settings2 size={16} /><select value={filter} onChange={(e) => setFilter(e.target.value)}>{filters.map((f) => <option key={f}>{f}</option>)}</select><ChevronDown size={14} /></label><span className="result-count">{filtered(type, searchFields).length} records</span></div>
    <section className="panel full-table"><div className="table-scroll"><table><thead><tr>{columns.map((c) => <th key={c.label}>{c.label}</th>)}<th className="action-col">Actions</th></tr></thead><tbody>{filtered(type, searchFields).map((item) => <tr key={item.id}>{columns.map((c) => <td key={c.label}>{c.render ? c.render(item) : item[c.key]}</td>)}<td className="row-actions"><button onClick={() => editItem(type, item)} aria-label="Edit record" className="row-action"><Settings2 size={15} /></button><button onClick={() => removeItem(type, item)} aria-label="Delete record" className="row-action danger"><Trash2 size={15} /></button></td></tr>)}</tbody></table>{!filtered(type, searchFields).length && <div className="empty-state"><Search size={21} /><strong>No records found</strong><span>Try another search or add a new record.</span></div>}</div><div className="table-footer">Showing {filtered(type, searchFields).length} of {data[type].length} records <div><button className="icon-button" aria-label="Previous page"><ChevronLeft size={15} /></button><button className="page-number">1</button><button className="icon-button" aria-label="Next page"><ChevronRight size={15} /></button></div></div></section>
    {modal?.type === type && renderForm(type, defs)}
  </>

  const renderForm = (type, defs) => {
    const title = `${modal.id ? 'Edit' : 'Add'} ${type === 'expenses' ? 'expense' : type.slice(0, -1)}`
    return <Modal title={title} onClose={() => setModal(null)} onSubmit={handleSave}>{defs.map(([name, label, kind, opts, required]) => <Field key={name} name={name} label={label} value={form[name]} required={required !== false} type={kind === 'select' ? 'text' : kind || 'text'} options={kind === 'select' ? (opts === 'projects' ? projectNames : opts === 'workers' ? workerNames : opts) : null} step={kind === 'number' ? 'any' : undefined} placeholder={kind === 'number' ? '0' : ''} onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))} />)}</Modal>
  }

  const renderPage = () => {
    if (page === 'Dashboard') return renderDashboard()
    if (page === 'Projects') return tablePage('projects', 'Projects', 'Manage your project portfolio, budgets and delivery progress.', fieldDefs.projects, [
      { label: 'Project', render: (p) => <><strong>{p.name}</strong><small>{p.client} · {p.location}</small></> }, { label: 'Project manager', key: 'manager' }, { label: 'Timeline', render: (p) => <><strong>{p.start}</strong><small>to {p.end}</small></> }, { label: 'Budget', render: (p) => money(p.budget) }, { label: 'Status', render: (p) => <StatusBadge status={p.status} /> }, { label: 'Progress', render: (p) => <Progress value={p.progress} /> },
    ], ['name', 'client', 'location', 'manager'], ['All statuses', 'Planning', 'In Progress', 'On Hold', 'Completed'], 'Add project', <><b>{projects.length}</b> projects <span>·</span> Portfolio budget <b>{money(projects.reduce((s, p) => s + p.budget, 0))}</b></>)
    if (page === 'Workers') return tablePage('workers', 'Workers', 'Your people, roles and project assignments.', fieldDefs.workers, [
      { label: 'Worker', render: (w) => <div className="worker-cell"><span className="avatar">{w.name.split(' ').map((x) => x[0]).join('')}</span><div><strong>{w.name}</strong><small>{w.phone}</small></div></div> }, { label: 'Role', key: 'role' }, { label: 'Assigned project', key: 'project' }, { label: 'Daily wage', render: (w) => money(w.wage) }, { label: 'Availability', render: (w) => <StatusBadge status={w.status} /> },
    ], ['name', 'role', 'phone', 'project'], ['All statuses', 'On site', 'On leave'], 'Add worker', <><b>{data.workers.length}</b> team members <span>·</span> <b>{data.workers.filter((w) => w.status === 'On site').length}</b> on site today</>)
    if (page === 'Materials') return tablePage('materials', 'Materials', 'Keep inventory levels healthy and suppliers up to date.', fieldDefs.materials, [
      { label: 'Material', render: (m) => <><strong>{m.name}</strong><small>{m.category} · {m.supplier}</small></> }, { label: 'Project', key: 'project' }, { label: 'Stock level', render: (m) => <div className={`stock-cell ${m.quantity <= m.threshold ? 'low' : ''}`}><div className="stock-line"><strong>{m.quantity} {m.unit}</strong>{m.quantity <= m.threshold && <span><AlertTriangle size={13} />Low stock</span>}</div><div className="stock-track"><i style={{ width: `${Math.min(m.quantity / (m.threshold * 2) * 100, 100)}%` }} /></div></div> }, { label: 'Unit cost', render: (m) => `${money(m.cost)} / ${m.unit.replace(/s$/, '')}` }, { label: 'Inventory value', render: (m) => money(m.quantity * m.cost) },
    ], ['name', 'category', 'supplier', 'project'], ['All statuses', 'low', 'healthy'], 'Add material', <><b>{data.materials.length}</b> materials <span>·</span> <b className="warning-text">{data.materials.filter((m) => m.quantity <= m.threshold).length} low stock alerts</b> <span>·</span> Inventory value <b>{money(data.materials.reduce((s, m) => s + m.quantity * m.cost, 0))}</b></>, 'quantity')
    if (page === 'Costs') return renderCosts()
    if (page === 'Schedule') return renderSchedule()
  }
  function renderCosts() {
    const expenses = filtered('expenses', ['title', 'category', 'project', 'notes'], 'category')
    const categories = ['All statuses', ...new Set(data.expenses.map((e) => e.category))]
    const ratio = totalBudget ? Math.min(100, spent / totalBudget * 100) : 0
    return <><SectionHeading eyebrow="FINANCIAL CONTROL" title="Costs & expenses" subtitle="Track project spending and keep budgets on course." action={actionButton('Add expense', 'expenses')} /><div className="cost-stats"><article className="cost-stat"><span>Total budget</span><strong>{money(projects.reduce((s, p) => s + p.budget, 0))}</strong><small>Across all projects</small></article><article className="cost-stat"><span>Amount spent</span><strong>{money(spent)}</strong><small>Recorded expenses</small></article><article className="cost-stat"><span>Remaining budget</span><strong>{money(projects.reduce((s, p) => s + p.budget, 0) - spent)}</strong><small>Available to allocate</small></article><article className="cost-stat utilization"><span>Budget utilized</span><strong>{Math.round(ratio)}%</strong><div className="progress-track"><span style={{ width: `${ratio}%` }} /></div><small>{money(spent)} spent of {money(totalBudget)} active budget</small></article></div><div className="toolbar"><label className="search-box"><Search size={17} /><input placeholder="Search expenses..." value={query} onChange={(e) => setQuery(e.target.value)} /></label><label className="filter-box"><Settings2 size={16} /><select value={filter} onChange={(e) => setFilter(e.target.value)}>{categories.map((f) => <option key={f}>{f}</option>)}</select><ChevronDown size={14} /></label><span className="result-count">{expenses.length} expenses · {money(expenses.reduce((s, e) => s + e.amount, 0))}</span></div><section className="panel full-table"><div className="table-scroll"><table><thead><tr><th>Description</th><th>Project</th><th>Category</th><th>Date</th><th>Amount</th><th className="action-col">Actions</th></tr></thead><tbody>{expenses.map((e) => <tr key={e.id}><td><strong>{e.title}</strong><small>{e.notes || '—'}</small></td><td>{e.project}</td><td><span className="category-tag">{e.category}</span></td><td>{e.date}</td><td><strong>{money(e.amount)}</strong></td><td className="row-actions"><button onClick={() => editItem('expenses', e)} className="row-action" aria-label="Edit expense"><Settings2 size={15} /></button><button onClick={() => removeItem('expenses', e)} className="row-action danger" aria-label="Delete expense"><Trash2 size={15} /></button></td></tr>)}</tbody></table>{!expenses.length && <div className="empty-state"><Search size={21} /><strong>No expenses found</strong><span>Try another search or add an expense.</span></div>}</div><div className="table-footer">Showing {expenses.length} expenses <div><button className="icon-button"><ChevronLeft size={15} /></button><button className="page-number">1</button><button className="icon-button"><ChevronRight size={15} /></button></div></div></section>{modal?.type === 'expenses' && renderForm('expenses', fieldDefs.expenses)}</>
  }
  function renderSchedule() {
    const tasks = filtered('tasks', ['title', 'project', 'assignee', 'priority'])
    return <><SectionHeading eyebrow="FIELD PLANNING" title="Schedule & tasks" subtitle="Coordinate site work, owners and important dates." action={actionButton('Add task', 'tasks')} /><div className="schedule-summary"><div><span className="calendar-tile"><CalendarDays size={19} /></span><div><small>TASKS THIS WEEK</small><strong>{data.tasks.filter((t) => t.status !== 'Completed' && t.due <= days(7)).length} <span>tasks due soon</span></strong></div></div><div><span className="calendar-tile overdue"><AlertTriangle size={19} /></span><div><small>OVERDUE TASKS</small><strong>{data.tasks.filter((t) => t.status !== 'Completed' && t.due < today).length} <span>need attention</span></strong></div></div><div><span className="calendar-tile done"><Check size={19} /></span><div><small>COMPLETED</small><strong>{data.tasks.filter((t) => t.status === 'Completed').length} <span>tasks finished</span></strong></div></div></div><div className="toolbar"><label className="search-box"><Search size={17} /><input placeholder="Search tasks, projects, workers..." value={query} onChange={(e) => setQuery(e.target.value)} /></label><label className="filter-box"><Settings2 size={16} /><select value={filter} onChange={(e) => setFilter(e.target.value)}>{['All statuses', 'Pending', 'In Progress', 'Completed'].map((f) => <option key={f}>{f}</option>)}</select><ChevronDown size={14} /></label><span className="result-count">{tasks.length} tasks</span></div><section className="panel full-table"><div className="table-scroll"><table><thead><tr><th>Task</th><th>Project</th><th>Assignee</th><th>Timeline</th><th>Priority</th><th>Status</th><th className="action-col">Actions</th></tr></thead><tbody>{tasks.map((t) => <tr key={t.id}><td><strong>{t.title}</strong></td><td>{t.project}</td><td>{t.assignee}</td><td><strong>{t.start}</strong><small>Due {t.due}</small></td><td><span className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</span></td><td><StatusBadge status={t.status} /></td><td className="row-actions"><button onClick={() => editItem('tasks', t)} className="row-action" aria-label="Edit task"><Settings2 size={15} /></button><button onClick={() => removeItem('tasks', t)} className="row-action danger" aria-label="Delete task"><Trash2 size={15} /></button></td></tr>)}</tbody></table>{!tasks.length && <div className="empty-state"><Search size={21} /><strong>No tasks found</strong><span>Try another search or add a task.</span></div>}</div><div className="table-footer">Showing {tasks.length} of {data.tasks.length} tasks <div><button className="icon-button"><ChevronLeft size={15} /></button><button className="page-number">1</button><button className="icon-button"><ChevronRight size={15} /></button></div></div></section>{modal?.type === 'tasks' && renderForm('tasks', fieldDefs.tasks)}</>
  }

  return <div className="app-shell"><aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}><div className="brand"><span className="brand-mark"><HardHat size={22} /></span><span>build<span>track</span><small>PROJECT OPERATIONS</small></span><button className="mobile-close icon-button" onClick={() => setMobileOpen(false)}><X size={18} /></button></div><div className="workspace"><span className="workspace-logo">N</span><span><strong>Northstar Build Co.</strong><small>Workspace</small></span><ChevronDown size={15} /></div><div className="nav-label">WORKSPACE</div><nav>{navItems.map(({ id, icon: Icon }) => <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => handlePage(id)}><Icon size={18} /><span>{id}</span>{id === 'Materials' && data.materials.some((m) => m.quantity <= m.threshold) && <i className="nav-alert" />}</button>)}</nav><div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><HardHat size={17} /></div><strong>Built for the field</strong><p>Everything your team needs to keep projects moving.</p><button onClick={() => setToast('You’re all set — your workspace is up to date.')}>Learn more <ChevronRight size={14} /></button></div><button className="profile"><span className="profile-avatar">AM</span><span><strong>Aarav Mehta</strong><small>Project manager</small></span><ChevronDown size={15} /></button></div></aside>{mobileOpen && <button className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}<main className="main-area"><header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>{page}</strong></div></div><div className="topbar-right"><span className="live-indicator"><i />All changes saved</span><span className="top-divider" /><button className="today-button"><CalendarDays size={15} />Oct 8, 2026</button><span className="top-avatar">AM</span></div></header><div className="content">{renderPage()}<footer className="app-footer"><span>© 2026 BuildTrack</span><span>Construction project operations, made clear.</span><span>Help center <ChevronRight size={12} /></span></footer></div></main>{toast && <div className="toast"><Check size={16} />{toast}</div>}</div>
}

export default App
