import React, { lazy } from "react";

const BarChartRenderer = lazy(() => import("./BarChartRenderer"));
const PieChartRenderer = lazy(() => import("./PieChartRenderer"));

const RendererFactory = (vizType) => {
  switch (vizType.vizType) {
    case "BAR_CHART":
      return <BarChartRenderer />;
    case "PIE_CHART":
      return <PieChartRenderer />;
    default:
      console.log(vizType);
      return (
        <div>
          An error has occured, there is no renderer for this chart type!
        </div>
      );
  }
};

export default RendererFactory;
