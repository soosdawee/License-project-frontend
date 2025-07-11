import { useState, useEffect } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import backend from "../../data-access/Backend";
import VisualizationModelCard from "./VisualizationModelCard"; // Adjust path

const VisualizationModelsComponent = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const result = await backend.get("/visualization_model");
      setModels(result.data);
    } catch (error) {
      console.error("Failed to fetch models", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 4 }}>
        All Visualization Models
      </Typography>

      {isLoading ? (
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
