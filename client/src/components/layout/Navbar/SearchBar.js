import React, { useState } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";

// Schemas
import { QuerySchema } from "../../../schemas/Movie.schemas";

// Contexts
import { useGlobal } from "../../../context/state/Global.context";

// Components
import Search from "../../svgs/Search";
import Close from "../../svgs/Close";
import Error from "../../svgs/Error";

function SearchBar() {
  const navigate = useNavigate();
  const { setQuery } = useGlobal().info;
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        <Formik
          initialValues={{ query: "" }}
          validationSchema={QuerySchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            setQuery(values.query);
            setSubmitting(false);
            resetForm();
            setOpen(false);
            navigate("/search");
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <div className="search-bar">
                <div className="row">
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
                  <button className="navbar__search-btn center" type="submit">
                    <Search />
                  </button>
                  <button
                    type="button"
                    className="navbar__search-btn search-bar__close center"
                    onClick={() => setOpen(false)}
                  >
                    <Close />
                  </button>
                </div>

                {/* Error */}
                {props.errors.query && props.touched.query && (
                  <p className="search-bar__error row">
                    <Error />
                    {props.errors.query}
                  </p>
                )}
              </div>
            </form>
          )}
        </Formik>
      ) : (
        <button
          className="navbar__search-btn center"
          onClick={() => setOpen(true)}
        >
          <Search />
        </button>
      )}
    </>
  );
}

export default SearchBar;
