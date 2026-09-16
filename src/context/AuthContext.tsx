import {
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import type { User } from 'firebase/auth'
import {
  logoutUser,
  subscribeToAuthChanges,
} from '../services/authService'
import { AuthContext } from './authContextValue'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })

    return unsubscribe
  }, [])

  const logout = () => logoutUser()

  return (
    <AuthContext.Provider value={{ user, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
