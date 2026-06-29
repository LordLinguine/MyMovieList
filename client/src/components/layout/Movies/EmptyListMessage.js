import React from "react";
import { NavLink } from "react-router-dom";

function EmptyListMessage(props) {
  return (
    <div className="list-page__empty">
      {props.isBookmark ? (
        <p className="list-page__empty-text">
          It Looks like you haven't bookmarked any movies yet! Find movies that
          you're interested in and bookmark them, so you can{" "}
          <span>watch them later.</span>
        </p>
      ) : (
        <p className="list-page__empty-text">
          It Looks like you don't have any movies added to your list yet! Find
          movies that you've watched, so we can help you find the{" "}
          <span>perfect next movie</span> to watch.
        </p>
      )}

      <div className="row">
        <NavLink to="/search" className="list-page__empty-link">
          Discover
        </NavLink>
        <NavLink to="/top" className="list-page__empty-link">
          Top Rated
        </NavLink>
        <NavLink to="/genres" className="list-page__empty-link">
          Genres
        </NavLink>
      </div>
    </div>
  );
}

export default EmptyListMessage;
