import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAppData } from '../context/useAppData.js'
import PageHeading from './PageHeading.jsx'
import Button from './ui/Button.jsx'
import DataTable from './ui/DataTable.jsx'
import './ResourcePage.css'

const EMPTY_ROWS = []
export default function ResourcePage({ type, title, description, columns, addLabel, searchable = [], filterOptions = [], onRowClick }) {
  const { data, openForm } = useAppData()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const source = data[type] || EMPTY_ROWS
  const rows = useMemo(() => source.filter((row) => {
    const matchesText = !query.trim() || searchable.some((key) => String(row[key] ?? '').toLowerCase().includes(query.toLowerCase().trim()))
    let matchesFilter = true
    if (filter !== 'All') {
      if (type === 'materials') matchesFilter = filter === 'Low stock' ? row.quantity <= row.threshold : row.quantity > row.threshold
      else if (type === 'expenses') matchesFilter = row.category === filter
      else matchesFilter = row.status === filter
    }
    return matchesText && matchesFilter
  }), [source, query, filter, searchable, type])
  return <div className="resource-page"><PageHeading title={title} description={description} action={<Button onClick={() => openForm(type)}><Plus aria-hidden="true" />{addLabel}</Button>} />
    <div className="resource-toolbar"><label className="resource-search"><Search aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} aria-label={`Search ${title.toLowerCase()}`} /></label>{filterOptions.length > 0 && <label className="resource-filter"><span>Filter</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option>{filterOptions.map((option) => <option key={option}>{option}</option>)}</select></label>}<span className="resource-count">{rows.length} {title.toLowerCase()}</span></div>
    <DataTable columns={columns} rows={rows} onRowClick={onRowClick} emptyTitle={query || filter !== 'All' ? 'No matching records' : `No ${title.toLowerCase()} yet`} emptyText={query || filter !== 'All' ? 'Adjust your search or filter.' : 'Add a record to get started.'} />
  </div>
}
