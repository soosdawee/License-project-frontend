import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Grid } from "@mui/material";
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
      <Box sx={{ padding: "0 10%" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "left",
            fontSize: "2.5rem",
            margin: "1% 0",
            fontWeight: "bold",
            color: "#001f47",
          }}
        >
          Choose a chart or a map!
        </Typography>

        <Grid container spacing={4.5} alignItems="space-between">
          {vizType.map((viz) => (
            <Grid
              item
              key={viz.visualizationModelId}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleClick(viz.visualizationModelId)}
                sx={{
                  height: "170px",
                  width: "auto",
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
                <img
                  src={`data:image/svg+xml;base64,${viz.cardPhoto}`}
                  alt={viz.name}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "contain",
                  }}
                />
                {viz.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default TemplatePage;
