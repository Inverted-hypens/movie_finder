import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './Header.css'

interface HeaderProps {
  query: string
  setQuery: (query: string) => void
  handleSearch: () => Promise<void>
}

function Header({ query, setQuery, handleSearch }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (location.pathname !== '/') {
      navigate('/')
    }

    void handleSearch()
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link className="site-nav__link" to="/">
          Home
        </Link>
        <Link className="site-nav__link" to="/favourites">
          Favourites
        </Link>
      </nav>
      <form className="search-controls" onSubmit={submitSearch}>
        <input
          className="search-controls__input"
          type="search"
          placeholder="Search movies"
          aria-label="Search movies"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="search-controls__button" type="submit">
          Search
        </button>
      </form>
      {user ? (
        <button className="logout-button" type="button" onClick={() => void handleLogout()}>
          Logout
        </button>
      ) : (
        <Link className="login-link" to="/auth">
          Login
        </Link>
      )}
    </header>
  )
}

export default Header
