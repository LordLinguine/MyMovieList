import React from "react";
import { NavLink } from "react-router-dom";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";
import { useUtil } from "../../../context/state/Util.context";
import { useAPI } from "../../../context/data/API.context";
import { useAuth } from "../../../context/auth/Auth.context";
import { useGlobal } from "../../../context/state/Global.context";
import { useUser } from "../../../context/state/User.context";

// Components
import Star from "../../svgs/Star";
import BookmarkButton from "../Home/BookmarkButton";

function RatedMovieCard(props) {
  const { movie, rating, setMoviePopup } = props;
  const { id, poster_path, title, release_date } = movie;
  const { getTMDBImageURL } = useTMDB();
  const { parseDate } = useUtil();
  const { deleteMovieFromList } = useAPI().movie;
  const { authState } = useAuth();
  const { setLoading } = useGlobal().state;
  const { updateRatedMovies } = useUser();

  // Delete Movie Handler
  const deleteMovieHandler = async () => {
    setLoading(true);
    await deleteMovieFromList(authState, id, (res, APIError) => {
      if (APIError) return console.log(APIError);

      // Update User Context
      const { ratedMovies: updatedRatedMovies } = res.data.user;
      updateRatedMovies(updatedRatedMovies);

      // Reset
      setLoading(false);
    });
  };

  return (
    <div className="rated-card movie-card center-vertical">
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
          <button
            type="button"
            className="movie-card__edit"
            onClick={() =>
              setMoviePopup({
                show: true,
                movie: { ...movie, rating },
              })
            }
          >
            Edit
          </button>
          <button
            type="button"
            className="movie-card__delete"
            onClick={async () => await deleteMovieHandler()}
          >
            Delete
          </button>

          {/* Bookmark */}
          <BookmarkButton movieID={id} />
        </div>
      </div>
      <NavLink to={`/movie/${id}`} className="movie-card__sub-title">
        {title}
      </NavLink>
      <p className="movie-card__rating center">
        <Star />
        {rating}/10
      </p>
    </div>
  );
}

export default RatedMovieCard;
