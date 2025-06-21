import React, { useState, useEffect } from "react";
import { Button, Stack, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import backend from "../../data-access/Backend";
import Navbar from "../../common/component/Navbar";

const TemplatePage = () => {
  const [vizType, setVizType] = useState([]);
  const navigate = useNavigate();

  const handleClick = (index) => {
    navigate(`/studio/${index}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get("visualization_model");
        setVizType(result.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "24px" }}>
        <Typography variant="h4" gutterBottom>
          Choose from the visualizations above!
        </Typography>
        <Stack direction="row" spacing={2}>
          {vizType.map((viz) => (
            <Button
              key={viz.visualizationModelId}
              variant="contained"
              onClick={() => handleClick(viz.visualizationModelId)}
              sx={{
                textTransform: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                padding: 2,
                backgroundColor: "white",
                color: "#001f47",
                fontWeight: "bold",
              }}
            >
              <img
                src={`data:image/svg+xml;base64,${viz.cardPhoto}`}
                alt={viz.name}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                }}
              />
              {viz.name}
            </Button>
          ))}
        </Stack>
      </div>
    </>
  );
};

export default TemplatePage;
