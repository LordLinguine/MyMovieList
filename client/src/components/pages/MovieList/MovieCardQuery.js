import React from "react";
import { useQuery } from "@tanstack/react-query";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";

// Components
import Loading from "../../layout/standalone/Loading";
import ErrorPopup from "../../layout/standalone/ErrorPopup";
import RatedMovieCard from "./RatedMovieCard";
import MovieCard from "../../layout/Movies/MovieCard";

function MovieCardQuery(props) {
  const { movieID, rating, setMoviePopup, isBookmark } = props;
  const { getMovieByID } = useTMDB().API;
  const { isPending, isError, data, error } = useQuery({
    queryKey: [`MOVIE?ID:${movieID}`, movieID],
    queryFn: ({ queryKey }) => getMovieByID(queryKey[1]),
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError || !data) {
    return <ErrorPopup message={error.message} />;
  }

  if (isBookmark) {
    return (
      <MovieCard movie={data} setMoviePopup={setMoviePopup} isBookmark={true} />
    );
  } else {
    return (
      <RatedMovieCard
        movie={data}
        rating={rating}
        setMoviePopup={setMoviePopup}
      />
    );
  }
}

export default MovieCardQuery;
