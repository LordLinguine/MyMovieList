import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// Contexts
import { useAuth } from "../../../context/auth/Auth.context";
import { useFirebase } from "../../../context/auth/Firebase.context";
import { useUser } from "../../../context/state/User.context";

// Components
import SearchBar from "./SearchBar";
import Exit from "../../svgs/Exit";
import Setting from "../../svgs/Setting";
import RightArrow from "../../svgs/RightArrow";
import List from "../../svgs/List";
import Star from "../../svgs/Star";
import Close from "../../svgs/Close";
import Bookmark from "../../svgs/Bookmark";
import ProfilePicture from "../standalone/ProfilePicture";

function Navbar() {
  const { pathname } = useLocation();
  const { isAuth } = useAuth().authState;
  const {
    user: { email, username },
  } = useUser();
  const [openDropdown, setOpenDropdown] = useState(false);
  const { logoutFirebaseUser } = useFirebase().functions;
  const links = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Discover",
      path: "/search",
    },
    {
      label: "Top Rated",
      path: "/top",
    },
    {
      label: "Trending",
      path: "/trending",
    },
    {
      label: "Upcoming",
      path: "/upcoming",
    },
    {
      label: "Genres",
      path: "/genres",
    },
  ];

  // Profile Dropdown Links
  const profileLinks = [
    {
      icon: <Setting className="profile-link__icon" />,
      label: "Settings",
      path: "/settings",
    },
    {
      icon: <List className="profile-link__icon" />,
      label: "Movie List",
      path: "/list",
    },
    {
      icon: <Star id="profile-star" className="profile-link__icon" />,
      label: "Recommendations",
      path: "/recommendations",
    },
    {
      icon: <Bookmark className="profile-link__icon" />,
      label: "Bookmarked",
      path: "/bookmarked",
    },
  ];

  useEffect(() => {
    setOpenDropdown(false);
  }, [pathname]);

  return (
    <div className="navbar between-row">
      <div className="row">
        <h1 className="navbar__title">
          My<span>Movie</span>List
        </h1>

        {/* Links */}
        {links.map((link) => {
          return (
            <NavLink key={link.label} className="navbar__link" to={link.path}>
              {link.label}
            </NavLink>
          );
        })}
      </div>

      <div className="row">
        <SearchBar />
        {isAuth ? (
          <>
            {openDropdown ? (
              <button
                className="navbar__profile center"
                onClick={() => setOpenDropdown(false)}
              >
                <Close />
              </button>
            ) : (
              <div
                className="navbar__profile-pic"
                onClick={() => setOpenDropdown(true)}
              >
                <ProfilePicture />
              </div>
            )}
          </>
        ) : (
          <NavLink to="/login" className="navbar__login">
            Log In
          </NavLink>
        )}
      </div>

      {/* Profile Dropdown */}
      {openDropdown && (
        <div className="profile-dropdown">
          {/* Profile Image and Info */}
          <div className="profile-dropdown__img-box row">
            <ProfilePicture className="profile-dropdown__img" />
            <div className="profile-info">
              <h1 className="profile-info__username">{username}</h1>
              <p className="profile-info__email">{email}</p>
            </div>
          </div>
          <hr />
          {/* Profile Link */}
          {profileLinks.map((link) => {
            const { icon, label, path } = link;

            return (
              <NavLink
                key={"profile-" + label}
                to={path}
                className="profile-link between-row"
              >
                <div className="row">
                  <div className="profile-link__icon-box center">{icon}</div>
                  {label}
                </div>

                <RightArrow className="profile-link__right" />
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <div
            className="profile-link profile-logout between-row"
            onClick={() => {
              logoutFirebaseUser();
              setOpenDropdown(false);
            }}
          >
            <div className="row">
              <div className="profile-link__icon-box center">
                <Exit className="profile-link__icon" />
              </div>
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
