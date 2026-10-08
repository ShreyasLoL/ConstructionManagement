import { Check, X } from 'lucide-react'
import { useAppData } from '../context/useAppData.js'
import { fieldDefs } from '../context/schema.js'
import Button from './ui/Button.jsx'
import './RecordModal.css'

const titleFor = (type) => type === 'expenses' ? 'expense' : type.slice(0, -1)
export default function RecordModal() {
  const { modal, form, setForm, closeForm, saveForm, projectNames, workerNames } = useAppData()
  if (!modal) return null
  const type = modal.type
  const fields = fieldDefs[type] || []
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const getOptions = (options) => options === 'projects' ? projectNames : options === 'workers' ? workerNames : options
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm() }}>
    <section className="record-modal" role="dialog" aria-modal="true" aria-labelledby="record-modal-title"><header className="record-modal-header"><h2 id="record-modal-title">{modal.id ? 'Edit' : 'Add'} {titleFor(type)}</h2><button className="icon-button" onClick={closeForm} aria-label="Close form"><X /></button></header>
      <form onSubmit={saveForm}><div className="record-form-grid">{fields.map(([name, label, kind, options, required]) => <label className={`form-field ${kind === 'textarea' ? 'form-field-wide' : ''}`} key={name}><span>{label}{required !== false && <b> *</b>}</span>{kind === 'select' ? <select name={name} value={form[name] || ''} onChange={update} required={required !== false}><option value="">Select {label.toLowerCase()}</option>{getOptions(options).map((option) => <option key={option} value={option}>{option}</option>)}</select> : kind === 'textarea' ? <textarea name={name} value={form[name] ?? ''} onChange={update} required={required !== false} rows={4} /> : <input name={name} type={kind || 'text'} value={form[name] ?? ''} onChange={update} required={required !== false} step={kind === 'number' ? 'any' : undefined} placeholder={kind === 'number' ? '0' : undefined} />}</label>)}</div><footer className="record-modal-actions"><Button type="button" variant="secondary" onClick={closeForm}>Cancel</Button><Button type="submit"><Check aria-hidden="true" />Save</Button></footer></form>
    </section>
  </div>
}
