import React, { useState } from "react";
import StageButton from "../component/ui/StageButton";
import Navbar from "../../common/component/Navbar";
import { Box } from "@mui/material";
import StateFactory from "../component/state/StateFactory";

const StudioPage = () => {
  const [state, setState] = useState("Import Data");

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
        <StageButton number={1} text="Import Data" setState={setState} />
        <StageButton
          number={2}
          text="Customize Visualization"
          setState={setState}
        />
        <StageButton number={3} text="Share Your Work" setState={setState} />
      </Box>
      <StateFactory state={state} />
    </>
  );
};

export default StudioPage;
