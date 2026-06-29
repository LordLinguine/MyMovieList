import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Contexts
import { useGlobal } from "./context/state/Global.context";
import { useAuth } from "./context/auth/Auth.context";

// Components
import Home from "./components/pages/Home/Home";
import Signup from "./components/pages/Signup/Signup";
import Navbar from "./components/layout/Navbar/Navbar";
import Login from "./components/pages/Login/Login";
import Loading from "./components/layout/standalone/Loading";
import Search from "./components/pages/Search/Search";
import Movie from "./components/pages/Movie/Movie";
import TopMovies from "./components/pages/TopMovies/TopMovies";
import TrendingMovies from "./components/pages/TrendingMovies/TrendingMovies";
import UpcomingMovies from "./components/pages/UpcomingMovies/UpcomingMovies";
import Recommendations from "./components/pages/Recommendations/Recommendations";
import MovieList from "./components/pages/MovieList/MovieList";
import MoviesByGenre from "./components/pages/MoviesByGenre/MoviesByGenre";
import Genres from "./components/pages/Genres/Genres";
import Settings from "./components/pages/Settings/Settings";
import BookmarkedList from "./components/pages/Bookmarked/BookmarkedList";
import NotFound from "./components/pages/NotFound/NotFound";

function App() {
  const { pathname } = useLocation();
  const { isLoading } = useGlobal().state;
  const { isAuth } = useAuth().authState;

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/signup")
      localStorage.setItem("lastStoredPage", pathname);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const lastStoredPage = localStorage.getItem("lastStoredPage");
  return (
    <div className="App">
      {/* Navbar */}
      <Navbar />

      {/* Loading */}
      {isLoading && <Loading />}

      {/* Routes */}
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/search" exact element={<Search />} />
        <Route path="/movie/:movieID" exact element={<Movie />} />
        <Route path="/top" exact element={<TopMovies />} />
        <Route path="/trending" exact element={<TrendingMovies />} />
        <Route path="/upcoming" exact element={<UpcomingMovies />} />
        <Route path="/genres" exact element={<Genres />} />
        <Route path="/genre/:genreID" exact element={<MoviesByGenre />} />
        <Route
          path="/recommendations"
          exact
          element={isAuth ? <Recommendations /> : <Login />}
        />
        <Route
          path="/list"
          exact
          element={isAuth ? <MovieList /> : <Login />}
        />
        <Route
          path="/bookmarked"
          exact
          element={isAuth ? <BookmarkedList /> : <Login />}
        />

        {/* User & Auth */}
        <Route
          path="/login"
          exact
          element={
            isAuth ? (
              <Navigate
                to={lastStoredPage ? lastStoredPage : "/list"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          exact
          element={
            isAuth ? (
              <Navigate
                to={lastStoredPage ? lastStoredPage : "/list"}
                replace
              />
            ) : (
              <Signup />
            )
          }
        />
        <Route
          path="/settings"
          exact
          element={isAuth ? <Settings /> : <Navigate to="/login" />}
        />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
