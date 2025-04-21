import React from "react";
import { useLocation } from "react-router-dom";
import RendererFactory from "../component/renderer/RendererFactory";
import StageButton from "../component/ui/StageButton";
import Navbar from "../../common/component/Navbar";
import { Box } from "@mui/material";

const StudioPage = () => {
  const location = useLocation();
  const { vizType } = location.state || {};

  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: "0 5%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <StageButton number={1} text="Choose a visualization" />
        <StageButton number={1} text="Choose a visualization" />
        <StageButton number={1} text="Choose a visualization" />
        <StageButton number={1} text="Choose a visualization" />
      </Box>
      <RendererFactory vizType={vizType} />
    </>
  );
};

export default StudioPage;
