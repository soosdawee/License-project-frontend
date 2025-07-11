import { useState, useEffect } from "react";
import { Box, Typography, Avatar, Card, CardContent } from "@mui/material";
import backend from "../../data-access/Backend";

const FriendsComponent = () => {
  const [friends, setFriends] = useState([]);

  const getFriends = async () => {
    try {
      const result = await backend.get(
        `friend_request/${localStorage.getItem("userId")}`
      );
      setFriends(result.data);
    } catch (error) {
      console.log("error fetching friendlies");
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  const initialsOf = (user) => {
    if (!user) return null;
    if (!user.firstname || !user.lastname) {
      return "";
    }
    return (
      user.firstname.charAt(0).toUpperCase() +
      user.lastname.charAt(0).toUpperCase()
    );
  };

  const profilePictureOf = (user) => {
    if (!user) {
      return null;
    } else {
      return `data:image/png;base64,${user.profilePicture}`;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "95%",
          backgroundColor: "#007fa7",
          margin: "1% 5%",
          borderRadius: "15px",
          marginBottom: "5%",
        }}
      >
        <Typography sx={{ color: "white" }}>Your Friends</Typography>
      </Box>
      {friends.map((fr) => (
        <Card sx={{ width: "90%", marginBottom: "4%" }} key={fr.userId}>
          <CardContent sx={{ width: "90%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "center",
                width: "100%",
                gap: "3%",
              }}
            >
              <Avatar
                src={profilePictureOf(fr)}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {!fr?.profilePicture && initialsOf(fr)}
              </Avatar>
              <Typography variant="h6">
                {fr.firstname} {fr.lastname}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default FriendsComponent;
