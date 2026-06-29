import React from "react";

function SearchPageTabs(props) {
  const { page, setPage, totalPages } = props;

  return (
    <div className="search-tabs center">
      {Array.apply(null, Array(totalPages)).map((_, i) => {
        const curPage = i + 1;

        return (
          <button
            key={"search-tabs-" + curPage}
            className={`search-tabs__tab center ${
              page === curPage ? "search-tabs__active" : ""
            }`}
            onClick={() => setPage(curPage)}
          >
            {curPage}
          </button>
        );
      })}
    </div>
  );
}

export default SearchPageTabs;
