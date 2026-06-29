import React from "react";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";

// Components
import MovieList from "../../layout/Movies/MoviesList";

function TopMovies() {
  const { getTopRatedMovies } = useTMDB().API;

  return (
    <MovieList
      APIFunction={(page) => getTopRatedMovies(page)}
      title="Top Rated Movies"
      queryName="TOP_RATED_MOVIES"
    />
  );
}

export default TopMovies;
