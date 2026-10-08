import { Link } from 'react-router-dom'
import PageHeading from '../components/PageHeading.jsx'

export default function NotFound() {
  return <PageHeading title="Page not found" description="The page you requested does not exist." action={<Link className="button button-primary" to="/dashboard">Go to dashboard</Link>} />
}
