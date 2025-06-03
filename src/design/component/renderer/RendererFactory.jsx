import React, { lazy } from "react";
import { VisualizationIds } from "../../constant/VisualizationTypes";
import { Box } from "@mui/material";
import Sidebar from "../sidebar/Sidebar";
import AnnotationAccordion from "../sidebar/AnnotationAccordion";

const BarChartRenderer = lazy(() => import("./BarChartRenderer"));
const PieChartRenderer = lazy(() => import("./PieChartRenderer"));
const TitleAccordion = lazy(() => import("../sidebar/TitleAccordion"));
const ColorAccordion = lazy(() => import("../sidebar/ColorAccordion"));
const BarAccordion = lazy(() => import("../sidebar/BarAccordion"));
const FooterAccordion = lazy(() => import("../sidebar/FooterAccordion"));
const TextAccordion = lazy(() => import("../sidebar/TextAccordion"));

const AxesAndGridsAccordion = lazy(() =>
  import("../sidebar/AxesAndGridsAccordion")
);

const RendererFactory = ({ viz, state }) => {
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
          <BarChartRenderer state={state} />
          <Sidebar>
            <TitleAccordion />
            <FooterAccordion />
            <TextAccordion />
            <ColorAccordion />
            <BarAccordion />
            <AnnotationAccordion />
            <AxesAndGridsAccordion />
          </Sidebar>
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

export default RendererFactory;
