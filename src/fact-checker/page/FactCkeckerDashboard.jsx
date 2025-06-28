import { useEffect, useState } from "react";
import backend from "../../data-access/Backend";
import { Stack, Box, Typography, Divider, Paper } from "@mui/material";
import PostComponent from "../../social/component/PostComponent";
import Navbar from "../../common/component/Navbar";

const FactCheckerDashboard = () => {
  const [vizList, setVizList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get("visualization/reported");
        setVizList(result.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        backgroundColor: "#f9f9fb",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: "100%",
        }}
      >
        <Navbar />
      </Box>

      <Stack spacing={3} sx={{ p: "2% 10%", mt: 8 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#001f47",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Visualizations for you to review
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
            }}
          >
            These visualizations were reported and need a moderator's attention.
          </Typography>
        </Paper>

        <Divider sx={{ mt: 2, mb: 1 }} />

        {vizList.map((viz) => (
          <PostComponent
            key={viz.visualizationId}
            visualization={viz}
            setVizList={setVizList}
            isUnderReview={true}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default FactCheckerDashboard;
