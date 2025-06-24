import { useEffect, useState, useRef } from "react";
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
  Stack,
  Box,
} from "@mui/material";
import CommentModal from "./CommentModal";
import ReportModal from "./ReportModal";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReportIcon from "@mui/icons-material/Report";

const SocialComponent = () => {
  const [vizList, setVizList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeViz, setActiveViz] = useState(null);
  const [openReport, setOpenReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get("visualization/shared");
        setVizList(result.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (viz) => {
    setActiveViz(viz);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setActiveViz(null);
  };

  const handleOpenReport = (viz) => {
    setActiveViz(viz);
    setOpenReport(true);
  };

  const handleCloseReport = () => {
    setOpenReport(false);
    setActiveViz(null);
  };

  const getElapsedTime = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInSeconds = Math.floor((now - created) / 1000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return rtf.format(-diffInMinutes, "minute");
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return rtf.format(-diffInHours, "hour");
    const diffInDays = Math.floor(diffInHours / 24);
    return rtf.format(-diffInDays, "day");
  };

  const handleLike = async (visualizationId) => {
    try {
      await backend.post(`user/${visualizationId}/like`);

      const userId = parseInt(localStorage.getItem("userId"), 10); // Ensure number

      setVizList((prevList) =>
        prevList.map((viz) => {
          if (viz.visualizationId !== visualizationId) return viz;

          const alreadyLiked = viz.likedByUsers.some(
            (u) => u.userId === userId
          );

          const updatedLikedByUsers = alreadyLiked
            ? viz.likedByUsers.filter((u) => u.userId !== userId) // unlike
            : [...viz.likedByUsers, { userId }]; // like

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

  return (
    <>
      <Stack spacing={3} sx={{ p: "2% 5%", overflow: "auto" }}>
        {vizList.map((viz) => (
          <Card
            key={viz.visualizationId}
            sx={{ height: "70vh", display: "flex", flexDirection: "column" }}
          >
            <AppBar
              position="static"
              sx={{ borderRadius: "4px 4px 0 0", backgroundColor: "#007FA7" }}
            >
              <Toolbar
                sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "white", color: "#001f47" }}>
                    {viz.user.firstname[0].toUpperCase()}
                    {viz.user.lastname[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="h6">
                    {viz.user.lastname} {viz.user.firstname}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "0.85rem" }}>
                  {getElapsedTime(viz.timestamp)}
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent sx={{ flex: "1 1 85%", overflow: "hidden", p: 0 }}>
              <Box sx={{ height: "100%", width: "100%" }}>
                <iframe
                  src={`http://localhost:3000/visualization/${viz.visualizationId}/embed`}
                  title={`Visualization ${viz.visualizationId}`}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
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
              <Button
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
                  backgroundColor: viz.likedByUsers.some(
                    (u) =>
                      u.userId.toString() === localStorage.getItem("userId")
                  )
                    ? "#c62828"
                    : "white",
                  color: viz.likedByUsers.some(
                    (u) =>
                      u.userId.toString() === localStorage.getItem("userId")
                  )
                    ? "white"
                    : "black",
                  "&:hover": {
                    backgroundColor: viz.likedByUsers.some(
                      (u) =>
                        u.userId.toString() === localStorage.getItem("userId")
                    )
                      ? "#9b262e"
                      : "#e0e0e0",
                  },
                }}
                onClick={() => handleLike(viz.visualizationId)}
              >
                {viz.likedByUsers.some(
                  (u) => u.userId.toString() === localStorage.getItem("userId")
                ) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
                Like
              </Button>

              <Button
                variant="outlined"
                sx={{
                  width: "33.3%",
                  backgroundColor: "white",
                  color: "#001f47",
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
                onClick={() => handleOpenModal(viz)}
              >
                <CommentIcon />
                Comment
              </Button>
              <Button
                variant="outlined"
                sx={{
                  width: "33.3%",
                  backgroundColor: "white",
                  color: "#001f47",
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
                onClick={() => handleOpenReport(viz)}
              >
                <ReportIcon />
                Report
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>

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

export default SocialComponent;
