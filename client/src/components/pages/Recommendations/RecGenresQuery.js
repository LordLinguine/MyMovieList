import React from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

// Contexts
import { useAuth } from "../../../context/auth/Auth.context";
import { useAPI } from "../../../context/data/API.context";
import { useTMDB } from "../../../context/data/Tmdb.context";

// Components
import Loading from "../../layout/standalone/Loading";
import ErrorPopup from "../../layout/standalone/ErrorPopup";
import RecQuery from "./RecQuery";

function RecGenresQuery() {
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

  if (isPending) {
    return <Loading />;
  }

  if (isError || !data) {
    return <ErrorPopup message={error.message} />;
  }

  const topGenres = data.data.topGenres.map((genreID) => getGenre(genreID));
  return (
    <div className="rec-page">
      <h1 className="rec-page__title">
        Movies For <span>You</span>
      </h1>
      <div className="row">
        {topGenres.map((genre) => {
          const { id, name } = genre;

          return (
            <NavLink key={id} to={`/genre/${id}`} className="rec-page__genre">
              {name}
            </NavLink>
          );
        })}
      </div>

      {/* Movie Recommendations */}
      <RecQuery genres={topGenres} />
    </div>
  );
}

export default RecGenresQuery;
