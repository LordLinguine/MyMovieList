import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";
import { useUtil } from "../../../context/state/Util.context";

// Components
import Star from "../../svgs/Star";

function SimilarMovies(props) {
  const { data } = props;
  const navigate = useNavigate();
  const { sortMovies } = useUtil();
  const { getTMDBImageURL } = useTMDB();
  const similarMovies = sortMovies(data?.recommendations?.results).slice(0, 10);

  return (
    <div className="similar-movies">
      <h2 className="similar-movies__title">Similar Movies</h2>
      <div className="row">
        {similarMovies.map((movie) => {
          const { id, backdrop_path, title, vote_average } = movie;
          const roundedRating = Math.round(vote_average * 10) / 10;

          return (
            <div
              key={id}
              className="similar-movies__movie center-vertical"
              onClick={() => navigate(`/movie/${id}`)}
            >
              <img
                src={getTMDBImageURL(backdrop_path)}
                className="similar-movies__img"
                alt={title}
              />
              <NavLink
                to={`/movie/${id}`}
                className="similar-movies__movie-title"
              >
                {title}
              </NavLink>

              {/* Hover Content */}
              <div className="similar-movies__rating center">
                <Star />
                {roundedRating}/10
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SimilarMovies;
