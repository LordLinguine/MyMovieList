import React, { useState } from "react";

// Contexts
import { useUser } from "../../../context/state/User.context";

// Components
import Email from "../../svgs/Email";
import User from "../../svgs/User";
import WarningPopup from "./WarningPopup";
import EditProfilePicPopup from "./EditProfilePicPopup";
import EditUsernamePopup from "./EditUsernamePopup";
import ProfilePicture from "../../layout/standalone/ProfilePicture";

function Settings() {
  const {
    user: { email, username },
  } = useUser();

  // Warning Popup
  const [showWarning, setShowWarning] = useState(false);

  // Edit Profile Picture Popup
  const [showProfilePicPopup, setShowProfilePicPopup] = useState(false);

  // Edit Username Popup
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">My Settings</h1>

      <main className="row">
        {/* User Info */}
        <div className="user-info">
          <h2 className="user-info__title">User Information</h2>
          <div className="row">
            <p className="user-info__text row">
              <User />
              <strong>Username: </strong>
              {username}
            </p>
            <button
              type="button"
              className="user-info__edit"
              onClick={() => setShowUsernamePopup(true)}
            >
              Edit
            </button>
          </div>

          <div className="user-info__profilePic-box row">
            <ProfilePicture className="user-info__profilePic" isSetting={true} />
            <button
              type="button"
              className="user-info__edit"
              onClick={() => setShowProfilePicPopup(true)}
            >
              Change Photo
            </button>
          </div>
        </div>

        <div className="right-side">
          {/* Auth Info */}
          <div className="auth-info">
            <h2 className="auth-info__title">Security Information</h2>
            <p className="auth-info__text row">
              <Email />
              <strong>Email: </strong>
              {email}
            </p>
          </div>

          {/* User Actions */}
          <div className="user-actions">
            <h2 className="user-actions__title">User Actions</h2>
            <p className="user-actions__desc">
              By clicking the "Delete User" button, all the data connected to
              your account will be deleted and lost forever.
            </p>
            <button
              type="button"
              className="user-actions__delete"
              onClick={() => setShowWarning(true)}
            >
              Delete User
            </button>
          </div>
        </div>
      </main>

      {/* Warning Popup */}
      {showWarning && <WarningPopup setShowWarning={setShowWarning} />}

      {/* Image File Input Popup */}
      {showProfilePicPopup && (
        <EditProfilePicPopup setShowProfilePicPopup={setShowProfilePicPopup} />
      )}

      {/* Edit Username Popup */}
      {showUsernamePopup && (
        <EditUsernamePopup setShowUsernamePopup={setShowUsernamePopup} />
      )}
    </div>
  );
}

export default Settings;
