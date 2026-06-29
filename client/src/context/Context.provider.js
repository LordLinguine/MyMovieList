import React from "react";

// Contexts
import { FirebaseContextProvider } from "./auth/Firebase.context";
import { AuthContextProvider } from "./auth/Auth.context";

import { TMDBContextProvider } from "./data/Tmdb.context";
import { APIContextProvider } from "./data/API.context";

import { GlobalContextProvider } from "./state/Global.context";
import { UtilContextProvider } from "./state/Util.context";
import { UserContextProvider } from "./state/User.context";

function ContextProvider(props) {
  return (
    <GlobalContextProvider>
      <UtilContextProvider>
        <APIContextProvider>
          <AuthContextProvider>
            <UserContextProvider>
              <FirebaseContextProvider>
                <TMDBContextProvider>{props.children}</TMDBContextProvider>
              </FirebaseContextProvider>
            </UserContextProvider>
          </AuthContextProvider>
        </APIContextProvider>
      </UtilContextProvider>
    </GlobalContextProvider>
  );
}

export default ContextProvider;
