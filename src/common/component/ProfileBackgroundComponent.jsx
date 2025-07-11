import { Avatar, Box } from "@mui/material";

const ProfileBackgroundComponent = ({ user, avatarSx = {} }) => {
  if (!user) {
    return null;
  }

  const initialsOf = () => {
    if (!user.firstname || !user.lastname) {
      return "";
    } else {
      return (
        user.firstname.charAt(0).toUpperCase() +
        user.lastname.charAt(0).toUpperCase()
      );
    }
  };

  const profilePictureOf = () => {
    if (!user.profilePicture) {
      return null;
    } else {
      return `data:image/png;base64,${user.profilePicture}`;
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Avatar
        src={profilePictureOf()}
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
        {!user.profilePicture && initialsOf()}
      </Avatar>
    </Box>
  );
};

export default ProfileBackgroundComponent;
