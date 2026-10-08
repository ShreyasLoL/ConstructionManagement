import { useMemo, useState } from 'react'
import { useAppData } from '../../context/useAppData.js'
import { todayISO } from '../../context/schema.js'
import PageHeading from '../../components/PageHeading.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import RecordActions from '../../components/RecordActions.jsx'
import './Schedule.css'

export default function Schedule() {
  const { data, openForm } = useAppData()
  const [filter, setFilter] = useState('All')
  const tasks = useMemo(() => data.tasks.filter((task) => filter === 'All' || task.status === filter).toSorted((a, b) => a.due.localeCompare(b.due)), [data.tasks, filter])
  const overdueCount = data.tasks.filter((task) => task.status !== 'Completed' && task.due < todayISO).length
  const columns = [
    { key: 'title', label: 'Task', render: (task) => <span className={task.status !== 'Completed' && task.due < todayISO ? 'task-overdue' : ''}>{task.title}{task.status !== 'Completed' && task.due < todayISO && <small>Overdue</small>}</span> },
    { key: 'project', label: 'Project' }, { key: 'assignee', label: 'Assigned worker' },
    { key: 'due', label: 'Due date' }, { key: 'priority', label: 'Priority', render: (task) => <Badge status={task.priority}>{task.priority}</Badge> },
    { key: 'status', label: 'Status', render: (task) => <Badge status={task.status}>{task.status}</Badge> },
    { key: 'actions', label: '', className: 'actions-col', render: (task) => <RecordActions type="tasks" row={task} /> },
  ]
  return <div className="schedule-page"><PageHeading title="Schedule" description={`${data.tasks.length} tasks · ${overdueCount} overdue`} action={<Button onClick={() => openForm('tasks')}><span aria-hidden="true">＋</span>New task</Button>} />
    <div className="schedule-toolbar"><label>Task status<select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select></label><span>Ordered by due date</span></div><DataTable columns={columns} rows={tasks} emptyTitle="No tasks yet" emptyText="Create a task to add it to the schedule." />
  </div>
}
