import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import { AppDataProvider } from './context/AppData.jsx'
import PageSkeleton from './components/ui/PageSkeleton.jsx'
import AuthPage from './components/AuthPage.jsx'
import { useAppData } from './context/useAppData.js'

const router = createBrowserRouter([
  { path: '/', element: <Layout />, children: [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    { path: 'dashboard', lazy: async () => ({ Component: (await import('./pages/Dashboard/Dashboard.jsx')).default }) },
    { path: 'projects', lazy: async () => ({ Component: (await import('./pages/Projects/Projects.jsx')).default }) },
    { path: 'projects/:id', lazy: async () => ({ Component: (await import('./pages/ProjectDetail/ProjectDetail.jsx')).default }) },
    { path: 'workers', lazy: async () => ({ Component: (await import('./pages/Workers/Workers.jsx')).default }) },
    { path: 'materials', lazy: async () => ({ Component: (await import('./pages/Materials/Materials.jsx')).default }) },
    { path: 'costs', lazy: async () => ({ Component: (await import('./pages/Costs/Costs.jsx')).default }) },
    { path: 'schedule', lazy: async () => ({ Component: (await import('./pages/Schedule/Schedule.jsx')).default }) },
    { path: '*', lazy: async () => ({ Component: (await import('./pages/NotFound.jsx')).default }) },
  ] },
])

function AppContent() {
  const { user, authLoading } = useAppData()
  if (authLoading) return <PageSkeleton />
  if (!user) return <AuthPage />
  return <RouterProvider router={router} fallbackElement={<PageSkeleton />} />
}

export default function App() {
  return <AppDataProvider><AppContent /></AppDataProvider>
}
