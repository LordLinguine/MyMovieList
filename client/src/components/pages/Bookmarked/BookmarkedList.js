import React from "react";

// Contexts
import { useUser } from "../../../context/state/User.context";

// Components
import EmptyListMessage from "../../layout/Movies/EmptyListMessage";
import BookmarkQuery from "./BookmarkQuery";

function BookmarkedList() {
  const {
    user: { bookmarked },
  } = useUser();

  if (bookmarked.length >= 1) {
    return <BookmarkQuery />;
  } else {
    return (
      <div className="list-page">
        <h1 className="list-page__title">
          Your <span>Bookmarked</span> Movies
        </h1>

        <EmptyListMessage isBookmark={true} />
      </div>
    );
  }
}

export default BookmarkedList;
