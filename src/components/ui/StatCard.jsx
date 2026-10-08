import Card from './Card.jsx'
import './StatCard.css'

export default function StatCard({ label, value, detail, featured = false }) {
  return <Card className={`stat-card ${featured ? 'stat-card-featured' : ''}`}><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong>{detail && <span className="stat-detail">{detail}</span>}</Card>
}
