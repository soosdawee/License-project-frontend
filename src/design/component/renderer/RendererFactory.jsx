import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import backend from "../../../data-access/Backend";

const BarChartRenderer = lazy(() => import("./BarChartRenderer"));
const PieChartRenderer = lazy(() => import("./PieChartRenderer"));

const fetchData = async (visualizationId) => {
  return await backend.get(`visualization/${visualizationId}`);
};

const RendererFactory = (vizType) => {
  const { visualizationId } = useParams();
  const data = fetchData(visualizationId);

  switch (vizType.vizType) {
    case "BAR_CHART":
      return <BarChartRenderer data={data} />;
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
