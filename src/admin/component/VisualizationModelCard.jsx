import { useState } from "react";
import {
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import backend from "../../data-access/Backend";

const VisualizationModelCard = ({ model, onUpdated, index, setModels }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: model.name,
    columns: model.columnNames.join(", "),
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await backend.patch(
        `/visualization_model/${model.visualizationModelId}`,
        {
          name: formData.name,
          columnNames: formData.columns.split(",").map((c) => c.trim()),
        }
      );
      setIsEditing(false);
      onUpdated();
    } catch (error) {
      console.error("Failed to update model", error);
    }
  };

  const handleDelete = async (visualizationModelId) => {
    try {
      await backend.delete(`/visualization_model/${visualizationModelId}`);
      setModels((prev) =>
        prev.filter((m) => m.visualizationModelId !== visualizationModelId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 3, backgroundColor: "white" }}
    >
      <Stack spacing={2}>
        <img
          src={`data:image/svg+xml;base64,${model.cardPhoto}`}
          alt={model.name}
          style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
        />

        {isEditing ? (
          <>
            <TextField
              name={`model-${index}`}
              label="Model Name"
              value={formData.name}
              onChange={handleChange("name")}
              sx={{
                "& label.Mui-focused": {
                  color: "#007393",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#007393",
                  },
                },
              }}
              fullWidth
            />
            <TextField
              label="Column Names"
              value={formData.columns}
              onChange={handleChange("columns")}
              sx={{
                "& label.Mui-focused": {
                  color: "#007393",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#007393",
                  },
                },
              }}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <Button
                name={`save-button-${index}`}
                variant="contained"
                sx={{ backgroundColor: "#007fa7" }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "#007fa7", border: "1px solid #007fa7" }}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Typography variant="h6">{model.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Columns: {model.columnNames.join(", ")}
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                name={`edit-button-${index}`}
                variant="outlined"
                sx={{
                  color: "#001f47",
                  border: "1px solid #001f47",
                  width: "49%",
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>

              <Button
                name={`delete-button-${index}`}
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "#c82c2c",
                  width: "49%",
                }}
                onClick={() => handleDelete(model.visualizationModelId)}
              >
                Delete
              </Button>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default VisualizationModelCard;
