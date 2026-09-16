import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import { useAuth } from './context/useAuth'
import AuthView from './pages/Auth/AuthView'
import FavouritesView from './pages/Favourites/FavouritesView'
import HomeView from './pages/Home/HomeView'
import { useHomeViewModel } from './pages/Home/useHomeViewModel'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

function AppRoutes() {
  const { user, authLoading } = useAuth()
  const homeViewModel = useHomeViewModel()

  return (
    <>
      <Header
        query={homeViewModel.query}
        setQuery={homeViewModel.setQuery}
        handleSearch={homeViewModel.handleSearch}
      />
      {authLoading ? (
        <p>Loading authentication...</p>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                movies={homeViewModel.movies}
                loading={homeViewModel.loading}
                error={homeViewModel.error}
                favouriteIds={homeViewModel.favouriteIds}
                onToggleFavourite={homeViewModel.handleFavouriteToggle}
              />
            }
          />
          <Route
            path="/auth"
            element={user ? <Navigate to="/" replace /> : <AuthView />}
          />
          <Route
            path="/favourites"
            element={
              user ? <FavouritesView /> : <Navigate to="/auth" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  )
}

export default App
