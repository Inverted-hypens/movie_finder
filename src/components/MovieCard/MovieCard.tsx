import type { Movie } from '../../types/movie'
import './MovieCard.css'

interface MovieCardProps {
  movie: Movie
  isFavourite: boolean
  onToggleFavourite: (movie: Movie) => Promise<void>
}

function MovieCard({ movie, isFavourite, onToggleFavourite }: MovieCardProps) {
  return (
    <article className="movie-card">
      <img className="movie-card__poster" src={movie.Poster} alt={`${movie.Title} poster`} />
      <div className="movie-card__content">
        <div className="movie-card__heading">
          <h2 className="movie-card__title">{movie.Title}</h2>
          <button
            className="movie-card__favourite"
            type="button"
            aria-label={`${isFavourite ? 'Remove' : 'Add'} ${movie.Title} ${isFavourite ? 'from' : 'to'} favourites`}
            title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            onClick={() => void onToggleFavourite(movie)}
          >
            <span aria-hidden="true">{isFavourite ? '\u2665' : '\u2661'}</span>
          </button>
        </div>
        <div className="movie-card__metadata">
          <p>{movie.Year}</p>
          <p>{movie.Type}</p>
        </div>
      </div>
    </article>
  )
}

export default MovieCard
