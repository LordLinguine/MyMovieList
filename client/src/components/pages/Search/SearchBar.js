import React from "react";
import { Formik } from "formik";

// Schemas
import { QuerySchema } from "../../../schemas/Movie.schemas";

// Contexts
import { useGlobal } from "../../../context/state/Global.context";

// Components
import Search from "../../svgs/Search";
import Error from "../../svgs/Error";

function SearchBar() {
  const { setQuery } = useGlobal().info;
  const { setLoading } = useGlobal().state;

  

  return (
    <Formik
      initialValues={{ query: "" }}
      validationSchema={QuerySchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setLoading(true);

        // Find
        setQuery(values.query);

        // Reset
        setSubmitting(false);
        resetForm();
        setLoading(false);
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <div className="search-page__search-bar">
            <div className="center">
              <input
                type="text"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.query}
                name="query"
                placeholder="Search by keyword or title..."
                autoComplete="off"
              />
              {/* Search Bar Buttons */}
              <button className="search-page__search-btn center" type="submit">
                <Search />
              </button>
            </div>

            {/* Error */}
            {props.errors.query && props.touched.query && (
              <p className="search-page__error center">
                <Error />
                {props.errors.query}
              </p>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
}

export default SearchBar;
