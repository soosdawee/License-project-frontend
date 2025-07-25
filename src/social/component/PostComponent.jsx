import { useState } from "react";
import backend from "../../data-access/Backend";
import {
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Button,
  Box,
  Skeleton,
} from "@mui/material";
import CommentModal from "./CommentModal";
import ReportModal from "./ReportModal";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReportIcon from "@mui/icons-material/Report";
import { useNavigate } from "react-router-dom";

const PostComponent = ({ visualization, setVizList, isUnderReview, index }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [activeViz, setActiveViz] = useState(null);
  const [openReport, setOpenReport] = useState(false);

  console.log(visualization);

  const loading = !visualization || !visualization.visualizationId;

  if (loading) {
    console.log("wavws");
    return (
      <Card
        sx={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: "red",
        }}
      >
        <Skeleton variant="rectangular" height={64} animation="wave" />
        <Skeleton
          variant="rectangular"
          sx={{ flex: "1 1 85%" }}
          animation="wave"
        />
        <Skeleton variant="rectangular" height={50} animation="wave" />
      </Card>
    );
  }

  const handleOpenReport = (viz) => {
    setActiveViz(viz);
    setOpenReport(true);
  };

  const handleOpenModal = (viz) => {
    setActiveViz(viz);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setActiveViz(null);
  };

  const handleCloseReport = () => {
    setOpenReport(false);
    setActiveViz(null);
  };

  const calculateTime = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const secs = Math.floor((now - created) / 1000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (secs <= 59) return rtf.format(-secs, "second");
    const mins = Math.floor(secs / 60);
    if (mins <= 59) return rtf.format(-mins, "minute");
    const hous = Math.floor(mins / 60);
    if (hous <= 23) return rtf.format(-hous, "hour");
    const days = Math.floor(hous / 24);
    return rtf.format(-days, "day");
  };

  const handleLike = async (visualizationId) => {
    try {
      await backend.post(`user/${visualizationId}/like`);

      const userId = parseInt(localStorage.getItem("userId"), 10);

      setVizList((prevList) =>
        prevList.map((viz) => {
          if (viz.visualizationId !== visualizationId) return viz;

          const alreadyLiked = viz.likedByUsers.some(
            (u) => u.userId === userId
          );

          const updatedLikedByUsers = alreadyLiked
            ? viz.likedByUsers.filter((u) => u.userId !== userId)
            : [...viz.likedByUsers, { userId }];

          return {
            ...viz,
            likedByUsers: updatedLikedByUsers,
          };
        })
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const getInitials = (user) => {
    if (!user) return null;
    if (!user.firstname || !user.lastname) return "";
    return (
      user.firstname.charAt(0).toUpperCase() +
      user.lastname.charAt(0).toUpperCase()
    );
  };

  const getAvatarSrc = (user) => {
    if (!user) return null;
    return `data:image/png;base64,${user.profilePicture}`;
  };

  const handleRouting = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const handleUnreport = async (visualizationId) => {
    try {
      await backend.put(`visualization/unreport/${visualizationId}`);
      setVizList((prevList) =>
        prevList.filter((viz) => viz.visualizationId !== visualizationId)
      );
    } catch (error) {
      console.log("TZEAPA");
    }
  };

  const handleNegativeReview = async (visualizationId) => {
    try {
      await backend.put(`visualization/review_negatively/${visualizationId}`);
      setVizList((prevList) =>
        prevList.filter((viz) => viz.visualizationId !== visualizationId)
      );
    } catch (error) {
      console.log("TZEAPA");
    }
  };

  return (
    <>
      <Card
        key={visualization.visualizationId}
        sx={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <AppBar
          position="static"
          sx={{ borderRadius: "4px 4px 0 0", backgroundColor: "#a8a8a8" }}
        >
          <Toolbar
            sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
          >
            <Box
              onClick={() => handleRouting(visualization?.user?.userId)}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <Avatar
                src={getAvatarSrc(visualization.user)}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {!visualization?.user?.profilePicture &&
                  getInitials(visualization.user)}
              </Avatar>
              <Typography variant="h6">
                {visualization.user?.firstname} {visualization.user?.lastname}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.85rem" }}>
              {calculateTime(visualization.timestamp)}
            </Typography>
          </Toolbar>
        </AppBar>

        <CardContent
          sx={{
            flex: "1 1 85%",
            overflow: "hidden",
            p: 0,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              position: "relative",
            }}
          >
            <iframe
              src={`http://localhost:3000/visualization/${visualization.visualizationId}/shared`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allowFullScreen
            ></iframe>
          </Box>
        </CardContent>

        <CardActions
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "start",
            backgroundColor: "#f5f5f5",
            gap: 0,
            padding: 0,
          }}
        >
          {isUnderReview ? (
            <>
              <Button
                variant="outlined"
                sx={{
                  width: "50%",
                  backgroundColor: "white",
                  color: "#b2b4b9",
                  border: "1px solid black",
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  margin: "0 !important",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
                onClick={() => handleUnreport(visualization.visualizationId)}
              >
                <ReportIcon />
                Unreport
              </Button>
              <Button
                variant="outlined"
                sx={{
                  width: "50%",
                  backgroundColor: "white",
                  color: "#b2b4b9",
                  border: "1px solid black",
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  margin: "0 !important",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
                onClick={() =>
                  handleNegativeReview(visualization.visualizationId)
                }
              >
                ❌ Review Negatively
              </Button>
            </>
          ) : (
            <>
              <Button
                name={`like-${index}`}
                variant="outlined"
                sx={{
                  width: "33.3%",
                  border: "1px solid black",
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  margin: "0 !important",
                  backgroundColor: visualization.likedByUsers.some(
                    (u) =>
                      u.userId.toString() === localStorage.getItem("userId")
                  )
                    ? "#c62828"
                    : "white",
                  color: visualization.likedByUsers.some(
                    (u) =>
                      u.userId.toString() === localStorage.getItem("userId")
                  )
                    ? "white"
                    : "#b2b4b9",
                  "&:hover": {
                    backgroundColor: visualization.likedByUsers.some(
                      (u) =>
                        u.userId.toString() === localStorage.getItem("userId")
                    )
                      ? "#9b262e"
                      : "#e0e0e0",
                  },
                }}
                onClick={() => handleLike(visualization.visualizationId)}
              >
                {visualization.likedByUsers.some(
                  (u) => u.userId.toString() === localStorage.getItem("userId")
                ) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
                Like
              </Button>

              <Button
                name={`comment-${index}`}
                variant="outlined"
                sx={{
                  width: "33.3%",
                  backgroundColor: "white",
                  color: "#b2b4b9",
                  border: "1px solid black",
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "12px",
                  margin: "0 !important",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
                onClick={() => handleOpenModal(visualization)}
              >
                <CommentIcon />
                Comment
              </Button>

              <Button
                variant="outlined"
                sx={{
                  width: "33.3%",
                  backgroundColor: "white",
                  color: "#b2b4b9",
                  border: "1px solid black",
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "12px",
                  margin: "0 !important",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
                onClick={() => handleOpenReport(visualization)}
              >
                <ReportIcon />
                Report
              </Button>
            </>
          )}
        </CardActions>
      </Card>
      <CommentModal
        open={openModal}
        onClose={handleCloseModal}
        visualization={activeViz}
      />
      <ReportModal
        open={openReport}
        onClose={handleCloseReport}
        visualization={activeViz}
      />
    </>
  );
};

export default PostComponent;
