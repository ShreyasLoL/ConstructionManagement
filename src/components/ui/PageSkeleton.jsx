import './PageSkeleton.css'

export default function PageSkeleton() {
  return <div className="page-skeleton" aria-label="Loading page" role="status"><span className="skeleton-title" /><div className="skeleton-stats"><span /><span /><span /></div><span className="skeleton-table-heading" />{Array.from({ length: 5 }, (_, index) => <span className="skeleton-row" key={index} />)}<span className="skeleton-sr-only">Loading records</span></div>
}
