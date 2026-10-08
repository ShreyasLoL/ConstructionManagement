import './ProgressBar.css'

export default function ProgressBar({ value = 0, label }) {
  const amount = Math.round(Math.max(0, Math.min(100, Number(value) || 0)) * 10) / 10
  return <span className="progress-bar-wrap"><progress className="progress-bar" max="100" value={amount} aria-label={label || `Progress ${amount}%`}>{amount}%</progress><span className="progress-number">{amount}%</span></span>
}
