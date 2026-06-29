import React, { useState } from "react";

// Contexts
import { useUser } from "../../../context/state/User.context";

// Components
import MovieCardQuery from "../MovieList/MovieCardQuery";
import MovieRatingPopup from "../../layout/Movies/MovieRatingPopup";
import Show from "../../svgs/Show";
import Hide from "../../svgs/Hide";

function BookmarkQuery() {
  const {
    user: { bookmarked },
    checkRatedMovies,
  } = useUser();

  // Movie Popup
  const [moviePopup, setMoviePopup] = useState({
    show: false,
    movie: null,
  });

  // Show Rated Movies
  const [showRatedMovies, setShowRatedMovies] = useState(false);
  const toggleShowRatedMovies = () => setShowRatedMovies((oldVal) => !oldVal);

  // Sorted Bookmarked Movies
  const sortedBookmarkedMovies = bookmarked.filter(
    (movie) => !checkRatedMovies(movie.movieID).alreadyRated
  );
  const bookmarkedMovies = showRatedMovies
    ? bookmarked
    : sortedBookmarkedMovies;
  return (
    <div className="list-page bookmark-page">
      <div className="row bookmark-page__header">
        <h1 className="list-page__title">
          Your <span>Bookmarked</span> Movies
        </h1>
        {showRatedMovies ? (
          <button
            type="button"
            className="bookmark-page__btn row"
            onClick={toggleShowRatedMovies}
          >
            <Hide /> Hide Already Watched
          </button>
        ) : (
          <button
            type="button"
            className="bookmark-page__btn row"
            onClick={toggleShowRatedMovies}
          >
            <Show /> Show Already Watched
          </button>
        )}
      </div>

      {/* Bookmarked Movies */}
      <div className="movies-container">
        {bookmarkedMovies.map((movie) => {
          const { movieID } = movie;

          return (
            <MovieCardQuery
              key={movieID}
              movieID={movieID}
              setMoviePopup={setMoviePopup}
              isBookmark={true}
            />
          );
        })}
      </div>

      {/* Movie Rating Popup */}
      {moviePopup.show && (
        <MovieRatingPopup
          movie={moviePopup.movie}
          setMoviePopup={setMoviePopup}
        />
      )}
    </div>
  );
}

export default BookmarkQuery;
