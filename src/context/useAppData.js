import { useContext } from 'react'
import { DataContext } from './AppDataContext.js'

export function useAppData() {
  const value = useContext(DataContext)
  if (!value) throw new Error('useAppData must be used within AppDataProvider')
  return value
}
