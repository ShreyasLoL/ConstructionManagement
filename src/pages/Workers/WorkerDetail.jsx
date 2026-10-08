import { CalendarDays, Pencil, Trash2, X } from 'lucide-react'
import { useAppData } from '../../context/useAppData.js'
import { formatINR } from '../../utils/formatINR.js'
import PageHeading from '../../components/PageHeading.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Card from '../../components/ui/Card.jsx'
import './WorkerDetail.css'

const dateFormat = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not provided'
const valueOrUnknown = (value, suffix = '') => value === '' || value === undefined || value === null ? 'Not provided' : `${value}${suffix}`

export default function WorkerDetail({ worker, onClose }) {
  const { openForm, removeRecord } = useAppData()
  const deleteWorker = () => { if (removeRecord('workers', worker)) onClose() }
  return <div className="worker-detail-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="worker-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="worker-detail-title"><div className="worker-detail-topbar"><span>Personnel record</span><Button variant="quiet" onClick={onClose} aria-label="Close personnel record"><X aria-hidden="true" /></Button></div>
    <div className="worker-detail-page">
    <PageHeading title={worker.name} description={`${worker.employee_id || 'Employee ID pending'} · Personnel biodata`} action={<div className="worker-profile-actions"><Button variant="secondary" onClick={() => openForm('workers', worker)}><Pencil aria-hidden="true" />Edit record</Button><Button variant="quiet" onClick={deleteWorker} aria-label={`Delete ${worker.name}`}><Trash2 aria-hidden="true" />Delete</Button></div>} />
    <Card className="worker-record-sheet"><div className="worker-sheet-heading"><span>BUILDTRACK · PERSONNEL RECORD</span><Badge status={worker.status}>{worker.status}</Badge></div><div className="worker-sheet-rule" /><div className="worker-record-identity"><span className="worker-record-avatar">{worker.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><h2 id="worker-detail-title">{worker.name}</h2><p>{worker.role} · {worker.project}</p></div></div>
      <section className="worker-biodata"><h3>Employee information</h3><dl><div><dt>Employee ID</dt><dd>{worker.employee_id || 'Not provided'}</dd></div><div><dt>Department / role</dt><dd>{worker.role || 'Not provided'}</dd></div><div><dt>Age</dt><dd>{valueOrUnknown(worker.age, ' years')}</dd></div><div><dt>Experience</dt><dd>{valueOrUnknown(worker.experience, ' years')}</dd></div><div><dt>Join date</dt><dd><CalendarDays aria-hidden="true" />{dateFormat(worker.join_date)}</dd></div><div><dt>Project assignment</dt><dd>{worker.project || 'Not assigned'}</dd></div><div><dt>Employment status</dt><dd>{worker.status || 'Not provided'}</dd></div><div><dt>Phone</dt><dd>{worker.phone || 'Not provided'}</dd></div><div><dt>Monthly salary</dt><dd>{worker.salary === '' || worker.salary === undefined || worker.salary === null ? 'Not provided' : formatINR(worker.salary)}</dd></div><div><dt>Daily wage</dt><dd>{worker.wage === '' || worker.wage === undefined || worker.wage === null ? 'Not provided' : `${formatINR(worker.wage)} / day`}</dd></div></dl></section>
      <section className="worker-notes-section"><h3>Notes</h3><p>{worker.notes?.trim() || 'No notes recorded for this employee.'}</p></section><footer className="worker-sheet-footer">Confidential personnel information · Maintained by project management</footer>
    </Card>
    </div></section></div>
}
