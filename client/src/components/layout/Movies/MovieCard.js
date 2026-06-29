import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Contexts
import { useUtil } from "../../../context/state/Util.context";
import { useTMDB } from "../../../context/data/Tmdb.context";
import { useUser } from "../../../context/state/User.context";
import { useAuth } from "../../../context/auth/Auth.context";

// Components
import CirclePlus from "../../svgs/CirclePlus";
import Star from "../../svgs/Star";
import BookmarkButton from "../../pages/Home/BookmarkButton";

function MovieCard(props) {
  const { movie, setMoviePopup, isBookmark } = props;
  const { id, poster_path, title, release_date } = movie;
  const { parseDate } = useUtil();
  const { isAuth } = useAuth().authState;
  const { getTMDBImageURL } = useTMDB();
  const { checkRatedMovies } = useUser();
  const { alreadyRated, movie: userMovieData } = checkRatedMovies(id);
  const navigate = useNavigate();

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
          {alreadyRated ? (
            <p className="movie-card__rating center">
              <Star />
              {userMovieData.rating}/10
            </p>
          ) : (
            <div className="movie-card__buttons center-vertical">
              <button
                type="button"
                className="movie-card__add"
                onClick={() => {
                  if (isAuth) {
                    if (isBookmark) {
                      const genre_ids = [];
                      movie.genres.map((genre) => genre_ids.push(genre.id));
                      setMoviePopup({
                        show: true,
                        movie: {
                          ...movie,
                          genre_ids,
                        },
                      });
                    } else {
                      setMoviePopup({
                        show: true,
                        movie,
                      });
                    }
                  } else {
                    navigate("/login");
                  }
                }}
              >
                <CirclePlus />
              </button>
            </div>
          )}

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

export default MovieCard;
