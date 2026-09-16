import type { Movie } from '../../types/movie'
import MovieCard from '../../components/MovieCard/MovieCard'
import './HomeView.css'

interface HomeViewProps {
  movies: Movie[]
  loading: boolean
  error: string | null
  favouriteIds: Set<string>
  onToggleFavourite: (movie: Movie) => Promise<void>
}

function HomeView({
  movies,
  loading,
  error,
  favouriteIds,
  onToggleFavourite,
}: HomeViewProps) {
  return (
    <main className="home-view">
      {loading && <p className="home-view__status">Loading movies...</p>}
      {error && <p className="home-view__status home-view__status--error" role="alert">{error}</p>}
      <ul className="movie-grid">
        {movies.map((movie) => (
          <li className="movie-grid__item" key={movie.imdbID}>
            <MovieCard
              movie={movie}
              isFavourite={favouriteIds.has(movie.imdbID)}
              onToggleFavourite={onToggleFavourite}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}

export default HomeView
