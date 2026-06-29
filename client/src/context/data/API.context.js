import React, { createContext, useContext } from "react";
import axios from "axios";

// API Context
const APIContext = createContext();
export const useAPI = () => useContext(APIContext);
export const APIContextProvider = (props) => {
  const { REACT_APP_API_URL } = process.env;

  // Setting Access Token
  const config = (accessToken, headerOptions) => ({
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...headerOptions,
    },
  });

  // ---- User ----

  // Create DB User
  const createDBUser = (uid, data, accessToken, cb) =>
    axios
      .post(REACT_APP_API_URL + `/user/${uid}`, data, config(accessToken))
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  // Get DB User
  const getDBUser = (uid, accessToken, cb) =>
    axios
      .get(REACT_APP_API_URL + `/user/${uid}`, config(accessToken))
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  // Update Profile Picture
  const updateProfilePicture = (uid, accessToken, file, cb) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios
      .post(
        REACT_APP_API_URL + `/user/upload/picture/${uid}`,
        formData,
        config(accessToken, { "Content-Type": "multipart/form-data" })
      )
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));
  };

  const getProfilePictureURL = (uid, accessToken) =>
    axios
      .get(REACT_APP_API_URL + `/user/files/${uid}`, config(accessToken))
      .then((res) => res.data)
      .catch((err) => console.log(err));

  // Update Username
  const updateUsername = (authState, newUsername, cb) =>
    axios
      .patch(
        REACT_APP_API_URL + `/user/${authState.uid}`,
        { username: newUsername },
        config(authState.accessToken)
      )
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  // Delete User
  const deleteDBUser = (uid, accessToken, cb) =>
    axios
      .delete(REACT_APP_API_URL + `/user/${uid}`, config(accessToken))
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  // ---- Movie Lists ----

  // Add Movie to List
  const addMovieToList = (authState, movie, cb) =>
    axios
      .post(
        REACT_APP_API_URL + `/lists/rated/${authState.uid}`,
        movie,
        config(authState.accessToken)
      )
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  // Edit Movie in List
  const editMovieInList = (authState, movie, cb) =>
    axios
      .patch(
        REACT_APP_API_URL + `/lists/rated/${authState.uid}/${movie.movieID}`,
        { rating: movie.rating },
        config(authState.accessToken)
      )
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  // Delete Movie From List
  const deleteMovieFromList = (authState, movieID, cb) =>
    axios
      .delete(
        REACT_APP_API_URL + `/lists/rated/${authState.uid}/${movieID}`,
        config(authState.accessToken)
      )
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  // Get Movie Recommendations
  const getRecommendations = (authState, cb) =>
    axios
      .get(
        REACT_APP_API_URL + `/lists/recommendations/${authState.uid}`,
        config(authState.accessToken)
      )
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  // ---- Bookmarked List ----

  // Add Movie to Bookmarked
  const addMovieToBookmarked = (authState, movieID, cb) =>
    axios
      .post(
        REACT_APP_API_URL + `/lists/bookmark/${authState.uid}`,
        { movieID },
        config(authState.accessToken)
      )
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  // Delete Movie from Bookmarked
  const deleteMovieFromBookmarked = (authState, movieID, cb) =>
    axios
      .delete(
        REACT_APP_API_URL + `/lists/bookmark/${authState.uid}/${movieID}`,
        config(authState.accessToken)
      )
      .then((res) => cb(res, null))
      .catch((err) => cb(null, err));

  return (
    <APIContext.Provider
      value={{
        user: {
          createDBUser,
          getDBUser,
          updateProfilePicture,
          deleteDBUser,
          updateUsername,
          getProfilePictureURL,
        },
        movie: {
          addMovieToList,
          editMovieInList,
          deleteMovieFromList,
          getRecommendations,
        },
        bookmark: {
          addMovieToBookmarked,
          deleteMovieFromBookmarked,
        },
      }}
    >
      {props.children}
    </APIContext.Provider>
  );
};
