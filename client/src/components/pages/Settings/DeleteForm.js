import React from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";

// Schemas
import { PasswordSchema } from "../../../schemas/User.schemas";

// Contexts
import { useGlobal } from "../../../context/state/Global.context";
import { useAuth } from "../../../context/auth/Auth.context";
import { useAPI } from "../../../context/data/API.context";
import { useFirebase } from "../../../context/auth/Firebase.context";

// Components
import Error from "../../svgs/Error";

function DeleteForm(props) {
  const { setShowWarning } = props;
  const { setLoading } = useGlobal().state;
  const { uid, accessToken } = useAuth().authState;
  const { deleteDBUser } = useAPI().user;
  const { deletePasswordFirebaseUser } = useFirebase().functions;
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ password: "" }}
      validationSchema={PasswordSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setLoading(true);
        await deleteDBUser(uid, accessToken, async (res, APIError) => {
          if (APIError) return console.log(APIError);

          await deletePasswordFirebaseUser(values.password);

          // Reset
          setShowWarning(false);
          setLoading(false);
          resetForm();
          setSubmitting(false);
          navigate("/signup");
        });
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          {/* Input */}
          <input
            type="password"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.password}
            name="password"
            placeholder="Enter your password..."
            autoComplete="off"
            className="warning-popup__input"
          />

          {/* Error Mesasge */}
          {props.errors.password && props.touched.password && (
            <p className="warning-popup__error center">
              <Error />
              {props.errors.password}
            </p>
          )}

          <div className="between-row warning-popup__row">
            <button type="submit" className="warning-popup__delete">
              Delete
            </button>
            <button
              type="button"
              className="warning-popup__cancel"
              onClick={() => setShowWarning(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default DeleteForm;
