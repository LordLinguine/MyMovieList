import React from "react";

// Firebase
import { useFirebase } from "../../../context/auth/Firebase.context";

// Components
import MovieBackground from "../standalone/MovieBackground";
import Google from "../../svgs/Google";

// Contexts
import { useAPI } from "../../../context/data/API.context";
import { useAuth } from "../../../context/auth/Auth.context";
import { useUser } from "../../../context/state/User.context";

function AuthContainer(props) {
  const { isLogin } = props;
  const { signInWithGoogle } = useFirebase().functions;
  const { createDBUser, getDBUser } = useAPI().user;
  const { authenticateUser } = useAuth();
  const { updateUser } = useUser();

  // Auth and Update User
  const authAndUpdateUser = (uid, accessToken, user) => {
    // Update User State
    const { email, username, ratedMovies, bookmarked, profilePicture } = user;
    updateUser({
      uid,
      email,
      username,
      ratedMovies,
      bookmarked,
      profilePicture,
    });

    // Finish Auth Process
    authenticateUser(accessToken, uid);
  };

  // Create Database User
  const createDBUserErrorHandler = async (uid, accessToken, APIError) => {
    if (APIError.response.status === 403) {
      await getDBUser(uid, accessToken, async (res, APIError) => {
        if (APIError) return console.log(APIError);

        authAndUpdateUser(uid, accessToken, res.data.user);
      });
    }

    console.log(APIError);
  };

  // Get Database User
  const getDBUserErrorHandler = async (uid, accessToken, data, APIError) => {
    if (APIError.response.status === 404) {
      await createDBUser(uid, data, accessToken, async (res, APIError) => {
        if (APIError) return console.log(APIError);

        authAndUpdateUser(uid, accessToken, res.data.user);
      });
    }

    console.log(APIError);
  };

  // Auth Callback
  const authCallback = async (user, error) => {
    if (!user || error) return console.log(error);
    // User Data from Firebase and Google
    const { uid, accessToken, displayName, email } = user;

    // Get Information from Database
    if (isLogin) {
      // Getting DB User
      await getDBUser(uid, accessToken, async (res, APIError) => {
        if (APIError)
          return await getDBUserErrorHandler(
            uid,
            accessToken,
            { username: displayName, email },
            APIError
          );

        authAndUpdateUser(uid, accessToken, res.data.user);
      });
    } else {
      // Creating  New DB User
      await createDBUser(
        uid,
        { username: displayName, email },
        accessToken,
        async (res, APIError) => {
          if (APIError)
            return createDBUserErrorHandler(uid, accessToken, APIError);

          authAndUpdateUser(uid, accessToken, res.data.user);
        }
      );
    }
  };

  return (
    <div className="auth-container center">
      {/* Movie Background */}
      <MovieBackground url="https://image.tmdb.org/t/p/original/l6b9YZEokZl1nt7q0pprrur6btG.jpg" />

      {/* Auth Form */}
      <div className="auth-form row">
        {/* Left Side */}
        <div className="auth-form__left">
          <h2 className="auth-form__title">
            {isLogin ? "Log in to your Account" : "Create an Account"}
          </h2>

          {/* Main Form */}
          {props.children}
        </div>

        {/* Right Side */}
        <div className="auth-form__right center-vertical">
          <div className="auth-form__logo center">
            <img
              src={process.env.PUBLIC_URL + "/assets/images/logo.png"}
              alt="MyMovieList"
            />
          </div>
          <hr />
          <h2 className="auth-form__sub-title between-row">
            Other Ways to {isLogin ? "Log In" : "Sign Up"}
          </h2>
          <button
            className="auth-form__google center"
            onClick={async () => await signInWithGoogle(authCallback)}
          >
            <Google /> Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthContainer;
