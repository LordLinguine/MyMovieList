import React from "react";
import { NavLink } from "react-router-dom";
import { Formik } from "formik";

// Contexts
import { useGlobal } from "../../../context/state/Global.context";

// Schemas
import { LoginSchema, SignupSchema } from "../../../schemas/User.schemas";

// Components
import Error from "../../svgs/Error";

function AuthForm(props) {
  const { isLogin, initialValues, onSubmit, inputs } = props;
  const { setLoading } = useGlobal().state;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={isLogin ? LoginSchema : SignupSchema}
      onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
        setLoading(true);
        onSubmit(values, (error) => {
          if (error) {
            setErrors(error);
          } else {
            resetForm();
          }

          setSubmitting(false);
          setLoading(false);
        });
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          {inputs.map((inputInfo) => {
            const { name, type, label, placeholder } = inputInfo;
            const isError = props.errors[name] && props.touched[name];
            const isSuccess = !props.errors[name] && props.touched[name];

            return (
              <div
                key={name}
                className={`auth-form__input-box ${
                  isError
                    ? "auth-form__error-box"
                    : isSuccess
                    ? "auth-form__success-box"
                    : ""
                }`}
              >
                {/* Label */}
                <label htmlFor={name}>{label}</label>

                {/* Input */}
                <input
                  type={type}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values[name]}
                  name={name}
                  placeholder={placeholder}
                  autoComplete="off"
                />

                {/* Error Mesasge */}
                {isError && (
                  <p className="auth-form__error row">
                    <Error />
                    {props.errors[name]}
                  </p>
                )}
              </div>
            );
          })}

          <div className="center-vertical">
            <button type="submit" className="auth-form__submit">
              {isLogin ? "Log In" : "Sign Up"}
            </button>
            {isLogin ? (
              <NavLink to="/signup" className="auth-form__link">
                Don't have an account yet? <span>Sign Up</span>
              </NavLink>
            ) : (
              <NavLink to="/login" className="auth-form__link">
                Already have an account? <span>Log In</span>
              </NavLink>
            )}
          </div>
        </form>
      )}
    </Formik>
  );
}

export default AuthForm;
