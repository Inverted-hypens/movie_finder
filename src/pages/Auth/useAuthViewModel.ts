import { useState } from 'react'
import type { AuthMode } from '../../types/auth'
import { login, register } from './AuthModel'

export function useAuthViewModel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }

      setPassword('')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Authentication failed.',
      )
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode((currentMode) =>
      currentMode === 'login' ? 'register' : 'login',
    )
    setError(null)
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  }
}
