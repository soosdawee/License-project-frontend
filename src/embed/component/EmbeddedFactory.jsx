import React, { lazy } from "react";
import { VisualizationIds } from "../../design/constant/VisualizationTypes";
import { Box } from "@mui/material";

const BarChartRenderer = lazy(() =>
  import("../../design/component/renderer/BarChartRenderer")
);
const PieChartRenderer = lazy(() =>
  import("../../design/component/renderer/PieChartRenderer")
);

const EmbeddedFactory = ({ viz, state }) => {
  switch (viz) {
    case VisualizationIds.BAR_CHART:
      return (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
          }}
        >
          <BarChartRenderer
            style={{ width: "80%", height: "100%" }}
            state={state}
          />
        </Box>
      );
    case VisualizationIds.PIE_CHART:
      return <PieChartRenderer />;
    default:
      console.log(viz);
      return (
        <div>
          An error has occured, there is no renderer for this chart type!
        </div>
      );
  }
};

export default EmbeddedFactory;
