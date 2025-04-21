import React from "react";
import { Button, Stack, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import backend from "../../data-access/Backend";
import Navbar from "../../common/component/Navbar";

const TemplatePage = () => {
  const vizType = ["Bar Chart", "Pie Chart"];
  const navigate = useNavigate();

  const handleClick = async (index) => {
    const viz = vizType[index].toUpperCase().replace(/\s+/g, "_");
    try {
      const response = await backend.post("/visualization", {
        viz_type: viz,
      });
      navigate(`/studio/${response.data.visualizationId}`, {
        state: { vizType: viz },
      });
    } catch (error) {
      console.log("Error toast placeholder");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "24px" }}>
        <Typography variant="h4" gutterBottom>
          Template Page
        </Typography>
        <Stack direction="row" spacing={2}>
          {vizType.map((type, index) => (
            <Button
              key={index}
              variant="contained"
              color="primary"
              onClick={() => handleClick(index)}
            >
              {type}
            </Button>
          ))}
        </Stack>
      </div>
    </>
  );
};

export default TemplatePage;
