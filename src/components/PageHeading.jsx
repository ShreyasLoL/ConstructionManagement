export default function PageHeading({ title, description, action }) {
  return <header className="page-heading" aria-label={title}><div>{description && <p>{description}</p>}</div>{action}</header>
}
import './PageHeading.css'

