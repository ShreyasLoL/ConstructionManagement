import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import RecordActions from '../../components/RecordActions.jsx'
import ResourcePage from '../../components/ResourcePage.jsx'
import { formatINR } from '../../utils/formatINR.js'
import './Projects.css'

const columns = [
  { key: 'name', label: 'Project', render: (row) => <span className="project-table-name"><Link to={`/projects/${row.id}`}>{row.name}</Link><small>{row.client} · {row.location}</small></span> },
  { key: 'manager', label: 'Manager' },
  { key: 'timeline', label: 'Timeline', render: (row) => `${row.start} — ${row.end}` },
  { key: 'budget', label: 'Budget', numeric: true, render: (row) => formatINR(row.budget) },
  { key: 'status', label: 'Status', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
  { key: 'progress', label: 'Progress', render: (row) => <ProgressBar value={row.progress} label={`${row.name} progress`} /> },
  { key: 'actions', label: '', className: 'actions-col', render: (row) => <RecordActions type="projects" row={row} /> },
]
export default function Projects() {
  const navigate = useNavigate()
  return <div className="projects-page"><ResourcePage type="projects" title="Projects" description="Your construction projects and delivery progress." columns={columns} addLabel="New project" searchable={['name', 'client', 'location', 'manager']} filterOptions={['Planning', 'In Progress', 'On Hold', 'Completed']} onRowClick={(project) => navigate(`/projects/${project.id}`)} /></div>
}
