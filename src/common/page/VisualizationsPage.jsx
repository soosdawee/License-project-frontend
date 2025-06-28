import { useEffect, useState } from "react";
import { Box, Grid, Button, Divider, Typography } from "@mui/material";
import Navbar from "../component/Navbar";
import backend from "../../data-access/Backend";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const handleDelete = async (visualizationId) => {
    try {
      await backend.delete(`visualization/${visualizationId}`);
      setVisualizations((prev) =>
        prev.filter((v) => v.visualizationId !== visualizationId)
      );
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
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
          overflowX: "hidden",
        }}
      >
        <Navbar />
      </Box>
      <Box
        sx={{
          marginTop: "5%",
          padding: "0 10%",
          overflowX: "hidden",
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
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflowX: "hidden",
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
                <Box
                  sx={{
                    width: "100%",
                    position: "relative",
                    "&:hover .delete-btn": {
                      opacity: 1,
                    },
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

                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering main button
                      handleDelete(viz.visualizationId);
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      zIndex: 10,
                      minWidth: "unset",
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default VisualizationsPage;
