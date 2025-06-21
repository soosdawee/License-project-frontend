import React, { lazy } from "react";
import { VisualizationIds } from "../../constant/VisualizationTypes";
import { Box } from "@mui/material";
import Sidebar from "../sidebar/Sidebar";
import AnnotationAccordion from "../sidebar/AnnotationAccordion";

const BarChartRenderer = lazy(() => import("./BarChartRenderer"));
const PieChartRenderer = lazy(() => import("./PieChartRenderer"));
const LineChartRenderer = lazy(() => import("./LineChartRenderer"));

const TitleAccordion = lazy(() => import("../sidebar/TitleAccordion"));
const ColorAccordion = lazy(() => import("../sidebar/ColorAccordion"));
const BarAccordion = lazy(() => import("../sidebar/BarAccordion"));
const FooterAccordion = lazy(() => import("../sidebar/FooterAccordion"));
const TextAccordion = lazy(() => import("../sidebar/TextAccordion"));
const AxesAndGridsAccordion = lazy(() =>
  import("../sidebar/AxesAndGridsAccordion")
);
const PieAccordion = lazy(() => import("../sidebar/PieAccordion"));
const LegendAccordion = lazy(() => import("../sidebar/LegendAccordion"));

const sidebarSx = {
  flex: 4,
  overflowY: "scroll",
};

const chartSx = {
  flex: 6,
  position: "relative",
};

const boxXs = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  height: "100%",
  overflow: "hidden",
};

const RendererFactory = ({ viz, state, showSidebar }) => {
  switch (viz) {
    case VisualizationIds.BAR_CHART:
      return (
        <Box style={boxXs}>
          <BarChartRenderer state={state} look={chartSx} />
          {showSidebar && (
            <Sidebar look={sidebarSx}>
              <TitleAccordion />
              <FooterAccordion />
              <TextAccordion />
              <ColorAccordion />
              <BarAccordion />
              <AnnotationAccordion />
              <AxesAndGridsAccordion />
            </Sidebar>
          )}
        </Box>
      );

    case VisualizationIds.PIE_CHART:
      return (
        <Box style={boxXs}>
          <PieChartRenderer state={state} look={chartSx} />
          {showSidebar && (
            <Sidebar look={sidebarSx}>
              <TitleAccordion />
              <FooterAccordion />
              <TextAccordion />
              <ColorAccordion />
              <PieAccordion />
              <AnnotationAccordion />
              <LegendAccordion />
            </Sidebar>
          )}
        </Box>
      );

    case VisualizationIds.LINE_CHART:
      return (
        <Box style={boxXs}>
          <LineChartRenderer state={state} look={chartSx} />
          {showSidebar && (
            <Sidebar look={sidebarSx}>
              <TitleAccordion />
              <FooterAccordion />
              <TextAccordion />
              <ColorAccordion />
              <PieAccordion />
              <AnnotationAccordion />
              <AxesAndGridsAccordion />
              <LegendAccordion />
            </Sidebar>
          )}
        </Box>
      );

    default:
      console.log(viz);
      return (
        <div>
          An error has occurred, there is no renderer for this chart type!
        </div>
      );
  }
};

export default RendererFactory;
