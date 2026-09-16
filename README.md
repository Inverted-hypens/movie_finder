# Movie Finder

A React and TypeScript movie search application built with Vite. It uses the OMDb API for movie searches and Firebase Authentication and Cloud Firestore for user accounts and favourites.

**Live app:** _https://mooveefinder.netlify.app/_

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

## How AI Assisted

I built this app almost entirely through prompts to GitHub Copilot (in VS Code), following a structured, incremental sequence rather than asking for the whole app in one go — one small, scoped prompt per feature (project setup, then the Header, then each screen's Model/ViewModel/View layer, then Firebase auth and favourites, then styling), running lint and build checks after nearly every step. This kept each change small enough to actually review before building the next thing on top of it.

AI handled the bulk of the implementation work: scaffolding the project, writing the OMDb API service and TypeScript types, building each screen's MVVM logic, wiring up Firebase Authentication and Firestore, and styling the UI. But it also did more than generate code on request — several times it diagnosed its own problems mid-task: it recognized a broken local `firebase` package install and (imperfectly, see below) tried to patch around it, it caught a React Fast Refresh lint violation and restructured files to fix it, and it flagged a Windows-specific filename collision and renamed a file to resolve it, all without me having to point out the underlying cause first.

Where I made the calls: deciding the overall architecture (I intentionally kept Cloud Firestore instead of switching to Realtime Database, since Firestore is the better default and there was no code already invested in the other choice), deciding what to build in what order, writing prompts that consolidated several of the original tutorial's smaller steps into single, more complete prompts, and reviewing every result before moving on rather than assuming a passing build meant the feature actually worked. A recurring lesson from this project: a clean `npm run lint` and `npm run build` say nothing about runtime behavior — several real bugs (a blank Favourites page, a favourite button that silently did nothing) only showed up when I actually used the app and checked the browser console and network tab myself.

## Manual Corrections, Debugging, and Refactoring

**1. Diagnosed a corrupted package install instead of accepting AI's workaround.**
After asking Copilot to set up Firebase, the build failed with missing TypeScript declarations for the `firebase` package. Rather than reinstalling the package, Copilot wrote a custom hand-rolled `.d.ts` declaration file to work around the missing types. I recognized this as patching a symptom rather than fixing the actual problem — a properly published SDK shouldn't need a developer-authored type shim — and instead did a clean reinstall (`rm -rf node_modules package-lock.json`, `npm cache clean --force`, `npm install`). Afterward, I deleted the custom declaration file entirely and reran the build: it passed clean with zero type errors, confirming the original issue was a corrupted install, not a real gap in Firebase's SDK.

**2. Caught a genuine gap in my own prompt sequence.**
The Favourites page rendered completely blank even after Firestore was confirmed to be saving data correctly. Tracing it back, I found the cause wasn't a bug in generated code at all — I had prompted Copilot to implement `FavouritesModel.ts`, but never actually wrote the follow-up prompt to implement the `useFavouritesViewModel` hook or the `FavouritesView` component that would consume it. They were still empty placeholder files from an earlier scaffolding step. This wasn't AI making a mistake — it was a step I forgot to ask for, and I only found it by actually testing the page instead of assuming the feature was complete because related pieces had been built.

**3. Isolated two independent, stacked root causes behind one symptom.**
The Favourite (heart) button appeared to do nothing when clicked while logged in. Rather than assume a single cause, I checked the browser console and network tab and found two separate problems layered on top of each other: my browser's built-in tracking-prevention feature was silently blocking Firestore's real-time connection requests, *and*, independently, I had never actually clicked "Create database" in the Firebase console — the Firestore database itself didn't exist yet, even though the project did. Fixing only one of these wouldn't have solved the symptom; I had to identify and resolve both.

**4. Reviewed and approved a security prompt rather than blindly clicking through it.**
When reinstalling packages, npm flagged two dependencies (`@firebase/util` and `protobufjs`) as having install scripts pending review, as part of npm's newer script-approval security feature. Instead of automatically approving everything, I checked what each package actually was — confirming both are legitimate, expected dependencies of the official Firebase SDK — before approving them.

**5. Traced several "it's broken" symptoms to configuration/environment causes, not code.**
A handful of issues that looked like code bugs at first turned out to be missing setup steps that had nothing to do with the generated code:
- OMDb API calls returning 401 — traced to an unsaved `.env` file, not a code error.
- Firebase throwing `auth/configuration-not-found` — traced to Authentication never being explicitly enabled in the Firebase console (a separate step from creating the project).
- A runtime `SyntaxError` about a missing export, right after a file-rename refactor — traced to Vite's dev-server cache still holding a stale reference to the old file, not a broken import; fixed by clearing `node_modules/.vite` and restarting.

In each case, I resisted the urge to start rewriting code and instead checked configuration and environment first — since the actual error messages pointed there once I read them carefully rather than assuming AI-generated code was automatically the point of failure.

**6. Made deliberate architecture choices that diverged from the reference implementation.**
The session I was following as a model used Firebase Realtime Database for favourites; I chose to use Cloud Firestore instead, since it's the more actively recommended, better-querying option for new projects, and nothing about this app's data needs called for Realtime Database's specific strengths. I also consolidated several of the reference implementation's split, incremental prompts (e.g., building the OMDb service in two separate steps) into single, more complete prompts, since the split only existed for a live teaching demo and wasn't necessary once I understood the pattern.