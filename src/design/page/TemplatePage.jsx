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
        <Typography variant="h4" gutterBottom>
          Choose from the visualizations above!
        </Typography>

        <Grid container spacing={2} alignItems="flex-start">
          {vizType.map((viz) => (
            <Grid
              item
              key={viz.visualizationModelId}
              xs={12}
              sm={6}
              md={4}
              lg={2.4} // 100 / 5 = 20, so 2.4 to evenly distribute across 5 columns (MUI hack)
              sx={{ display: "flex", justifyContent: "flex-start" }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleClick(viz.visualizationModelId)}
                sx={{
                  height: "180px",
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
