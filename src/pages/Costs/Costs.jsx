import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useAppData } from '../../context/useAppData.js'
import { formatINR } from '../../utils/formatINR.js'
import PageHeading from '../../components/PageHeading.jsx'
import Button from '../../components/ui/Button.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import Badge from '../../components/ui/Badge.jsx'
import DataTable from '../../components/ui/DataTable.jsx'
import RecordActions from '../../components/RecordActions.jsx'
import './Costs.css'

export default function Costs() {
  const { data, openForm } = useAppData()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const budgets = data.projects.reduce((sum, project) => sum + Number(project.budget || 0), 0)
  const spent = data.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const rows = useMemo(() => data.expenses.filter((row) => (!query || `${row.title} ${row.project} ${row.category} ${row.notes}`.toLowerCase().includes(query.toLowerCase())) && (filter === 'All' || row.category === filter)), [data.expenses, query, filter])
  const columns = [
    { key: 'title', label: 'Description', render: (row) => <span className="cost-description"><strong>{row.title}</strong><small>{row.notes || '—'}</small></span> },
    { key: 'project', label: 'Project' }, { key: 'category', label: 'Category', render: (row) => <Badge>{row.category}</Badge> },
    { key: 'date', label: 'Date' }, { key: 'amount', label: 'Amount', numeric: true, render: (row) => formatINR(row.amount) },
    { key: 'actions', label: '', className: 'actions-col', render: (row) => <RecordActions type="expenses" row={row} /> },
  ]
  return <div className="costs-page"><PageHeading title="Costs" description="Track project budgets and recorded expenses." action={<Button onClick={() => openForm('expenses')}><Plus aria-hidden="true" />Add expense</Button>} />
    <div className="cost-summary"><StatCard label="Total budget" value={formatINR(budgets)} detail="Across all projects" featured /><StatCard label="Spent" value={formatINR(spent)} detail={`${budgets ? Math.round(spent / budgets * 100) : 0}% of total budget`} /><StatCard label="Remaining" value={formatINR(budgets - spent)} detail="Available budget" /></div>
    <div className="cost-toolbar"><label><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search expenses" aria-label="Search expenses" /></label><select aria-label="Filter expense category" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option>{[...new Set(data.expenses.map((expense) => expense.category))].map((category) => <option key={category}>{category}</option>)}</select><span>{rows.length} expenses</span></div>
    <DataTable columns={columns} rows={rows} emptyTitle="No expenses yet" emptyText="Add an expense to start tracking project costs." />
  </div>
}
