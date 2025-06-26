import React, { lazy } from "react";
import { VisualizationIds } from "../../constant/VisualizationTypes";
import { Box } from "@mui/material";
import Sidebar from "../sidebar/Sidebar";
import AnnotationAccordion from "../sidebar/AnnotationAccordion";

const BarChartRenderer = lazy(() => import("./BarChartRenderer"));
const PieChartRenderer = lazy(() => import("./PieChartRenderer"));
const LineChartRenderer = lazy(() => import("./LineChartRenderer"));
const ScatterPlotRenderer = lazy(() => import("./ScatterPlotRenderer"));
const AreaChartRenderer = lazy(() => import("./AreaChartRenderer"));

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
const ScatterAccordion = lazy(() => import("../sidebar/ScatterAccordion"));
const AreaAccordion = lazy(() => import("../sidebar/AreaAccordion"));

const RendererFactory = ({ viz, state, showSidebar, isEmbed }) => {
  const sidebarSx = {
    width: "40%",
    overflowY: "scroll",
  };

  const boxXs = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  };

  const chartSx = {
    width: isEmbed ? "100%" : "80%",
    height: isEmbed ? "100%" : "80%",
    position: "absolute",
    top: 0,
    border: isEmbed ? "" : "2px solid #001f47",
  };

  const containerSx = {
    width: showSidebar ? "60%" : "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  };

  switch (viz) {
    case VisualizationIds.BAR_CHART:
      return (
        <Box style={boxXs}>
          <Box sx={containerSx}>
            <Box sx={chartSx}>
              <BarChartRenderer state={state} />
            </Box>
          </Box>
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
          <Box sx={containerSx}>
            <Box sx={chartSx}>
              <PieChartRenderer state={state} />
            </Box>
          </Box>
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
          <Box sx={containerSx}>
            <Box sx={chartSx}>
              <LineChartRenderer state={state} />
            </Box>
          </Box>
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

    case VisualizationIds.SCATTER_PLOT:
      return (
        <Box style={boxXs}>
          <Box sx={containerSx}>
            <Box sx={chartSx}>
              <ScatterPlotRenderer state={state} />
            </Box>
          </Box>
          {showSidebar && (
            <Sidebar look={sidebarSx}>
              <TitleAccordion />
              <FooterAccordion />
              <TextAccordion />
              <ColorAccordion />
              <ScatterAccordion />
              <AnnotationAccordion />
              <AxesAndGridsAccordion />
              <LegendAccordion />
            </Sidebar>
          )}
        </Box>
      );

    case VisualizationIds.AREA_CHART:
      return (
        <Box style={boxXs}>
          <Box sx={containerSx}>
            <Box sx={chartSx}>
              <AreaChartRenderer state={state} />
            </Box>
          </Box>
          {showSidebar && (
            <Sidebar look={sidebarSx}>
              <TitleAccordion />
              <FooterAccordion />
              <TextAccordion />
              <ColorAccordion />
              <AreaAccordion />
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
