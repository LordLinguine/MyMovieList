import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTransition, animated } from "@react-spring/web";

// Contexts
import { useTMDB } from "../../../context/data/Tmdb.context";
import { useUtil } from "../../../context/state/Util.context";

// Components
import HeroContent from "./HeroContent";
import Loading from "../../layout/standalone/Loading";
import ErrorPopup from "../../layout/standalone/ErrorPopup";
import MovieRatingPopup from "../../layout/Movies/MovieRatingPopup";

function Home() {
  const { sortMovies } = useUtil();
  const { getNowPlayingMovies } = useTMDB().API;
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["NOW_PLAYING_MOVIES"],
    queryFn: getNowPlayingMovies,
  });

  // Movie Popup
  const [moviePopup, setMoviePopup] = useState({
    show: false,
    movie: null,
  });

  // Animation - Image Carousel
  const [movieIndex, setMovieIndex] = useState(0);
  const transitions = useTransition(movieIndex, {
    key: movieIndex,
    from: (_, i) => {
      if (i === 0) {
        return { opacity: 0.9 };
      }

      return { opacity: 0 };
    },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: 0,
    config: { duration: 4000 },
    onRest: (_a, _b, item) => {
      if (movieIndex === item) {
        setMovieIndex((state) => (state + 1) % 10);
      }
    },
    exitBeforeEnter: true,
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError || !data) {
    return <ErrorPopup message={error.message} />;
  }

  const movies = sortMovies(data.results);
  return (
    <div className="home-page">
      {transitions((style, i) => (
        <animated.div style={{ ...style }}>
          <HeroContent setMoviePopup={setMoviePopup} movie={movies[i]} />
        </animated.div>
      ))}

      {/* Movie Rating Popup */}
      {moviePopup.show && (
        <MovieRatingPopup
          movie={moviePopup.movie}
          setMoviePopup={setMoviePopup}
        />
      )}
    </div>
  );
}

export default Home;
