import React, { useContext } from "react";
import { VisualizationContext } from "../context/VisualizationContext";
import { Button, Typography } from "@mui/material";
import backend from "../../../../data-access/Backend";
import { useParams } from "react-router-dom";

const ShareState = () => {
  const { state } = useContext(VisualizationContext);
  const { id } = useParams();

  const handleShare = async () => {
    console.log(state.showLegend);
    const payload = {
      title: state.title,
      titleSize: state.titleSize,
      viz_type: state.vizType,
      font: state.font,
      article: state.article,
      articleSize: state.articleSize,
      backgroundColor: state.backgroundColor,
      showAnnotations: state.showAnnotations,
      isAnnotationCustom: state.isAnnotationCustom,
      customAnnotation: state.customAnnotation,
      isFooter: state.isFooter,
      footerText: state.footerText,
      opacity: state.opacity,
      textColor: state.textColor,
      xAxisLabel: state.xAxisLabel,
      yXxisLabel: state.yAxisLabel,
      areLabelsVisible: state.areLabelsVisible,
      showGrids: state.showGrids,
      barColor: state.barColor,
      customColors: state.customColors,
      spacing: state.barSpacing,
      showPercentages: state.showPercentages,
      colorPalette: state.colorPalette,
      showLegend: state.showLegend,
      transitionTime: state.transitionTime,
      visualizationModelId: id,
      tableDatas: [
        {
          data: state.data,
        },
      ],
    };

    try {
      const response = await backend.post("/visualization", payload);
      //alert(`Visualization created with ID: ${response.data.id}`);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the visualization.");
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Share Your Visualization
      </Typography>
      <Button variant="contained" color="primary" onClick={handleShare}>
        Share
      </Button>
    </div>
  );
};

export default ShareState;
