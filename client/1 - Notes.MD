/*
===============================================================================
MYMOVIELIST PROJECT STUDY GUIDE
===============================================================================

GOAL:
-----
This document is meant to help me understand the architecture of this React
project from a high level before worrying about individual lines of code.

The goal is NOT to memorize code.

The goal IS to understand:

1. How the application is structured
2. How data flows through the application
3. Why Context exists
4. Why State exists
5. How pages, components, and APIs work together
6. How I would build this project from scratch

===============================================================================
SECTION 1: WHAT IS REACT?
===============================================================================

React is a library for building user interfaces.

A React application is made up of COMPONENTS.

Examples from this project:

- Navbar
- MovieCard
- SearchBar
- BookmarkButton
- ProfilePicture

Think:

Website = LEGO Set
Component = Individual LEGO Piece

Components can be reused anywhere.

Example:

MovieCard may appear on:
- Home page
- Search page
- Trending page
- Bookmarked page

The same component can be reused many times.

===============================================================================
SECTION 2: PAGES VS COMPONENTS
===============================================================================

A PAGE is usually a larger component.

Examples:

Pages:
- Home
- Search
- Movie
- Login
- Signup
- Settings
- Bookmarked

Components:
- Navbar
- MovieCard
- BookmarkButton
- SearchBar
- ProfilePicture

Think:

Page:
    Complete screen

Component:
    Piece of a screen

Example:

Home Page
|
|-- Navbar
|-- MovieCard
|-- MovieCard
|-- MovieCard
|-- Footer

===============================================================================
SECTION 3: PROJECT STRUCTURE
===============================================================================

Common folders in this project:

components/
    Reusable UI pieces

pages/
    Full screens

layout/
    Navbar, loading screens, wrappers

svgs/
    SVG icon components

context/
    Global state and shared functionality

styles/
    CSS

schemas/
    Data validation / object definitions

===============================================================================
SECTION 4: HOW THE APP STARTS
===============================================================================

index.js is the entry point.

Flow:

React Starts
    ↓
BrowserRouter
    ↓
React Query
    ↓
Context Providers
    ↓
App.js
    ↓
Pages
    ↓
Components

Simplified:

index.js
    ↓
App.js
    ↓
Everything Else

===============================================================================
SECTION 5: APP.JS
===============================================================================

App.js is the traffic controller.

Responsibilities:

1. Render Navbar

2. Define routes

Examples:

/                   → Home
/search             → Search
/movie/:movieID     → Movie
/login              → Login
/signup             → Signup
/settings           → Settings

3. Protect routes

Example:

Only authenticated users can access:

- Recommendations
- Movie List
- Bookmarked
- Settings

App.js decides which page should appear.

===============================================================================
SECTION 6: REACT ROUTER
===============================================================================

React Router enables:

/search
/movie/123
/settings

Important pieces:

<Routes>
<Route>
<NavLink>

Hooks:

useLocation()
useNavigate()

Example:

const { pathname } = useLocation();

Gets current URL.

Example:

navigate("/login");

Moves user to login page.

===============================================================================
SECTION 7: STATE
===============================================================================

State = Data that changes over time.

Example:

const [openDropdown, setOpenDropdown] = useState(false);

Initial:

openDropdown = false

User clicks profile:

openDropdown = true

React notices state changed.

React re-renders UI.

Important:

State is NOT the UI.

State is DATA.

UI changes because data changed.

Examples of state:

- Dropdown open?
- User logged in?
- Loading spinner visible?
- Movies loaded?

===============================================================================
SECTION 8: CONTEXT
===============================================================================

This was the hardest concept.

Without Context:

App
 ↓
Home
 ↓
Navbar

Need to pass props:

<Navbar isAuth={isAuth} />

This becomes annoying.

This is called PROP DRILLING.

Context solves this.

Context = Global State

Think:

Shared storage box.

Any component can access it.

Example:

const { isAuth } = useAuth();

Navbar can get auth information directly.

No props needed.

Simple definition:

Context allows many components to access shared data without passing
props through every level.

===============================================================================
SECTION 9: CONTEXTPROVIDER
===============================================================================

ContextProvider wraps the entire application.

Structure:

GlobalContextProvider
|
|-- UtilContextProvider
    |
    |-- APIContextProvider
        |
        |-- AuthContextProvider
            |
            |-- UserContextProvider
                |
                |-- FirebaseContextProvider
                    |
                    |-- TMDBContextProvider
                        |
                        |-- App

Everything inside App can access these contexts.

===============================================================================
SECTION 10: AUTH CONTEXT
===============================================================================

Purpose:

Store authentication information.

State:

{
    isAuth,
    accessToken,
    uid
}

Functions:

authenticateUser()

logoutUser()

Usage:

const { isAuth } = useAuth().authState;

When login succeeds:

authenticateUser(token, uid)

State becomes:

{
    isAuth: true,
    accessToken,
    uid
}

React re-renders.

Navbar updates automatically.

===============================================================================
SECTION 11: WHY USEAUTH() WORKS
===============================================================================

Navbar does NOT receive:

<Navbar isAuth={isAuth} />

Instead:

const { isAuth } = useAuth().authState;

Why?

Because:

AuthContextProvider
        ↓
       App
        ↓
     Navbar

Navbar is inside AuthContextProvider.

AuthContext broadcasts data.

Navbar listens to it.

===============================================================================
SECTION 12: NAVBAR FLOW
===============================================================================

Navbar reads:

useAuth()
useUser()
useFirebase()

Examples:

isAuth
username
email

If:

isAuth === false

Show:

"Log In"

If:

isAuth === true

Show:

Profile Picture

Dropdown can be opened using local state:

openDropdown

===============================================================================
SECTION 13: MOVIECARD FLOW
===============================================================================

MovieCard receives:

movie

as a prop.

Example:

<MovieCard movie={movie} />

MovieCard displays:

- Poster
- Title
- Release Date
- Rating
- Bookmark Button

MovieCard itself does NOT fetch movies.

Parent component fetches data.

MovieCard only displays data.

Important React principle:

Parent owns data.
Child displays data.

===============================================================================
SECTION 14: CSS
===============================================================================

JSX defines structure.

CSS defines appearance.

Example:

<div className="movie-card">

React creates HTML.

CSS controls:

- Position
- Colors
- Size
- Hover effects
- Animations

Example:

.movie-card__info .hero__bookmark {
    position: absolute;
    top: 1vh;
    right: 0;
}

This places bookmark button:

Top Right Corner

Reason:

top: 1vh
right: 0

===============================================================================
SECTION 15: TMDB
===============================================================================

TMDB provides:

- Movies
- Posters
- Genres
- Descriptions
- Trending
- Top Rated
- Upcoming

Likely handled through:

TMDBContext

Examples:

getTMDBImageURL()

Movie pages likely fetch:

Movie Details

Search page likely fetches:

Search Results

===============================================================================
SECTION 16: FIREBASE
===============================================================================

Firebase likely handles:

- Login
- Signup
- Logout
- User Data

Examples:

Bookmarks
Ratings
Movie Lists

Firebase stores user-specific information.

TMDB stores movie information.

===============================================================================
SECTION 17: REACT QUERY
===============================================================================

React Query helps manage API requests.

Benefits:

- Caching
- Loading states
- Refetching
- Error handling

Instead of manually managing many fetches.

Configured in index.js.

===============================================================================
SECTION 18: HOW THIS PROJECT WAS PROBABLY BUILT
===============================================================================

Not:

Build entire architecture at once.

More likely:

Step 1:
Create Home Page

Step 2:
Connect TMDB

Step 3:
Display movie titles

Step 4:
Create MovieCard

Step 5:
Add routing

Step 6:
Add Movie Details Page

Step 7:
Add Search

Step 8:
Add Login

Step 9:
Add Bookmarks

Step 10:
Add Ratings

Step 11:
Introduce Context when prop drilling became annoying

Important lesson:

Context was probably NOT the starting point.

Context was a solution to a problem.

===============================================================================
SECTION 19: HOW TO LEARN THIS PROJECT
===============================================================================

DO NOT memorize files.

For every file ask:

1. Is this a page or component?

2. Does it have state?

3. Does it use context?

4. Does it fetch data?

5. Which CSS classes affect it?

6. What problem is this code solving?

===============================================================================
SECTION 20: RECOMMENDED LEARNING PATH
===============================================================================

Focus on understanding:

1. Components
2. Props
3. State
4. Routing
5. API Calls
6. Context
7. Firebase
8. React Query

Not:

Trying to understand entire project at once.

===============================================================================
SECTION 21: THE MOST IMPORTANT THING
===============================================================================

If I had to rebuild this project from scratch:

1. Create pages
2. Set up routing
3. Connect TMDB
4. Display movie data
5. Create reusable MovieCard
6. Create Movie Details page
7. Add Search
8. Add Authentication
9. Add User Features
10. Add Context when shared state becomes difficult

React is not about memorizing syntax.

React is about:

Data
    ↓
State
    ↓
UI

The entire application is ultimately just:

Fetch Data
    ↓
Store Data
    ↓
Display Data
    ↓
Respond To User Actions

Everything else is layers on top of that idea.

===============================================================================
END NOTES
===============================================================================

Things I currently understand:

✓ Components
✓ Pages
✓ Routing
✓ State
✓ Basic Context
✓ Auth Context
✓ App.js
✓ index.js
✓ Navbar structure
✓ MovieCard structure

Next areas to study:

- User.context.js
- Firebase.context.js
- TMDBContext
- Home page data flow
- Login flow
- Bookmark flow
- Rating flow

===============================================================================
*/















