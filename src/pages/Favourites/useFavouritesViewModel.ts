import { useEffect, useState } from 'react'
import type { Movie } from '../../types/movie'
import { useAuth } from '../../context/useAuth'
import { deleteFavourite, loadFavourites } from './FavouritesModel'

export function useFavouritesViewModel() {
  const { user } = useAuth()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    const loadUserFavourites = async () => {
      if (!user) {
        setMovies([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const results = await loadFavourites(user.uid)
        if (isCurrent) {
          setMovies(results)
        }
      } catch (caughtError) {
        if (isCurrent) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'Unable to load favourites.',
          )
        }
      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    void loadUserFavourites()

    return () => {
      isCurrent = false
    }
  }, [user])

  const handleRemove = async (imdbID: string) => {
    if (!user) {
      return
    }

    try {
      await deleteFavourite(user.uid, imdbID)
      setMovies((currentMovies) =>
        currentMovies.filter((movie) => movie.imdbID !== imdbID),
      )
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to remove favourite.',
      )
    }
  }

  return {
    movies,
    loading,
    error,
    handleRemove,
  }
}
