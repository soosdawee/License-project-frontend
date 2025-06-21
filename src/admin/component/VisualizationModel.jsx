import { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import backend from "../../data-access/Backend";

const VisualizationModel = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState("");
  const [name, setName] = useState("");
  const [imageSrc, setImageSrc] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get("visualization_model/26");
        setImageSrc(`data:image/svg+xml;base64,${result.data.cardPhoto}`);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <input type="file" accept="*/*" onChange={handleFileChange} />
      <TextField
        label="Column names (comma-separated)"
        value={columns}
        onChange={(e) => setColumns(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleUpload}>
        Upload Model
      </Button>
      {imageSrc ? (
        <img src={imageSrc} alt="Card preview" style={{ maxWidth: "100%" }} />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default VisualizationModel;
