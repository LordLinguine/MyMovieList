import React from "react";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";

// Components
import MovieList from "../../layout/Movies/MoviesList";

function TrendingMovies() {
  const { getTrendingMovies } = useTMDB().API;

  return (
    <MovieList
      APIFunction={(page) => getTrendingMovies(page)}
      title="Trending Movies"
      queryName="TRENDING_MOVIES"
    />
  );
}

export default TrendingMovies;
