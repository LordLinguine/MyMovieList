import React from "react";
import { useQuery } from "@tanstack/react-query";

// Contexts
import { useAuth } from "../../../context/auth/Auth.context";
import { useUser } from "../../../context/state/User.context";
import { useAPI } from "../../../context/data/API.context";
import { useUtil } from "../../../context/state/Util.context";

// Components
import Loading from "./Loading";
import ErrorPopup from "./ErrorPopup";

function ProfilePictureQuery(props) {
  const { uid, accessToken } = useAuth().authState;
  const {
    user: { profilePicture, username },
  } = useUser();
  const { convertBufferToBase64 } = useUtil();
  const { getProfilePictureURL } = useAPI().user;
  const { isPending, isError, data, error } = useQuery({
    queryKey: [`${uid}__PROFILE:${profilePicture[0].fileID}`],
    queryFn: async () => await getProfilePictureURL(uid, accessToken),
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError || !data) {
    return <ErrorPopup message={error.message} />;
  }

  const imageBufferArray = data.data.data;
  const base64String = convertBufferToBase64(imageBufferArray);
  return (
    <div className={`profile-pic__box ${props.className} center`}>
      <img
        src={`data:image/png;base64,${base64String}`}
        alt={username}
        className="profile-pic"
      />
    </div>
  );
}

export default ProfilePictureQuery;
