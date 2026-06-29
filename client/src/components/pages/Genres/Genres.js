import React from "react";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";
import { NavLink } from "react-router-dom";

function Genres() {
  const { getGenres } = useTMDB();
  const genres = getGenres();

  return (
    <div className="genres-page">
      <h1 className="genres-page__title">Movie Genres</h1>
      <div className="genres-page__genres row">
        {genres.map((genre) => {
          const { id, name } = genre;

          return (
            <NavLink key={id} to={`/genre/${id}`} className="genres-page__link">
              {name}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default Genres;
