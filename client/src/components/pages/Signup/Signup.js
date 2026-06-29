import React from "react";

// Contexts
import { useFirebase } from "../../../context/auth/Firebase.context";
import { useAPI } from "../../../context/data/API.context";
import { useAuth } from "../../../context/auth/Auth.context";
import { useUser } from "../../../context/state/User.context";

// Components
import AuthContainer from "../../layout/Auth/AuthContainer";
import AuthForm from "../../layout/Auth/AuthForm";

function Signup() {
  const { createEmailUser } = useFirebase().functions;
  const { createDBUser } = useAPI().user;
  const { authenticateUser } = useAuth();
  const { updateUser } = useUser();

  return (
    <div className="signup-page">
      <AuthContainer isLogin={false}>
        <AuthForm
          isLogin={false}
          initialValues={{
            email: "email@gmail.com",
            username: "Username22",
            password: "Password123411$",
            confirmPassword: "Password123411$",
          }}
          onSubmit={(values, formCallback) => {
            const { username, email, password } = values;

            // Create Email User
            createEmailUser(email, password, (user, firebaseError) => {
              if (firebaseError) {
                formCallback(firebaseError);
                return console.log(firebaseError);
              }

              // Successful Creation of Firebase User
              const { accessToken, uid } = user;

              // Create User in Database
              createDBUser(
                uid,
                {
                  username,
                  email,
                },
                accessToken,
                (res, APIError) => {
                  if (APIError) {
                    formCallback(APIError);
                    return console.log(APIError);
                  }

                  // Update User State
                  const { email, username, profilePicture } = res.data.user;
                  updateUser({ uid, email, username, profilePicture });

                  // Finish Auth Process
                  authenticateUser(accessToken, uid);
                  formCallback(null);
                }
              );
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
              name: "username",
              type: "text",
              label: "Username",
              placeholder: "Ex: MyUsername",
            },
            {
              name: "password",
              type: "password",
              label: "Create a Password",
              placeholder: "Ex: Password#1234",
            },
            {
              name: "confirmPassword",
              type: "password",
              label: "Confirm your Password",
              placeholder: "Ex: Password#1234",
            },
          ]}
        />
      </AuthContainer>
    </div>
  );
}

export default Signup;
