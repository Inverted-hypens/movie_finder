import { searchMovies } from '../../services/omdbMovieService'
import type { Movie } from '../../types/movie'

const INITIAL_SEARCH_KEYWORDS = [
	'Batman',
	'Avengers',
	'Harry Potter',
	'Star Wars',
	'Spider-Man',
	'Marvel',
	'Disney',
	'Matrix',
	'Lord of the Rings',
	'Fast',
	'Mission Impossible',
	'Pixar',
	'Horror',
	'Comedy',
	'Action',
]

function shuffle<T>(items: T[]): T[] {
	const shuffled = [...items]

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(Math.random() * (index + 1))
		;[shuffled[index], shuffled[randomIndex]] = [
			shuffled[randomIndex],
			shuffled[index],
		]
	}

	return shuffled
}

export async function initialMovies(): Promise<Movie[]> {
	const results = await Promise.all(
		shuffle(INITIAL_SEARCH_KEYWORDS).map((keyword) => searchMovies(keyword)),
	)
	const uniqueMovies = Array.from(
		new Map(results.flat().map((movie) => [movie.imdbID, movie])).values(),
	)

	if (uniqueMovies.length < 20) {
		throw new Error('Unable to load at least 20 initial movies.')
	}

	return shuffle(uniqueMovies).slice(0, 20)
}

export async function getMovies(query: string): Promise<Movie[]> {
	const cleanedQuery = query.trim()

	if (cleanedQuery.length < 2) {
		throw new Error('Search query must be at least two characters.')
	}

	return searchMovies(cleanedQuery)
}
