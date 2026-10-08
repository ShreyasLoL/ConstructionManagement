import Badge from '../../components/ui/Badge.jsx'
import RecordActions from '../../components/RecordActions.jsx'
import ResourcePage from '../../components/ResourcePage.jsx'
import { formatINR } from '../../utils/formatINR.js'
import './Workers.css'

const columns = [
  { key: 'name', label: 'Name', render: (row) => <strong>{row.name}</strong> },
  { key: 'role', label: 'Role' }, { key: 'project', label: 'Project' },
  { key: 'status', label: 'Status', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
  { key: 'wage', label: 'Daily wage', numeric: true, render: (row) => `${formatINR(row.wage)} / day` },
  { key: 'actions', label: '', className: 'actions-col', render: (row) => <RecordActions type="workers" row={row} /> },
]
export default function Workers() { return <div className="workers-page"><ResourcePage type="workers" title="Workers" description="People, roles, and project assignments." columns={columns} addLabel="Add worker" searchable={['name', 'role', 'project', 'phone']} filterOptions={['On site', 'On leave']} /></div> }
