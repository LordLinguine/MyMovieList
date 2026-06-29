import React from "react";
import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page center-vertical">
      <h1 className="not-found-page__title">
        4<span>0</span>4
      </h1>
      <p className="not-found-page__text">
        The page you're looking doesn't exist.
      </p>
      <NavLink to="/" className="not-found-page__link">
        Back Home
      </NavLink>
    </div>
  );
}

export default NotFound;
