import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";

// Components
import Loading from "../../layout/standalone/Loading";
import ErrorPopup from "../../layout/standalone/ErrorPopup";
import Movies from "../../layout/Movies/Movies";
import SearchPageTabs from "../Search/SearchPageTabs";
import MovieRatingPopup from "../../layout/Movies/MovieRatingPopup";

function MoviesByGenre() {
  const { genreID } = useParams();
  const {
    API: { getMoviesByGenre },
    getGenre,
  } = useTMDB();
  const genre = getGenre(genreID);
  const [page, setPage] = useState(1);
  const { isPending, isError, data, error } = useQuery({
    queryKey: [`${genreID}?PAGE:${page}`, genreID, page],
    queryFn: ({ queryKey }) => getMoviesByGenre(queryKey[1], queryKey[2]),
    placeholderData: keepPreviousData,
  });

  // Movie Popup
  const [moviePopup, setMoviePopup] = useState({
    show: false,
    movie: null,
  });

  // Reset Scroll View
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [page]);

  if (isPending) {
    return <Loading />;
  }

  if (isError || !data) {
    return <ErrorPopup message={error.message} />;
  }

  const totalPages = data?.total_pages;
  return (
    <div className="movies-page">
      <h1 className="movies-page__title">{genre.name} Movies</h1>
      <Movies setMoviePopup={setMoviePopup} movies={data?.results} />
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

export default MoviesByGenre;
