import React from "react";

// Contexts
import { useAuth } from "../../../context/auth/Auth.context";
import { useUser } from "../../../context/state/User.context";

// Components
import User from "../../svgs/User";
import ProfilePictureQuery from "./ProfilePictureQuery";

function ProfilePicture(props) {
  const { isSetting } = props;
  const { isAuth } = useAuth().authState;
  const {
    user: { profilePicture },
  } = useUser();

  if (isAuth && profilePicture.length >= 1) {
    return <ProfilePictureQuery {...props} />;
  } else {
    return (
      <>
        {isSetting ? (
          <div className="profile-pic__box user-info__none center">None</div>
        ) : (
          <div
            className={`profile-pic__box profile-pic__user ${props.className} center`}
          >
            <User />
          </div>
        )}
      </>
    );
  }
}

export default ProfilePicture;
