import React from "react";

// Contexts
import { useUser } from "../../../context/state/User.context";

// Components
import RecGenresQuery from "./RecGenresQuery";
import EmptyListMessage from "../../layout/Movies/EmptyListMessage";

function Recommendations() {
  const {
    user: { ratedMovies },
  } = useUser();

  if (ratedMovies.length >= 1) {
    return <RecGenresQuery />;
  } else {
    return (
      <div className="rec-page">
        <h1 className="rec-page__title">
          Movies For <span>You</span>
        </h1>

        <EmptyListMessage />
      </div>
    );
  }
}

export default Recommendations;
