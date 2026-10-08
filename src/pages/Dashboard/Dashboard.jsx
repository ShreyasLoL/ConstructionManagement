import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import { useAppData } from '../../context/useAppData.js'
import { todayISO } from '../../context/schema.js'
import { formatINR } from '../../utils/formatINR.js'
import PageHeading from '../../components/PageHeading.jsx'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import './Dashboard.css'

function useChartColors() {
  const read = () => ({ text: getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim(), grid: getComputedStyle(document.documentElement).getPropertyValue('--border').trim(), budget: getComputedStyle(document.documentElement).getPropertyValue('--chart-budget').trim(), spent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() })
  const [colors, setColors] = useState(read)
  useEffect(() => {
    const observer = new MutationObserver(() => setColors(read()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  return colors
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return <div className="chart-tooltip"><p>{label}</p>{payload.map((entry) => <div key={entry.name}><span>{entry.name}</span><strong>{formatINR(entry.value)}</strong></div>)}</div>
}

export default function Dashboard() {
  const { data } = useAppData()
  const colors = useChartColors()
  const budget = data.projects.reduce((sum, project) => sum + Number(project.budget || 0), 0)
  const spent = data.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const active = data.projects.filter((project) => project.status === 'In Progress')
  const openTasks = data.tasks.filter((task) => task.status !== 'Completed')
  const chartData = useMemo(() => data.projects.map((project) => ({ name: project.name, Budget: Number(project.budget || 0), Spent: data.expenses.filter((expense) => expense.project === project.name).reduce((sum, expense) => sum + Number(expense.amount || 0), 0) })), [data.projects, data.expenses])
  const needs = [
    ...data.materials.filter((material) => material.quantity <= material.threshold).map((material) => ({ label: `${material.name} is below minimum stock`, to: '/materials', hint: material.project })),
    ...openTasks.filter((task) => task.due < todayISO).map((task) => ({ label: `${task.title} is overdue`, to: '/schedule', hint: task.project })),
    ...data.projects.filter((project) => data.expenses.filter((expense) => expense.project === project.name).reduce((sum, expense) => sum + Number(expense.amount || 0), 0) > project.budget).map((project) => ({ label: `${project.name} is over budget`, to: `/projects/${project.id}`, hint: 'Review project costs' })),
  ]
  return <div className="dashboard-page"><PageHeading title="Dashboard" description="A clear view of your construction work." />
    <section className="dashboard-kpis" aria-label="Portfolio summary"><Card className="dashboard-hero"><div><span className="dashboard-kicker">Total spent</span><strong>{formatINR(spent)} <small>of {formatINR(budget)}</small></strong><div className="dashboard-budget-progress"><ProgressBar value={budget ? spent / budget * 100 : 0} label="Portfolio budget spent" /></div><p>{budget ? Math.round(spent / budget * 100) : 0}% of total project budgets</p></div><span className="budget-remaining">{formatINR(budget - spent)}<small>remaining</small></span></Card>
      <StatCard label="Active projects" value={active.length} detail="In progress" /><StatCard label="Workers" value={data.workers.length} detail="Across all projects" /><StatCard label="Open tasks" value={openTasks.length} detail={`${openTasks.filter((task) => task.due < todayISO).length} overdue`} />
    </section>
    <section className="dashboard-chart-section"><header><div><h2>Spend by project</h2><p>Compare recorded expenses with project budgets.</p></div></header><Card className="dashboard-chart-card">{chartData.length ? <ResponsiveContainer width="100%" height={Math.max(240, chartData.length * 54)}><BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 28, left: 8, bottom: 4 }} barGap={5}><CartesianGrid stroke={colors.grid} horizontal={false} /><XAxis type="number" tick={{ fill: colors.text, fontSize: 12 }} tickFormatter={(value) => `₹${Math.round(value / 100000)}L`} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={170} tick={{ fill: colors.text, fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="Budget" fill={colors.budget} radius={[0, 4, 4, 0]} barSize={12} /><Bar dataKey="Spent" fill={colors.spent} radius={[0, 4, 4, 0]} barSize={12} /></BarChart></ResponsiveContainer> : <div className="empty-state">No project budgets to compare.</div>}<div className="chart-legend"><span><i className="legend-budget" />Budget</span><span><i className="legend-spent" />Spent</span></div></Card></section>
    <div className="dashboard-lower"><section><header className="dashboard-section-heading"><div><h2>Active projects</h2><p>Current progress across sites.</p></div><Link to="/projects">All projects <ArrowUpRight aria-hidden="true" /></Link></header>{active.length ? <div className="dashboard-project-list">{active.map((project) => <Link className="dashboard-project-row" to={`/projects/${project.id}`} key={project.id}><span className="dashboard-project-name"><strong>{project.name}</strong><small>{project.location.split(',')[0]}</small></span><ProgressBar value={project.progress} label={`${project.name} progress`} /><span className="dashboard-project-budget">{formatINR(project.budget)}</span><Badge status={project.status}>{project.status}</Badge></Link>)}</div> : <Card className="empty-state">No active projects. Create a project to start tracking.</Card>}</section>
      <section><header className="dashboard-section-heading"><div><h2>Needs attention</h2><p>Items that may need action.</p></div></header><Card className="attention-list">{needs.length ? needs.map((item) => <Link className="attention-item" to={item.to} key={`${item.label}-${item.hint}`}><AlertTriangle aria-hidden="true" /><span><strong>{item.label}</strong><small>{item.hint}</small></span><ArrowUpRight aria-hidden="true" /></Link>) : <div className="empty-state">Everything is on track.</div>}</Card></section></div>
  </div>
}
