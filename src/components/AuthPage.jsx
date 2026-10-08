import { useState } from 'react'
import { HardHat, LogIn } from 'lucide-react'
import { useAppData } from '../context/useAppData.js'
import Button from './ui/Button.jsx'
import './AuthPage.css'

export default function AuthPage() {
  const { signIn, supabaseConfigured, backendError } = useAppData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const result = await signIn(email, password)
      if (result.error) setError(result.error.message)
    } catch (signInError) {
      setError(signInError.message || 'Could not sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="auth-screen"><section className="auth-card"><div className="auth-brand"><span className="brand-mark"><HardHat aria-hidden="true" /></span><strong>BuildTrack</strong></div>
    {supabaseConfigured ? <><header><h1>Welcome back</h1><p>Sign in to access your project workspace.</p></header><form onSubmit={submit}><label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className="auth-error" role="alert">{error}</p>}<Button type="submit" disabled={submitting}><LogIn aria-hidden="true" />{submitting ? 'Signing in…' : 'Sign in'}</Button></form><p className="auth-footnote">Need access? Ask your workspace administrator to invite you.</p></> : <><header><h1>Connect Supabase</h1><p>{backendError}</p></header><p className="auth-footnote">Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to <code>.env.local</code>, then restart the development server.</p></>}
  </section></main>
}
