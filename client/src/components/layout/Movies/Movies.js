import React from "react";

// Components
import MovieCard from "./MovieCard";
import RecMovieCard from "./RecMovieCard";

function Movies(props) {
  const { movies, setMoviePopup, isRec } = props;

  return (
    <div className="movies-list">
      {movies.map((movie) => {
        if (isRec) {
          return (
            <RecMovieCard
              key={movie.id}
              movie={movie}
              setMoviePopup={setMoviePopup}
            />
          );
        } else {
          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              setMoviePopup={setMoviePopup}
            />
          );
        }
      })}
    </div>
  );
}

export default Movies;
