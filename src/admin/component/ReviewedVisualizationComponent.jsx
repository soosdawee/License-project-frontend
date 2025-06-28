import { useEffect, useState } from "react";
import { Stack, Typography, IconButton, Box, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import backend from "../../data-access/Backend";
import PostComponent from "../../social/component/PostComponent";

const ReviewedVisualizationsComponent = () => {
  const [visualizations, setVisualizations] = useState([]);

  useEffect(() => {
    const fetchVisualizations = async () => {
      try {
        const response = await backend.get(
          "/visualization/reviewed_negatively"
        );
        setVisualizations(response.data);
      } catch (error) {
        console.error("Failed to fetch visualizations", error);
      }
    };
    fetchVisualizations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await backend.delete(`/visualization/${id}`);
      setVisualizations((prev) =>
        prev.filter((viz) => viz.visualizationId !== id)
      );
    } catch (error) {
      console.error("Failed to delete visualization", error);
    }
  };

  return (
    <Stack spacing={2} sx={{ display: "flex", alignItems: "center" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" sx={{ color: "#001f47", fontWeight: "bold" }}>
          These visualizations have been evaluated negatively by Fact-checkers!
        </Typography>
      </Paper>

      {visualizations.length === 0 ? (
        <Typography>No negatively reviewed visualizations found.</Typography>
      ) : (
        visualizations.map((viz) => (
          <Stack
            key={viz.id}
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            width="100%"
          >
            <Box
              sx={{
                width: "80%",
                display: "flex",
                felxDirection: "row",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <PostComponent
                visualization={viz}
                setVizList={setVisualizations}
              />
              <IconButton
                color="error"
                onClick={() => handleDelete(viz.visualizationId)}
                aria-label="delete visualization"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Stack>
        ))
      )}
    </Stack>
  );
};

export default ReviewedVisualizationsComponent;
