import './Badge.css'

const normalize = (value) => String(value || 'Pending').toLowerCase().replaceAll(' ', '-')
export default function Badge({ children, status = children }) {
  return <span className={`badge badge-${normalize(status)}`}><i aria-hidden="true" />{children}</span>
}
