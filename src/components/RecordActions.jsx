import { Pencil, Trash2 } from 'lucide-react'
import { useAppData } from '../context/useAppData.js'

export default function RecordActions({ type, row }) {
  const { openForm, removeRecord } = useAppData()
  return <span className="record-actions"><button className="icon-button" onClick={() => openForm(type, row)} aria-label={`Edit ${row.name || row.title}`}><Pencil aria-hidden="true" /></button><button className="icon-button icon-button-danger" onClick={() => removeRecord(type, row)} aria-label={`Delete ${row.name || row.title}`}><Trash2 aria-hidden="true" /></button></span>
}
