import React from "react";

// Contexts
import { useFirebase } from "../../../context/auth/Firebase.context";
import { useAPI } from "../../../context/data/API.context";
import { useUser } from "../../../context/state/User.context";
import { useAuth } from "../../../context/auth/Auth.context";

// Components
import AuthContainer from "../../layout/Auth/AuthContainer";
import AuthForm from "../../layout/Auth/AuthForm";

function Login() {
  const { signInEmailUser } = useFirebase().functions;
  const { getDBUser } = useAPI().user;
  const { updateUser } = useUser();
  const { authenticateUser } = useAuth();

  return (
    <div className="login-page">
      <AuthContainer isLogin={true}>
        <AuthForm
          isLogin={true}
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={(values, formCallback) => {
            const { email, password } = values;

            // Log In Email User
            signInEmailUser(email, password, (user, error) => {
              if (!user || error) return formCallback(error);

              // Successful Creation of Firebase User
              const { accessToken, uid } = user;

              // Get user information from Database
              getDBUser(uid, accessToken, (res, APIError) => {
                if (APIError) {
                  formCallback(APIError);
                  return console.log(APIError);
                }

                // Update User State
                const {
                  email,
                  username,
                  ratedMovies,
                  bookmarked,
                  profilePicture,
                } = res.data.user;
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
                formCallback(null);
              });
            });
          }}
          inputs={[
            {
              name: "email",
              type: "email",
              label: "Email",
              placeholder: "Ex: Example@gmail.com",
            },
            {
              name: "password",
              type: "password",
              label: "Password",
              placeholder: "Ex: Password#1234",
            },
          ]}
        />
      </AuthContainer>
    </div>
  );
}

export default Login;
