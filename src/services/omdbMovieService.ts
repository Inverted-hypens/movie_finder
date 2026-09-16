import type { Movie, OmdbSearchResponse } from '../types/movie'

// Handles communication with the OMDb API.
const OMDB_API_BASE_URL = 'https://www.omdbapi.com/'

export async function searchMovies(query: string): Promise<Movie[]> {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  if (!apiKey) {
    throw new Error('OMDb API key is not configured.')
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    s: query,
  })
  const response = await fetch(`${OMDB_API_BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(
      `OMDb request failed: ${response.status} ${response.statusText}`,
    )
  }

  const data = (await response.json()) as OmdbSearchResponse

  if (data.Response === 'False') {
    throw new Error(data.Error ?? 'OMDb could not find matching movies.')
  }

  return data.Search ?? []
}
