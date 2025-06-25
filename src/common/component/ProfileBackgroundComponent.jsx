import React from "react";
import { Avatar, Typography, Box } from "@mui/material";

const ProfileBackgroundComponent = ({ user, avatarSx = {} }) => {
  if (!user) return null;

  const getInitials = () => {
    if (!user.firstname || !user.lastname) return "";
    return (
      user.firstname.charAt(0).toUpperCase() +
      user.lastname.charAt(0).toUpperCase()
    );
  };

  const getAvatarSrc = () => {
    if (!user.profilePicture) return null;
    return `data:image/png;base64,${user.profilePicture}`;
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Avatar
        src={getAvatarSrc()}
        sx={{
          width: 130,
          height: "auto",
          aspectRatio: "1",
          bgcolor: "white",
          color: "#001f47",
          fontSize: "3rem",
          border: "5px solid #001f47",
          ...avatarSx,
        }}
      >
        {!user.profilePicture && getInitials()}
      </Avatar>
    </Box>
  );
};

export default ProfileBackgroundComponent;
