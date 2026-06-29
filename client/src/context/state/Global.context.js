import React, { createContext, useContext, useState } from "react";

// Global Context
const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext);
export const GlobalContextProvider = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [query, setQuery] = useState(null);

  return (
    <GlobalContext.Provider
      value={{
        state: {
          isLoading,
          setLoading,
        },
        info: {
          query,
          setQuery,
        },
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
