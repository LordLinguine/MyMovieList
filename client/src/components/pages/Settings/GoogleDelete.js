import React from "react";
import { useNavigate } from "react-router-dom";

// Contexts
import { useFirebase } from "../../../context/auth/Firebase.context";
import { useAPI } from "../../../context/data/API.context";
import { useGlobal } from "../../../context/state/Global.context";
import { useAuth } from "../../../context/auth/Auth.context";

function GoogleDelete(props) {
  const { setShowWarning } = props;
  const { deleteDBUser } = useAPI().user;
  const { setLoading } = useGlobal().state;
  const { uid, accessToken } = useAuth().authState;
  const { signInWithGoogle, deleteGoogleFirebaseUser } =
    useFirebase().functions;
  const navigate = useNavigate();

  // Auth Callback
  const authCallback = async (user, error) => {
    if (!user || error) return console.log(error);

    // Delete DB User
    setLoading(true);
    await deleteDBUser(uid, accessToken, async (res, APIError) => {
      if (APIError) return console.log(APIError);

      // User Data from Firebase and Google
      const { googleCred } = user;
      await deleteGoogleFirebaseUser(googleCred);

      // Reset
      setShowWarning(false);
      setLoading(false);
      navigate("/signup");
    });
  };

  return (
    <div className="between-row warning-popup__google">
      <button
        type="button"
        className="warning-popup__delete"
        onClick={async () => await signInWithGoogle(authCallback)}
      >
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
  );
}

export default GoogleDelete;
