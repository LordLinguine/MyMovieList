import React, { createContext, useContext, useState } from "react";

// Contexts
import { useAuth } from "../auth/Auth.context";

// User Context
const UserContext = createContext();
export const useUser = () => useContext(UserContext);
export const UserContextProvider = (props) => {
  const { isAuth } = useAuth().authState;
  const [user, setUser] = useState({
    uid: null,
    username: "",
    email: "",
    ratedMovies: [],
    bookmarked: [],
    profilePicture: [],
  });

  // Update User
  const updateUser = (data) => setUser((oldUser) => ({ ...oldUser, ...data }));

  // Update Rated Movies List
  const updateRatedMovies = (updatedList) =>
    setUser((oldUser) => ({ ...oldUser, ratedMovies: updatedList }));

  // Update Bookmarked List
  const updateBookmarkedList = (updatedList) =>
    setUser((oldUser) => ({ ...oldUser, bookmarked: updatedList }));

  // Update User's Profile Picture
  const updateProfilePicture = (profilePicture) =>
    setUser((oldUser) => ({ ...oldUser, profilePicture }));

  // Update User's Username
  const updateUsername = (username) =>
    setUser((oldUser) => ({ ...oldUser, username }));

  // Check if Rated Movies contains a specific Movie
  const checkRatedMovies = (movieID) => {
    if (!isAuth) return { alreadyRated: false, movie: null };

    // Specific Movie
    const movie = user.ratedMovies.filter(
      (ratedMovie) => ratedMovie.movieID === movieID.toString()
    )[0];

    return movie
      ? {
          alreadyRated: true,
          movie,
        }
      : {
          alreadyRated: false,
          movie: null,
        };
  };

  // Check if Bookmarked List contains a specific Movie
  const checkBookmarked = (movieID) => {
    if (!isAuth) return false;

    // Specific Movie
    const movie = user.bookmarked.filter(
      (ratedMovie) => ratedMovie.movieID === movieID.toString()
    )[0];

    return movie ? true : false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        updateRatedMovies,
        updateProfilePicture,
        checkRatedMovies,
        updateUsername,
        updateBookmarkedList,
        checkBookmarked,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
