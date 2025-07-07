import { useState, useEffect } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import backend from "../../data-access/Backend";
import VisualizationModelCard from "./VisualizationModelCard"; // Adjust path

const VisualizationModelsComponent = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const result = await backend.get("/visualization_model");
      setModels(result.data);
    } catch (error) {
      console.error("Failed to fetch models", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        All Visualization Models
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={4}>
          {models.map((model, index) => (
            <VisualizationModelCard
              key={model.id}
              model={model}
              onUpdated={fetchModels}
              index={index}
              setModels={setModels}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default VisualizationModelsComponent;
