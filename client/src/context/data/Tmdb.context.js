import React, { createContext, useContext } from "react";
import axios from "axios";

const TMDBContext = createContext();
export const useTMDB = () => useContext(TMDBContext);
export const TMDBContextProvider = (props) => {
  const { REACT_APP_TMDB_ACCESS_TOKEN } = process.env;
  const TMDB_URL = "https://api.themoviedb.org/3";
  const TMDB_IMG_URL = "https://image.tmdb.org/t/p/original";
  const getTMDBImageURL = (path) => TMDB_IMG_URL + path;
  const getTMDBAPIURL = (path, params) =>
    TMDB_URL + path + "?language=en-US" + params;

  // Setting Access Token
  const config = {
    headers: {
      Authorization: `Bearer ${REACT_APP_TMDB_ACCESS_TOKEN}`,
    },
  };

  // Error Handler
  const errorHandler = (error) => {
    const APIMessage = error?.response?.data?.status_message;
    throw new Error(
      APIMessage
        ? APIMessage
        : "Oops, something went wrong! Please try again later."
    );
  };

  // Genres
  const getGenres = () => [
    {
      id: 28,
      name: "Action",
    },
    {
      id: 12,
      name: "Adventure",
    },
    {
      id: 16,
      name: "Animation",
    },
    {
      id: 35,
      name: "Comedy",
    },
    {
      id: 80,
      name: "Crime",
    },
    {
      id: 99,
      name: "Documentary",
    },
    {
      id: 18,
      name: "Drama",
    },
    {
      id: 10751,
      name: "Family",
    },
    {
      id: 14,
      name: "Fantasy",
    },
    {
      id: 36,
      name: "History",
    },
    {
      id: 27,
      name: "Horror",
    },
    {
      id: 10402,
      name: "Music",
    },
    {
      id: 9648,
      name: "Mystery",
    },
    {
      id: 10749,
      name: "Romance",
    },
    {
      id: 878,
      name: "Science Fiction",
    },
    {
      id: 10770,
      name: "TV Movie",
    },
    {
      id: 53,
      name: "Thriller",
    },
    {
      id: 10752,
      name: "War",
    },
    {
      id: 37,
      name: "Western",
    },
  ];

  const getGenre = (genreID) =>
    getGenres().filter((genre) => genre.id.toString() === genreID)[0];

  // GET - Trending Movies
  const getTrendingMovies = (page) =>
    axios
      .get(getTMDBAPIURL("/trending/movie/day", `&page=${page}`), config)
      .then((res) => res.data)
      .catch((error) => errorHandler(error));

  // GET - Top Rated Movies
  const getTopRatedMovies = (page) =>
    axios
      .get(getTMDBAPIURL(`/movie/top_rated`, `S&page=${page}`), config)
      .then((res) => res.data)
      .catch((error) => errorHandler(error));

  // GET - Upcoming Movies
  const getUpcomingMovies = (page) =>
    axios
      .get(getTMDBAPIURL(`/movie/upcoming`, `S&page=${page}`), config)
      .then((res) => res.data)
      .catch((error) => errorHandler(error));

  // GET - Now Playing Movies
  const getNowPlayingMovies = () =>
    axios
      .get(getTMDBAPIURL("/movie/now_playing", ""), config)
      .then((res) => res.data)
      .catch((error) => errorHandler(error));

  // GET - Query Movies
  const getSearchedMovies = (query, page) =>
    axios
      .get(
        getTMDBAPIURL("/search/movie", `&query=${query}&page=${page}`),
        config
      )
      .then((res) => res.data)
      .catch((error) => errorHandler(error));

  // GET - Get Movies for a Specific Genre
  const getMoviesByGenre = (genreID, page) =>
    axios
      .get(
        getTMDBAPIURL(
          "/discover/movie",
          `&with_genres=${genreID}&page=${page}&sort_by=popularity.desc`
        ),
        config
      )
      .then((res) => res.data)
      .catch((error) => errorHandler(error));

  // GET - Movie by ID
  const getMovieByID = (movieID) =>
    axios
      .get(
        getTMDBAPIURL(
          `/movie/${movieID}`,
          "&append_to_response=credits,recommendations"
        ),
        config
      )
      .then((res) => res.data)
      .catch((error) => errorHandler(error));

  return (
    <TMDBContext.Provider
      value={{
        getTMDBImageURL,
        getGenres,
        getGenre,
        API: {
          getTrendingMovies,
          getNowPlayingMovies,
          getSearchedMovies,
          getMovieByID,
          getTopRatedMovies,
          getUpcomingMovies,
          getMoviesByGenre,
        },
      }}
    >
      {props.children}
    </TMDBContext.Provider>
  );
};
