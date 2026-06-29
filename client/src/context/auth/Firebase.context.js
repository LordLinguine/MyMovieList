import React, { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Contexts
import { useGlobal } from "../state/Global.context";
import { useAuth } from "./Auth.context";
import { useAPI } from "../data/API.context";

// Firebase
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  deleteUser,
  onAuthStateChanged,
  signOut,
  reauthenticateWithCredential,
  getAuth,
  EmailAuthProvider,
} from "firebase/auth";
import { useUser } from "../state/User.context";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "mymovielist-5a4a9.firebaseapp.com",
  projectId: "mymovielist-5a4a9",
  storageBucket: "mymovielist-5a4a9.appspot.com",
  messagingSenderId: "462508153953",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-BSB1HLQY7L",
};

const errorHandler = (code) => {
  switch (code) {
    case "auth/invalid-credential":
      return {
        password: "There is no account that matches this email and password.",
      };

    case "auth/email-already-exists":
      return {
        email: "An account with this email already exists.",
      };

    default:
      return {};
  }
};

// Firebase Context
const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);
export const FirebaseContextProvider = (props) => {
  const firebaseApp = initializeApp(firebaseConfig);
  const Auth = getAuth();
  const { setLoading } = useGlobal().state;
  const { getDBUser } = useAPI().user;
  const { updateUser } = useUser();
  const { authenticateUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Check Provider
  const getProvider = () => Auth.currentUser.providerData[0].providerId;

  // Google Auth
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = (cb) =>
    signInWithPopup(Auth, googleProvider)
      .then((res) => {
        const googleCred = GoogleAuthProvider.credentialFromResult(res);
        cb({ ...res.user, googleCred }, null);
      })
      .catch((error) => console.log(error.code, error.message));

  // Get Current User
  const getCurrentUser = (cb) => onAuthStateChanged(Auth, (user) => cb(user));

  // Check Auth Session
  useEffect(() => {
    setLoading(true);

    // Getting Firebase User
    getCurrentUser((user) => {
      if (user) {
        const { accessToken, uid } = user;

        // Get Information from Database
        getDBUser(uid, accessToken, (res, APIError) => {
          if (APIError) return console.log(APIError);

          // Update User State
          const { email, username, ratedMovies, bookmarked, profilePicture } =
            res.data.user;
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

          // Go to the previous page the user was on
          const lastStoredPage = localStorage.getItem("lastStoredPage");
          if (lastStoredPage) navigate(lastStoredPage);
        });
      }
    });

    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create Email User
  const createEmailUser = (email, password, cb) =>
    createUserWithEmailAndPassword(Auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        authenticateUser(user.accessToken, user.uid);
        cb(user, null);
      })
      .catch((error) => cb(null, errorHandler(error.code)));

  // Sign In Email User
  const signInEmailUser = (email, password, cb) =>
    signInWithEmailAndPassword(Auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        authenticateUser(user.accessToken, user.uid);
        cb(user, null);
      })
      .catch((error) => cb(null, errorHandler(error.code)));

  // Log Out User
  const logoutFirebaseUser = () =>
    signOut(Auth)
      .then(() => {
        logoutUser();
      })
      .catch((error) => console.log(error.code, error.message));

  // Delete Email & Password Firebase User
  const deletePasswordFirebaseUser = (password) => {
    const user = Auth.currentUser;
    const cred = EmailAuthProvider.credential(user.email, password);
    return reauthenticateWithCredential(user, cred)
      .then(() => deleteUser(user))
      .then(() => logoutUser())
      .catch((error) => console.log(error.code, error.message));
  };

  // Delete Google Firebase User
  const deleteGoogleFirebaseUser = (googleCred) => {
    const user = Auth.currentUser;
    return reauthenticateWithCredential(user, googleCred)
      .then(() => deleteUser(user))
      .then(() => logoutUser())
      .catch((error) => console.log(error.code, error.message));
  };

  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp,
        Auth,
        util: { getProvider },
        functions: {
          getCurrentUser,
          createEmailUser,
          logoutFirebaseUser,
          signInEmailUser,
          deletePasswordFirebaseUser,
          deleteGoogleFirebaseUser,
          signInWithGoogle,
        },
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
