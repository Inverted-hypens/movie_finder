# Movie Finder

A React and TypeScript movie search application built with Vite. It uses the OMDb API for movie searches and Firebase Authentication and Cloud Firestore for user accounts and favourites.

## Development

```bash
npm install
npm run dev
```

Run checks with:

```bash
npm run lint
npm run build
```

Copy `.env.example` to `.env` and provide the OMDb and Firebase values before using the application.

## Prompts Used

The following user prompts were used to build the application incrementally:

1. **Initial project setup**

   Create a Vite project named `movie_finder` using the `react-ts` template. Install `firebase` and `react-router-dom`, keep Vite's default ESLint setup, add an `.env.example` with OMDb and Firebase placeholders, and ignore `.env`.

2. **Remove Vite demo content**

   Remove all default Vite content, images, styles, and demonstration code. Leave a minimal working React application with an empty `App` component.

3. **Create the Header**

   Create a reusable Header with Home and Favourites navigation links using React Router, a search input, and a Search button. Do not create screens or connect search functionality yet.

4. **Style the Header**

   Add styling to the Header.

5. **Create the screen MVVM structure**

   Create empty MVVM files for Home and Favourites: models, view-model hooks, and views. Add only minimal placeholder exports and no API, Firebase, state, or movie UI.

6. **Implement the OMDb service**

   Create `src/services/omdbMovieService.ts` with `searchMovies(query)`, use `VITE_OMDB_API_KEY`, encode the query, define `Movie` and `OmdbSearchResponse` types, return OMDb search results, and provide readable HTTP/API errors. Do not use React hooks or direct component fetching.

7. **Implement the Home screen MVVM flow**

   Add `getMovies(query)` to HomeModel with trimming and minimum-length validation. Implement Home view-model state, search actions, loading, and errors. Render loading, errors, and movie results from HomeView without adding another search input.

8. **Create MovieCard**

   Create a reusable presentational MovieCard that receives one Movie, displays its poster, title, year, and type, and includes an unconnected Favourite button. Update HomeView to use it.

9. **Create initial movie loading**

   Add `initialMovies()` using the provided movie keywords, parallel `Promise.all` searches, deduplication by `imdbID`, shuffling, and exactly 20 results. Load it once from the Home view-model with `useEffect`.

10. **Connect Header search**

    Lift the Home view-model state into App. Pass query state and search actions to Header, pass results to HomeView, submit searches from the Header, and navigate to Home when searching from another route.

11. **Configure Firebase**

    Create `firebaseService.ts` using the modular Firebase SDK, environment configuration, `getApps`/`initializeApp`, `getFirestore`, and `getAuth`. Export `auth` and `db` without adding login or favourites UI.

12. **Add Firestore favourites service**

    Add `addFavourite`, `removeFavourite`, and `getFavourites` using `users/{userId}/favourites`, with `imdbID` as the document ID, typed Movie data, and readable errors.

13. **Implement the Favourites model**

    Add thin FavouritesModel wrappers named `loadFavourites`, `saveFavourite`, and `deleteFavourite` around the Firebase service.

14. **Style the movie grid and cards**

    Replace the single-column movie list with a responsive grid. Style MovieCard consistently with the dark Header theme and replace the Favourite text with a heart icon.

15. **Connect Favourite buttons**

    Manage favourite IDs in the Home view-model. Load the signed-in user's favourites and use the FavouritesModel to add or remove movies. Keep MovieCard presentational.

16. **Create authentication service and skeleton**

    Create `authService.ts` with registration, login, logout, and auth-state subscription functions using Firebase Authentication. Add empty AuthModel, useAuthViewModel, and AuthView files.

17. **Implement the Auth screen**

    Add credential validation and normalized email handling to AuthModel. Implement login/register state and actions in the Auth view-model, and create a controlled Login/Create Account form in AuthView.

18. **Create global authentication context**

    Create AuthContext with the current Firebase user, `authLoading`, logout, auth-state subscription cleanup, and an AuthProvider wrapping the application.

19. **Update authentication-aware routing**

    Add `/auth`, keep Home public, protect `/favourites`, redirect authenticated users away from `/auth`, keep Header visible everywhere, and wait for auth initialization before redirecting.

20. **Use real authentication for Home favourites**

    Use `useAuth` in the Home view-model. Redirect signed-out users to `/auth` when they click a Favourite button, and use the signed-in user's UID for Firestore add/remove operations.

21. **Implement the Favourites screen**

    Load the signed-in user's favourites in the Favourites view-model, support removal, and render loading, error, empty, and MovieCard states.

22. **Reuse the movie grid on Favourites**

    Apply HomeView's responsive movie-grid styling to FavouritesView.

23. **Add Logout to Header**

    Show Logout only for signed-in users, call AuthContext logout, and redirect to Home afterward.

24. **Organize shared types**

    Move shared TypeScript types into `src/types`, organized by domain, and update project imports without changing logic.

25. **Style Auth and add conditional Header authentication actions**

    Style the Auth page to match the app's dark theme, including the form card, inputs, submit button, and mode-switch button. Add a Login link to `/auth` when no user is signed in, and show Logout instead when a user is signed in.
