import React from "react";

// Contexts
import { useFirebase } from "../../../context/auth/Firebase.context";

// Components
import DeleteForm from "./DeleteForm";
import GoogleDelete from "./GoogleDelete";

function WarningPopup(props) {
  const { setShowWarning } = props;
  const { getProvider } = useFirebase().util;

  return (
    <div className="warning-popup center">
      <div className="warning-popup__box center-vertical">
        <h1 className="warning-popup__title">Are you sure?</h1>
        <p className="warning-popup__desc">
          By clicking the "Delete" button, all the data connected to your
          account will be deleted and lost forever.
        </p>

        {/* Email & Password OR Google */}
        {getProvider() === "password" ? (
          <DeleteForm setShowWarning={setShowWarning} />
        ) : (
          <GoogleDelete setShowWarning={setShowWarning} />
        )}
      </div>
    </div>
  );
}

export default WarningPopup;
