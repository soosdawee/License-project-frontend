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

  console.log(visualizations);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        backgroundColor: "#f9f9f9",
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
          height: "90%",
          width: "100%",
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
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowX: "hidden",
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            justifyContent: "center",
            padding: "20px",
            gap: "20px",
            width: "90%",
          }}
        >
          {visualizations.map((viz, index) => (
            <Box
              sx={{
                position: "relative",
                "&:hover .delete-btn": {
                  opacity: 1,
                },
              }}
            >
              <Button
                name={`visualization-${index}`}
                fullWidth
                variant="contained"
                onClick={() => handleClick(viz)}
                sx={{
                  height: "150px",
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
                  margin: "10px",
                }}
              >
                <Typography sx={{ color: "#001f47", fontWeight: "bold" }}>
                  {(viz.title?.length ?? 0) > 0
                    ? viz.title
                    : "Untitled Visualization"}
                </Typography>
                <Typography sx={{ color: "#001f47" }}>
                  {viz.visualizationModelReducedViewDto.name}
                </Typography>
                <Typography sx={{ color: "#a8a8a8" }}>
                  {calculateTime(viz.timestamp)}
                </Typography>
              </Button>

              <Button
                name="delete-button"
                variant="contained"
                size="small"
                color="error"
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(viz.visualizationId);
                }}
                sx={{
                  position: "absolute",
                  top: 15,
                  right: 0,
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
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default VisualizationsPage;
