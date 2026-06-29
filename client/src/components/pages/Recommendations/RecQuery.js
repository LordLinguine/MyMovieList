import React, { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";
import { useUser } from "../../../context/state/User.context";

// Components
import Loading from "../../layout/standalone/Loading";
import ErrorPopup from "../../layout/standalone/ErrorPopup";
import Movies from "../../layout/Movies/Movies";
import SearchPageTabs from "../Search/SearchPageTabs";
import MovieRatingPopup from "../../layout/Movies/MovieRatingPopup";

function RecQuery(props) {
  const { genres } = props;
  const {
    API: { getMoviesByGenre },
  } = useTMDB();
  const { checkRatedMovies } = useUser();

  // Convert Genre IDs to String
  let genresStr = genres.map((genre) => genre.id).join(",");

  // Query
  const [page, setPage] = useState(1);
  const { isPending, isError, data, error } = useQuery({
    queryKey: [`GENRES:${genresStr}?PAGE:${page}`, genresStr, page],
    queryFn: ({ queryKey }) => getMoviesByGenre(queryKey[1], queryKey[2]),
    placeholderData: keepPreviousData,
  });

  // Reset Scroll View
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [page]);

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

  // TODO: Filter Out Movies that the User Already Watched
  const filteredMovies = data?.results
    .filter((movie) => {
      return !checkRatedMovies(movie.id).alreadyRated;
    })
    .sort((a, b) => b.vote_average - a.vote_average);
  const totalPages = data?.total_pages;
  return (
    <div className="rec-movies-list">
      <Movies
        setMoviePopup={setMoviePopup}
        movies={filteredMovies}
        isRec={true}
      />
      <SearchPageTabs
        totalPages={totalPages >= 5 ? 5 : totalPages}
        page={page}
        setPage={setPage}
      />

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

export default RecQuery;
