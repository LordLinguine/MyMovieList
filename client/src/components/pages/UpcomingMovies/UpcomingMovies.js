import React from "react";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";

// Components
import MovieList from "../../layout/Movies/MoviesList";

function UpcomingMovies() {
  const { getUpcomingMovies } = useTMDB().API;

  return (
    <MovieList
      APIFunction={(page) => getUpcomingMovies(page)}
      title="Upcoming/Airing Movies"
      queryName="UPCOMING_MOVIES"
    />
  );
}

export default UpcomingMovies;
