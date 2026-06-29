import React, { useState } from "react";
import { Formik } from "formik";

// Schemas
import { ProfilePictureSchema } from "../../../schemas/User.schemas";

// Contexts
import { useAPI } from "../../../context/data/API.context";
import { useAuth } from "../../../context/auth/Auth.context";
import { useGlobal } from "../../../context/state/Global.context";
import { useUser } from "../../../context/state/User.context";

function ImageFileInputPopup(props) {
  const { setShowProfilePicPopup } = props;
  const { setLoading } = useGlobal().state;
  const { uid, accessToken } = useAuth().authState;
  const { updateProfilePicture } = useAPI().user;
  const { updateProfilePicture: updateContextProfilePic } = useUser();

  // Preview Image
  const [preview, setPreview] = useState(null);

  return (
    <div className="profile-pic-popup center">
      <Formik
        initialValues={{ profilePicture: "" }}
        validationSchema={ProfilePictureSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const { profilePicture: profilePicFile } = values;
          setLoading(true);
          setSubmitting(true);
          updateProfilePicture(
            uid,
            accessToken,
            profilePicFile,
            (res, APIError) => {
              if (APIError) return console.log(APIError);

              // Update Context
              const { profilePicture } = res.data.user;
              updateContextProfilePic(profilePicture);
              resetForm();
              setSubmitting(false);
              setShowProfilePicPopup(false);
              setLoading(false);
            }
          );
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <div className="profile-pic-popup__box center-vertical">
              <h1 className="profile-pic-popup__title">
                Choose a new Profile Picture!
              </h1>

              {/* Input */}
              <div className="profile-pic-popup__input-box center-vertical">
                {props.values.profilePicture ? (
                  <div className="center-vertical">
                    <img
                      src={preview}
                      className="profile-pic-popup__preview"
                      alt="Input Preview"
                    />
                    <p className="profile-pic-popup__preview-name">
                      {props.values.profilePicture.name}
                    </p>
                  </div>
                ) : (
                  <div className="profile-pic-popup__empty center">None</div>
                )}
                <label className="profile-pic-popup__input">
                  <input
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      props.setFieldValue("profilePicture", file);

                      const reader = new FileReader();
                      if (file) reader.readAsDataURL(file);

                      reader.onload = () => {
                        if (file && file["type"].split("/")[0] === "image")
                          setPreview(reader.result);
                      };
                    }}
                    onBlur={props.handleBlur}
                    // value={props.values.profilePicture}
                    type="file"
                    name="profilePicture"
                    accept="image/jpeg, image/png, image/jpg"
                  />
                  Choose File
                </label>
              </div>

              {/* Buttons */}
              <div className="between-row">
                <button type="submit" className="profile-pic-popup__save">
                  Save
                </button>
                <button
                  type="button"
                  className="profile-pic-popup__cancel"
                  onClick={() => setShowProfilePicPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default ImageFileInputPopup;
