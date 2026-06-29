import React from "react";
import { NavLink } from "react-router-dom";

// Contexts
import { useUtil } from "../../../context/state/Util.context";
import { useTMDB } from "../../../context/data/Tmdb.context";

// Components
import Star from "../../svgs/Star";
import BookmarkButton from "../../pages/Home/BookmarkButton";

function RecMovieCard(props) {
  const { movie } = props;
  const { id, poster_path, title, release_date, vote_average } = movie;
  const { parseDate } = useUtil();
  const { getTMDBImageURL } = useTMDB();
  const roundedRating = Math.round(vote_average * 10) / 10;

  return (
    <div className="movie-card center-vertical">
      <div className="movie-card__info-box">
        <object
          data={getTMDBImageURL(poster_path)}
          className="movie-card__img"
          type="image/jpg"
        >
          <div className="movie-card__fallback-img center">
            404 - Image Unavailable
          </div>
        </object>

        <div className="movie-card__info center">
          <h2 className="movie-card__title">{title}</h2>
          <p className="movie-card__date">{parseDate(release_date)}</p>
          <p className="rec-movie-card__rating center">
            <Star />
            {roundedRating}/10
          </p>
          {/* Bookmark */}
          <BookmarkButton movieID={id} />
        </div>
      </div>
      <NavLink to={`/movie/${id}`} className="movie-card__sub-title">
        {title}
      </NavLink>
    </div>
  );
}

export default RecMovieCard;
