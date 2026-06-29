import React, { createContext, useContext, useState } from "react";

// User Auth Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthContextProvider = (props) => {
  const [authState, setAuthState] = useState({
    isAuth: false,
    accessToken: null,
    uid: null,
  });

  const authenticateUser = (accessToken, uid) =>
    setAuthState({ isAuth: true, accessToken, uid });

  const logoutUser = () =>
    setAuthState({ isAuth: false, accessToken: null, uid: null });

  return (
    <AuthContext.Provider value={{ authState, authenticateUser, logoutUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};
