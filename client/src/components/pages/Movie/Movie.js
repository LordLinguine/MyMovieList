import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";
import { useUser } from "../../../context/state/User.context";

// Components
import Loading from "../../layout/standalone/Loading";
import ErrorPopup from "../../layout/standalone/ErrorPopup";
import MovieBackground from "../../layout/standalone/MovieBackground";
import MovieDetails from "./MovieDetails";
import MovieCast from "./MovieCast";
import SimilarMovies from "./SimilarMovies";
import MovieRatingPopup from "../../layout/Movies/MovieRatingPopup";

function Movie() {
  const { movieID } = useParams();
  const { getTMDBImageURL } = useTMDB();
  const { getMovieByID } = useTMDB().API;
  const { checkRatedMovies } = useUser();
  const { alreadyRated, movie: userMovieData } = checkRatedMovies(movieID);
  const { isPending, isError, data, error } = useQuery({
    queryKey: [`MOVIE?ID:${movieID}`, movieID],
    queryFn: ({ queryKey }) => getMovieByID(queryKey[1]),
  });

  // Movie Popup
  const [moviePopup, setMoviePopup] = useState({
    show: false,
    movie: null,
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError || !data) {
    return <ErrorPopup message={error.message} />;
  }

  alert("Movie component rendered");
console.log("MOVIE DATA:", data);

  return (
    <div className="movie-page">
      <MovieBackground url={getTMDBImageURL(data.backdrop_path)} />
      <MovieDetails
        data={data}
        setMoviePopup={setMoviePopup}
        alreadyRated={alreadyRated}
        userMovieData={userMovieData}
      />
      <MovieCast data={data} />
      <SimilarMovies data={data} />

      {/* Movie Rating Popup */}
      {moviePopup.show && (
        <MovieRatingPopup
          movie={moviePopup.movie}
          setMoviePopup={setMoviePopup}
          isEditPopup={alreadyRated}
        />
      )}
    </div>
  );
}

export default Movie;
