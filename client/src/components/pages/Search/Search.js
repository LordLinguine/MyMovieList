import React from "react";

// Components
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

function Search() {
  return (
    <div className="search-page center-vertical">
      <h1 className="search-page__title">Search For Your Favorite Movies</h1>
      <SearchBar />
      <SearchResults />
    </div>
  );
}

export default Search;
