import React from "react";
import { Formik } from "formik";

// Schemas
import { RatingSchema } from "../../../schemas/Movie.schemas";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";
import { useGlobal } from "../../../context/state/Global.context";
import { useAPI } from "../../../context/data/API.context";
import { useAuth } from "../../../context/auth/Auth.context";
import { useUser } from "../../../context/state/User.context";

function MovieRatingPopup(props) {
  const {
    movie: { id, title, poster_path, genre_ids },
    setMoviePopup,
    isEditPopup,
  } = props;
  const { authState } = useAuth();
  const { getTMDBImageURL } = useTMDB();
  const { setLoading } = useGlobal().state;
  const { addMovieToList, editMovieInList } = useAPI().movie;
  const { updateRatedMovies } = useUser();

  return (
    <div className="movie-popup center">
      <div className="movie-popup__main center-vertical">
        <h1 className="movie-popup__title">
          {isEditPopup ? "Edit Your Rating!" : "Rate this Movie!"}
        </h1>
        <img
          className="movie-popup__poster"
          src={getTMDBImageURL(poster_path)}
          alt={title}
        />
        <p className="movie-popup__movie-title">{title}</p>
        <Formik
          initialValues={{ rating: isEditPopup ? props.movie.rating : 0.0 }}
          validationSchema={RatingSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setLoading(true);

            // If Editing Rating or Adding a New Rating
            if (isEditPopup) {
              editMovieInList(
                authState,
                {
                  movieID: id,
                  rating: values.rating,
                },
                (res, APIError) => {
                  if (APIError) return console.log(APIError);

                  // Update List
                  const { ratedMovies } = res.data.user;
                  updateRatedMovies(ratedMovies);

                  // Reset
                  setMoviePopup({ show: false, movie: null });
                  resetForm();
                  setSubmitting(false);
                  setLoading(false);
                }
              );
            } else {
              addMovieToList(
                authState,
                { movieID: id, rating: values.rating, genres: genre_ids },
                (res, APIError) => {
                  if (APIError) return console.log(APIError);

                  // Update List
                  const { ratedMovies } = res.data.user;
                  updateRatedMovies(ratedMovies);

                  // Reset
                  setMoviePopup({ show: false, movie: null });
                  resetForm();
                  setSubmitting(false);
                  setLoading(false);
                }
              );
            }
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="center-vertical">
              <div className="movie-popup__input-box row">
                <label htmlFor="rating" className="movie-popup__label">
                  {isEditPopup ? "New Rating:" : "Rating:"}
                </label>
                <input
                  className="movie-popup__input"
                  type="number"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.rating}
                  name="rating"
                  placeholder="Ex: 8"
                  autoComplete="off"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>

              <div className="row">
                <button type="submit" className="movie-popup__submit">
                  Save
                </button>
                <button
                  type="button"
                  className="movie-popup__cancel"
                  onClick={() => setMoviePopup({ show: false, movie: null })}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default MovieRatingPopup;
