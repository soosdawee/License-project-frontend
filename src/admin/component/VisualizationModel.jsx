import { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Box,
} from "@mui/material";
import VisualizationModelsComponent from "./VisualizationModelsComponent";

const VisualizationModel = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState("");
  const [name, setName] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const token = localStorage.jwt;

    const visualizationModelCreateDto = {
      columnNames: columns.split(",").map((col) => col.trim()),
      name: name,
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "visualizationModelCreateDto",
      new Blob([JSON.stringify(visualizationModelCreateDto)], {
        type: "application/json",
      })
    );

    try {
      await axios.post("http://localhost:8080/visualization_model", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        overflowY: "auto",
      }}
    >
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
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight="bold" color="#001f47">
            Upload Visualization Model
          </Typography>

          <Button
            variant="outlined"
            component="label"
            sx={{ color: "#007fa7", border: "1px solid #007fa7" }}
          >
            {file ? file.name : "Choose File"}
            <input
              type="file"
              accept="*/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          <TextField
            label="Model Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
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
          />

          <TextField
            label="Column names (comma-separated)"
            value={columns}
            onChange={(e) => setColumns(e.target.value)}
            fullWidth
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
          />

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || !name || !columns}
            backgroundColor="#001f47"
          >
            Upload Model
          </Button>
        </Stack>
      </Paper>
      <VisualizationModelsComponent />
    </Box>
  );
};

export default VisualizationModel;
