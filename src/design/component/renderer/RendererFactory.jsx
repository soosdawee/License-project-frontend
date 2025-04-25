import React, { lazy } from "react";
import { VisualizationIds } from "../../constant/VisualizationTypes";

const BarChartRenderer = lazy(() => import("./BarChartRenderer"));
const PieChartRenderer = lazy(() => import("./PieChartRenderer"));

const RendererFactory = ({ viz }) => {
  switch (viz.visualizationModelId) {
    case VisualizationIds.BAR_CHART:
      return <BarChartRenderer />;
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

export default RendererFactory;
