import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Movie } from '../../types/movie'
import { useAuth } from '../../context/useAuth'
import {
  deleteFavourite,
  loadFavourites,
  saveFavourite,
} from '../Favourites/FavouritesModel'
import { getMovies, initialMovies } from './HomeModel'

export function useHomeViewModel() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadInitialMovies = async () => {
      setLoading(true)
      setError(null)

      try {
        const results = await initialMovies()
        setMovies(results)
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to load initial movies.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadInitialMovies()
  }, [])

  useEffect(() => {
    let isCurrent = true
    const loadUserFavourites = async () => {
      if (!user) {
        await Promise.resolve()
        if (isCurrent) {
          setFavouriteIds(new Set())
        }
        return
      }

      try {
        const favourites = await loadFavourites(user.uid)
        if (isCurrent) {
          setFavouriteIds(new Set(favourites.map((movie) => movie.imdbID)))
        }
      } catch (caughtError) {
        if (isCurrent) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : 'Unable to load favourites.',
          )
        }
      }
    }

    void loadUserFavourites()

    return () => {
      isCurrent = false
    }
  }, [user])

  const handleSearch = async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await getMovies(query)
      setMovies(results)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to search for movies.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleFavouriteToggle = async (movie: Movie) => {
    if (!user) {
      navigate('/auth')
      return
    }

    const isFavourite = favouriteIds.has(movie.imdbID)

    try {
      if (isFavourite) {
        await deleteFavourite(user.uid, movie.imdbID)
        setFavouriteIds((currentIds) => {
          const nextIds = new Set(currentIds)
          nextIds.delete(movie.imdbID)
          return nextIds
        })
      } else {
        await saveFavourite(user.uid, movie)
        setFavouriteIds((currentIds) =>
          new Set(currentIds).add(movie.imdbID),
        )
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to update favourites.',
      )
    }
  }

  return {
    query,
    setQuery,
    movies,
    loading,
    error,
    handleSearch,
    favouriteIds,
    handleFavouriteToggle,
  }
}
