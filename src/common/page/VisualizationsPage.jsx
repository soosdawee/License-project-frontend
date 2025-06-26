import { useEffect, useState } from "react";
import { Box, Grid, Button, Divider, Typography } from "@mui/material";
import Navbar from "../component/Navbar";
import backend from "../../data-access/Backend";
import { useNavigate } from "react-router-dom";

const VisualizationsPage = () => {
  const navigate = useNavigate();
  const [visualizations, setVisualizations] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get("visualization");
        setVisualizations(result.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (viz) => {
    navigate(
      `/studio/${viz.visualizationModelReducedViewDto.visualizationModelId}/${viz.visualizationId}`
    );
  };

  console.log(visualizations);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
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
      <Box
        sx={{
          width: "100%",
          marginTop: "5%",
          padding: "0 10%",
          overflowY: "hidden",
        }}
      >
        <Typography
          sx={{
            fontSize: "3rem",
            textAlign: "left",
            color: "#001f47",
            fontWeight: "bold",
          }}
        >
          My Visualizations
        </Typography>
      </Box>
      <Box
        sx={{
          padding: "2% 18%",
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "hidden",
          }}
        >
          <Grid container spacing={2} justifyContent="space-between">
            {visualizations.map((viz) => (
              <Grid
                item
                key={viz.visualizationId}
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleClick(viz)}
                  sx={{
                    height: "300px",
                    aspectRatio: 1,
                    textTransform: "none",
                    flexDirection: "column",
                    gap: 1,
                    padding: 1,
                    backgroundColor: "white",
                    color: "#001f47",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
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
                      src={`http://localhost:3000/visualization/${viz.visualizationId}/created`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                        pointerEvents: "none",
                      }}
                      allowFullScreen
                    ></iframe>
                  </Box>
                  {(viz.title?.length ?? 0) > 0
                    ? viz.title
                    : "Untitled Visualization"}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default VisualizationsPage;
