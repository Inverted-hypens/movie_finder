import type { FormEvent } from 'react'
import { useAuthViewModel } from './useAuthViewModel'
import './AuthView.css'

function AuthView() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  } = useAuthViewModel()

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void handleSubmit()
  }

  const isLogin = mode === 'login'

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__header">
          <p className="auth-card__eyebrow">Movie Finder</p>
          <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
          <p className="auth-card__intro">
            {isLogin
              ? 'Sign in to save movies to your favourites.'
              : 'Create an account to build your favourites collection.'}
          </p>
        </div>
        <form className="auth-form" onSubmit={submitForm}>
          <label htmlFor="auth-email">Email</label>
        <input
          className="auth-form__input"
          id="auth-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
          <label htmlFor="auth-password">Password</label>
        <input
          className="auth-form__input"
          id="auth-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          required
        />
          {error && <p className="auth-form__error" role="alert">{error}</p>}
          <button className="auth-form__submit" type="submit" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        <button className="auth-card__switch" type="button" onClick={toggleMode}>
          {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </button>
      </section>
    </main>
  )
}

export default AuthView