==============================================================================================================================
/*
===============================================================================
REACT STUDY GUIDE - MY MOVIE APP
===============================================================================

GOAL:
Be able to open a React project and understand:
- Where pages come from
- Where data comes from
- How components communicate
- How routing works
- How authentication works
- How Context works
- How APIs work
- How to add features myself

===============================================================================
1. WHAT IS A COMPONENT?
===============================================================================

Question:
What is a component?

Answer:
A component is a reusable piece of UI.

Examples:

Navbar
MovieCard
MovieBackground
Login
MovieDetails
SearchBar

Examples in my project:

<Navbar />
<MovieCard />
<MovieBackground />
<SearchBar />

A page is usually just a large component.

Examples:

Home.jsx
Login.jsx
Movie.jsx

These pages are made up of smaller components.

Example:

Movie Page

<Movie />
    |
    +-- <MovieBackground />
    +-- <MovieDetails />
    +-- <MovieCast />
    +-- <SimilarMovies />

Think:

HTML = bricks

Components = LEGO pieces made from bricks

Pages = structures built from LEGO pieces

===============================================================================
2. WHAT ARE PROPS?
===============================================================================

Question:
What are props?

Answer:
Props are information passed FROM a parent component TO a child component.

Example:

<MovieBackground url="image.jpg" />

The parent passes:

url="image.jpg"

The child receives:

function MovieBackground(props) {
    console.log(props.url);
}

props.url = "image.jpg"

Think:

Parent = gives information

Child = receives information

Example from project:

<MovieDetails data={data} />

MovieDetails receives:

props.data

Question:
When should I use props?

Answer:
Whenever one component needs to give information to another.

===============================================================================
3. WHAT IS STATE?
===============================================================================

Question:
What is state?

Answer:
State is memory owned by a component.

Example:

const [openDropdown, setOpenDropdown] = useState(false);

Current state:

openDropdown = false

User clicks profile picture:

setOpenDropdown(true)

New state:

openDropdown = true

React sees the change and updates the screen.

Question:
When should I use state?

Answer:
When something changes while the app is running.

Examples:

Dropdown open/closed
Search text
Selected movie
Popup visible
Loading status

Rule:

Props = received

State = owned

===============================================================================
4. WHAT IS CONTEXT?
===============================================================================

Question:
What is Context?

Answer:
Context is global state.

Without Context:

App
 |
 +-- Page
      |
      +-- Layout
             |
             +-- Navbar

To get isAuth into Navbar:

<App isAuth={isAuth}>
<Page isAuth={isAuth}>
<Layout isAuth={isAuth}>
<Navbar isAuth={isAuth}>

This is called:

PROP DRILLING

Context avoids this.

Navbar can directly ask:

const { isAuth } = useAuth().authState;

Question:
Why doesn't Navbar need an isAuth prop?

Answer:
Because it gets the value from AuthContext.

===============================================================================
5. WHAT IS useAuth()?
===============================================================================

Question:
How does useAuth() work?

Answer:

Auth.context.js creates:

const AuthContext = createContext();

Provider:

<AuthContext.Provider value={...}>
    {children}
</AuthContext.Provider>

Custom hook:

export const useAuth = () => useContext(AuthContext);

Now any component can do:

const { isAuth } = useAuth().authState;

and access auth information.

===============================================================================
6. WHAT IS A PROVIDER?
===============================================================================

Question:
What is a Provider?

Answer:
A Provider wraps components and shares data with them.

Example:

<AuthContextProvider>
    <App />
</AuthContextProvider>

Everything inside App can access AuthContext.

My project has:

GlobalContextProvider
UtilContextProvider
APIContextProvider
AuthContextProvider
UserContextProvider
FirebaseContextProvider
TMDBContextProvider

===============================================================================
7. WHAT IS ROUTING?
===============================================================================

Question:
How does routing work?

Answer:

App.js contains:

<Route path="/movie/:movieID" element={<Movie />} />

The colon means:

movieID is a variable.

Examples:

/movie/603
/movie/550
/movie/123

React Router extracts the value.

===============================================================================
8. WHERE DOES movieID COME FROM?
===============================================================================

Question:
Where does movieID come from?

Answer:

const { movieID } = useParams();

If URL is:

/movie/603

Then:

movieID = "603"

If URL is:

/movie/550

Then:

movieID = "550"

It comes from the browser URL.

===============================================================================
9. HOW DOES A MOVIE GET FROM TMDB TO THE SCREEN?
===============================================================================

Step 1

User visits:

/movie/603

Step 2

Movie component loads.

Step 3

useParams() gets:

movieID = "603"

Step 4

React Query runs:

getMovieByID(movieID)

Step 5

TMDB API returns:

{
    id: 603,
    title: "The Matrix",
    backdrop_path: "...",
    overview: "..."
}

Step 6

Movie.jsx receives:

data

Step 7

Movie.jsx passes data to child components.

<MovieBackground url={...} />
<MovieDetails data={data} />

Step 8

Children render information.

Screen updates.

===============================================================================
10. WHAT IS REACT QUERY?
===============================================================================

Question:
Why use React Query?

Answer:

Instead of:

useEffect()
fetch()
loading state
error state

React Query handles:

Loading
Caching
Errors
Refetching

Example:

const { data, isPending, isError } = useQuery(...)

===============================================================================
11. WHAT IS useEffect()?
===============================================================================

Question:
What is useEffect()?

Answer:

Runs code after rendering.

Example:

useEffect(() => {
    console.log("Page loaded");
}, []);

Runs once.

Example:

useEffect(() => {
    console.log("Path changed");
}, [pathname]);

Runs whenever pathname changes.

===============================================================================
12. HOW DO I TRACE SOMETHING ON SCREEN?
===============================================================================

Question:
How do I find where something comes from?

Answer:

Example:

I see an image.

Find:

1. Component rendering it
2. Props passed into it
3. Parent component
4. Parent component
5. Data source

Example from project:

<MovieBackground />
        ^
        |
Movie.jsx
        ^
        |
TMDB API

This process is called tracing data flow.

===============================================================================
13. WHAT IS JSX?
===============================================================================

Question:
What is JSX?

Answer:

Looks like HTML.

Actually JavaScript.

Example:

return (
    <div>
        Hello
    </div>
);

React converts JSX into JavaScript.

===============================================================================
14. HOW DO I DEBUG?
===============================================================================

Question:
How do I see what's happening?

Answer:

Use:

console.log()

Examples:

console.log(props);

console.log(data);

console.log(movieID);

console.log(isAuth);

When confused:

LOG IT.

===============================================================================
15. QUESTIONS I SHOULD BE ABLE TO ANSWER WITHOUT HELP
===============================================================================

Can I explain:

- What is a component?
- What is a prop?
- What is state?
- What is Context?
- What is a Provider?
- What is useEffect?
- What is useState?
- What is useParams?
- What is React Query?
- What is a route?
- How does a movie get from TMDB to the screen?
- Why doesn't Navbar need isAuth as a prop?
- Where does movieID come from?
- How do I trace data through the app?
- How do I find where a UI element is rendered?
- How do I find where a prop originates?
- How do I use DevTools?
- How do I use console.log to debug?

If I can answer most of these comfortably,
I understand React far better than when I started.
===============================================================================
*/