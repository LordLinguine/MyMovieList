import React from "react";

// Contexts
import { useUser } from "../../../context/state/User.context";

// Components
import MovieListQuery from "./MovieListQuery";
import EmptyListMessage from "../../layout/Movies/EmptyListMessage";

function MovieList() {
  const {
    user: { ratedMovies },
  } = useUser();

  if (ratedMovies.length >= 1) {
    return <MovieListQuery />;
  } else {
    return (
      <div className="list-page">
        <h1 className="list-page__title">
          Your <span>Rated</span> Movies
        </h1>

        <EmptyListMessage />
      </div>
    );
  }
}

export default MovieList;
