import { AlertTriangle } from 'lucide-react'
import Badge from '../../components/ui/Badge.jsx'
import RecordActions from '../../components/RecordActions.jsx'
import ResourcePage from '../../components/ResourcePage.jsx'
import { formatINR } from '../../utils/formatINR.js'
import './Materials.css'

const columns = [
  { key: 'name', label: 'Material', render: (row) => <span className="material-name"><strong>{row.name}</strong><small>{row.category} · {row.supplier}</small></span> },
  { key: 'project', label: 'Project' },
  { key: 'quantity', label: 'Available', numeric: true, render: (row) => <span className="material-quantity">{row.quantity} {row.unit}{row.quantity <= row.threshold && <Badge status="High"><AlertTriangle aria-hidden="true" />Low stock</Badge>}</span> },
  { key: 'threshold', label: 'Minimum', numeric: true, render: (row) => `${row.threshold} ${row.unit}` },
  { key: 'cost', label: 'Unit cost', numeric: true, render: (row) => formatINR(row.cost) },
  { key: 'actions', label: '', className: 'actions-col', render: (row) => <RecordActions type="materials" row={row} /> },
]
export default function Materials() { return <div className="materials-page"><ResourcePage type="materials" title="Materials" description="Inventory levels and low stock alerts." columns={columns} addLabel="Add material" searchable={['name', 'category', 'supplier', 'project']} filterOptions={['Low stock', 'Healthy']} /></div> }
