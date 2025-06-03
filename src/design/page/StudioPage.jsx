import React, { useState } from "react";
import StageButton from "../component/ui/StageButton";
import Navbar from "../../common/component/Navbar";
import { Box } from "@mui/material";
import StateFactory from "../component/state/factory/StateFactory";
import { VisualizationProvider } from "../component/state/context/VisualizationContext";

const StudioPage = () => {
  const [state, setState] = useState("Import Data");

  return (
    <Box
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box
        sx={{
          padding: "0 5%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <StageButton number={1} text="Import Data" setState={setState} />
        <StageButton
          number={2}
          text="Customize Visualization"
          setState={setState}
        />
        <StageButton number={3} text="Share Your Work" setState={setState} />
      </Box>
      <VisualizationProvider>
        <StateFactory
          state={state}
          setState={setState}
          style={{ height: "100%", padding: "10% 0" }}
        />
      </VisualizationProvider>
    </Box>
  );
};

export default StudioPage;
