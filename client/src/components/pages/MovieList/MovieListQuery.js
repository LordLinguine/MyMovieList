import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Contexts
import { useUser } from "../../../context/state/User.context";
import { useAPI } from "../../../context/data/API.context";
import { useAuth } from "../../../context/auth/Auth.context";
import { useTMDB } from "../../../context/data/Tmdb.context";

// Components
import MovieCardQuery from "./MovieCardQuery";
import MovieRatingPopup from "../../layout/Movies/MovieRatingPopup";
import Loading from "../../layout/standalone/Loading";
import ErrorPopup from "../../layout/standalone/ErrorPopup";

function MovieListQuery() {
  const {
    user: { ratedMovies },
  } = useUser();
  const sortedRatedMovies = ratedMovies.sort((a, b) => b.rating - a.rating);
  const { getRecommendations } = useAPI().movie;
  const { authState } = useAuth();
  const { getGenre } = useTMDB();
  const { isPending, isError, data, error } = useQuery({
    queryKey: [`USER:${authState.uid}_RECOMMENDATIONS`],
    queryFn: () =>
      getRecommendations(authState, (res, APIError) => {
        if (APIError) throw new Error(APIError);

        return res;
      }),
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

  const topGenres = data.data.topGenres.map((genreID) => getGenre(genreID));
  return (
    <div className="list-page">
      <h1 className="list-page__title">
        Your <span>Rated</span> Movies
      </h1>

      {/* Main Content */}
      <main className="row">
        {/* Movies */}
        <div className="movies-container">
          {sortedRatedMovies.map((movie) => {
            const { movieID, rating } = movie;

            return (
              <MovieCardQuery
                key={movieID}
                movieID={movieID}
                rating={rating}
                setMoviePopup={setMoviePopup}
              />
            );
          })}
        </div>

        {/* Movie List Info */}
        <div className="list-info">
          <h2 className="list-info__title">Your Top 3 Genres</h2>
          <div className="list-info__genres">
            {topGenres.map((genre, index) => {
              const { id, name } = genre;

              return (
                <NavLink to={`/genre/${id}`} className="list-info__genre">
                  {index + 1}. {name}
                </NavLink>
              );
            })}
          </div>
          <NavLink to="/recommendations" className="list-info__rec">
            Generate Recommendations
          </NavLink>
        </div>
      </main>

      {/* Movie Rating Popup */}
      {moviePopup.show && (
        <MovieRatingPopup
          movie={moviePopup.movie}
          setMoviePopup={setMoviePopup}
          isEditPopup={true}
        />
      )}
    </div>
  );
}

export default MovieListQuery;
