import { useParams } from "react-router-dom";
import { Box, Stack, Typography, Avatar } from "@mui/material";
import Navbar from "../component/Navbar";
import backend from "../../data-access/Backend";
import { useState, useEffect } from "react";
import ProfileBackgroundComponent from "../component/ProfileBackgroundComponent";
import ProfileComponent from "../component/ProfileComponent";
import PostComponent from "../../social/component/PostComponent";
import backgroundImage from "../image/profile_background.svg";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("visualizations");
  const [vizList, setVizList] = useState([]);
  const [likedList, setLikedList] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get(`user/${id}`);
        setUser(result.data);
        const res = await backend.get(`visualization/${id}/shared`);
        setVizList(res.data);
        const rez = await backend.get(`user/${id}/liked`);
        setLikedList(rez.data);
        const fr = await backend.get(`friend_request/${id}`);
        setFriends(fr.data);
        const fri = await backend.get(`friend_request/${id}/are_we_friends`);
        setIsFriend(fri);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, [id]);

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

  const handleRouting = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Navbar />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          overflow: "auto",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "200px",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "start",
            alignItems: "flex-end",
          }}
        >
          <ProfileBackgroundComponent
            user={user}
            avatarSx={{
              position: "absolute",
              bottom: "-70px",
              left: "13%",
              zIndex: 10,
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            minHeight: "150px",
            alignItems: "center",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "column",
            padding: "2% 0 1% 0",
          }}
        >
          <ProfileComponent
            user={user}
            viewMode={viewMode}
            setViewMode={setViewMode}
            id={id}
          />
        </Box>
        <Box
          sx={{
            width: "60%",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "20px",
          }}
        >
          <Stack
            spacing={3}
            sx={{
              p: "2% 5%",
              alignItems: viewMode === "friends" ? "center" : undefined,
            }}
          >
            {viewMode === "visualizations" &&
              vizList.map((viz) => (
                <PostComponent
                  key={viz.id}
                  visualization={viz}
                  setVizList={setVizList}
                />
              ))}
            {viewMode === "liked" &&
              likedList.map((viz) => (
                <PostComponent
                  key={viz.id}
                  visualization={viz}
                  setVizList={setLikedList}
                />
              ))}
            {viewMode === "friends" &&
              friends.map((fr) => (
                <Box
                  key={fr.id}
                  onClick={() => handleRouting(fr?.userId)}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20%",
                    width: "80%",
                    backgroundColor: "white",
                    padding: "1% 5% 1% 5%",
                    borderRadius: "5px",
                    border: "1px solid #001f47",
                  }}
                >
                  <Avatar
                    src={profilePictureOf(fr)}
                    sx={{
                      width: "5%",
                      height: "auto",
                      aspectRatio: "1",
                      bgcolor: "white",
                      color: "#001f47",
                      fontSize: "1rem",
                      border: "2px solid #001f47",
                    }}
                  >
                    {!fr.profilePicture && initialsOf(fr)}
                  </Avatar>
                  <Typography>
                    {fr.firstname} {fr.lastname}
                  </Typography>
                </Box>
              ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
