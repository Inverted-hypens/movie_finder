import MovieCard from '../../components/MovieCard/MovieCard'
import { useFavouritesViewModel } from './useFavouritesViewModel'
import '../Home/HomeView.css'

function FavouritesView() {
  const { movies, loading, error, handleRemove } = useFavouritesViewModel()

  return (
    <main className="home-view">
      <h1>Favourites</h1>
      {loading && <p className="home-view__status">Loading favourites...</p>}
      {error && <p className="home-view__status home-view__status--error" role="alert">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="home-view__status">You have no favourites yet.</p>
      )}
      <ul className="movie-grid">
        {movies.map((movie) => (
          <li className="movie-grid__item" key={movie.imdbID}>
            <MovieCard
              movie={movie}
              isFavourite
              onToggleFavourite={() => handleRemove(movie.imdbID)}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}

export default FavouritesView
