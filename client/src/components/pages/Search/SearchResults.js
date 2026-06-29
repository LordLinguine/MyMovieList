import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";
import { useGlobal } from "../../../context/state/Global.context";

// Components
import Loading from "../../layout/standalone/Loading";
import Movies from "../../layout/Movies/Movies";
import SearchPageTabs from "./SearchPageTabs";
import ErrorPopup from "../../layout/standalone/ErrorPopup";
import MovieRatingPopup from "../../layout/Movies/MovieRatingPopup";

function SearchResults() {
  const { query } = useGlobal().info;
  const { getTrendingMovies, getSearchedMovies } = useTMDB().API;
  const [page, setPage] = useState(1);
  const { isPending, isError, data, error } = useQuery({
    queryKey: query
      ? [`SEARCH?MOVIES:${query}&PAGE:${page}`, query, page]
      : [`TRENDING_MOVIES?PAGE:${page}`, null, page],
    queryFn: ({ queryKey }) => {
      const queryTerm = queryKey[1];
      const pageNum = queryKey[2];
      if (queryTerm) {
        return getSearchedMovies(queryTerm, pageNum);
      } else {
        return getTrendingMovies(pageNum);
      }
    },
    placeholderData: keepPreviousData,
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

  const totalPages = data.total_pages;
  return (
    <div className="search-results">
      <h1 className="search-results__title">
        {query ? `Results for "${query}"` : "Trending Movies"}
      </h1>
      <Movies setMoviePopup={setMoviePopup} movies={data.results} />
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

export default SearchResults;
