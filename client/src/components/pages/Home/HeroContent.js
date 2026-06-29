import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";
import { useUtil } from "../../../context/state/Util.context";
import { useAuth } from "../../../context/auth/Auth.context";
import { useUser } from "../../../context/state/User.context";

// Componentss
import CirclePlus from "../../svgs/CirclePlus";
import Star from "../../svgs/Star";
import BookmarkButton from "./BookmarkButton";

function HeroContent(props) {
  const {
    movie: { id, backdrop_path, title, release_date },
    setMoviePopup,
  } = props;
  const navigate = useNavigate();
  const { parseDate } = useUtil();
  const { isAuth } = useAuth().authState;
  const { getTMDBImageURL } = useTMDB();
  const { checkRatedMovies } = useUser();
  const { alreadyRated, movie: userMovieData } = checkRatedMovies(id);

  return (
    <div
      className="hero-content"
      style={{
        backgroundImage: `url(${getTMDBImageURL(backdrop_path)})`,
      }}
    >
      <div className="hero__movie-info row">
        <p className="hero__release-date">
          Now Playing - {parseDate(release_date)}
        </p>
        <h1 className="hero__title">{title}</h1>
        <div className="row">
          <NavLink className="hero__link" to={`/movie/${id}`}>
            More Info
          </NavLink>
          {/* Add To List */}
          {alreadyRated ? (
            <p className="hero__rating row">
              <Star />
              {userMovieData.rating}/10
            </p>
          ) : (
            <button
              type="button"
              className="hero__add row"
              onClick={() => {
                if (isAuth) {
                  setMoviePopup({
                    show: true,
                    movie: props.movie,
                  });
                } else {
                  navigate("/login");
                }
              }}
            >
              <CirclePlus />
              Add to List
            </button>
          )}
          {/* Bookmark */}
          <BookmarkButton movieID={id} showText={true} />
        </div>
      </div>
    </div>
  );
}

export default HeroContent;
