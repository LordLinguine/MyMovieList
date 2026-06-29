import React from "react";
import { useNavigate } from "react-router-dom";

// Contexts
import { useAuth } from "../../../context/auth/Auth.context";
import { useAPI } from "../../../context/data/API.context";
import { useGlobal } from "../../../context/state/Global.context";
import { useUser } from "../../../context/state/User.context";

// Components
import Unbookmark from "../../svgs/Unbookmark";
import Bookmark from "../../svgs/Bookmark";

function BookmarkButton(props) {
  const { movieID, showText } = props;
  const { authState } = useAuth();
  const { setLoading } = useGlobal().state;
  const { addMovieToBookmarked, deleteMovieFromBookmarked } = useAPI().bookmark;
  const { updateBookmarkedList, checkBookmarked } = useUser();
  const navigate = useNavigate();

  // Add Bookmark Handler
  const addBookmarkHandler = async () => {
    setLoading(true);
    await addMovieToBookmarked(authState, movieID, (res, APIError) => {
      if (APIError) return console.log(APIError);

      const { bookmarked } = res.data.user;
      updateBookmarkedList(bookmarked);

      setLoading(false);
    });
  };

  // Delete Bookmark Handler
  const deleteBookmarkHandler = async () => {
    setLoading(true);
    await deleteMovieFromBookmarked(authState, movieID, (res, APIError) => {
      if (APIError) return console.log(APIError);

      const { bookmarked } = res.data.user;
      updateBookmarkedList(bookmarked);

      setLoading(false);
    });
  };

  return (
    <>
      {checkBookmarked(movieID) ? (
        <button
          type="button"
          className="hero__bookmark hero__bookmarked center"
          onClick={async () => {
            if (authState.isAuth) {
              await deleteBookmarkHandler();
            } else {
              navigate("/login");
            }
          }}
        >
          <Bookmark />
          {showText ? "Unbookmark" : ""}
        </button>
      ) : (
        <button
          type="button"
          className="hero__bookmark center"
          onClick={async () => {
            if (authState.isAuth) {
              await addBookmarkHandler();
            } else {
              navigate("/login");
            }
          }}
        >
          <Unbookmark />
          {showText ? "Bookmark" : ""}
        </button>
      )}
    </>
  );
}

export default BookmarkButton;
