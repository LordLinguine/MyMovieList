import React from "react";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";

function MovieCast(props) {
  const { data } = props;
  const { getTMDBImageURL } = useTMDB();
  const cast = data?.credits?.cast.slice(0, 10);

  return (
    <div className="movie-cast">
      <h2 className="movie-cast__title">Cast for {data.title}</h2>
      <div className="row">
        {cast.map((actor) => {
          const { name, character, profile_path } = actor;

          return (
            <div key={name} className="movie-cast__actor">
              <img
                src={getTMDBImageURL(profile_path)}
                className="movie-cast__img"
                alt={name}
              />
              <h3 className="movie-cast__name">{name}</h3>
              <p className="movie-cast__character">{character}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MovieCast;
