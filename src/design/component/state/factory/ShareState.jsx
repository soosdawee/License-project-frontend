import { useContext, Suspense, useRef } from "react";
import { VisualizationContext } from "../context/VisualizationContext";
import { Box, Button, Typography } from "@mui/material";
import backend from "../../../../data-access/Backend";
import { useParams } from "react-router-dom";
import PublishIcon from "@mui/icons-material/Publish";
import DownloadIcon from "@mui/icons-material/Download";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import ShareIcon from "@mui/icons-material/Share";
import html2canvas from "html2canvas";
import RendererFactory from "../../renderer/RendererFactory";
import {
  setModified,
  setPublished,
  setSaved,
  setShared,
  setVisualizationId,
} from "../context/actions";

const ShareState = ({ visualizationModel }) => {
  const { state, dispatch } = useContext(VisualizationContext);
  const { id } = useParams();
  const { visualizationId } = useParams();
  const chartRef = useRef();

  const handleShare = async () => {
    console.log(state.sheetsLink);
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
      xaxisLabel: state.xAxisLabel,
      yaxisLabel: state.yAxisLabel,
      areLabelsVisible: state.areLabelsVisible,
      showGrids: state.showGrids,
      barColor: state.barColor,
      customColors: state.customColors,
      spacing: state.barSpacing,
      showPercentages: state.showPercentages,
      colorPalette: state.colorPalette,
      showLegend: state.showLegend,
      transitionTime: state.transitionTime,
      isPublished: state.published,
      isShared: state.shared,
      visualizationModelId: id,
      tableDatas: [
        {
          data: state.data,
          sheetsLink: state.sheetsLink,
        },
        {
          data: state.historical,
        },
      ],
    };

    try {
      if (!state.saved) {
        const response = await backend.post("/visualization", payload);
        dispatch(setVisualizationId(response.data.visualizationId));
        dispatch(setSaved(true));
      } else {
        await backend.put(
          `/visualization/${
            state.visualizationId == 0 ? visualizationId : state.visualizationId
          }`,
          payload
        );
        dispatch(setModified(false));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the visualization.");
    }
  };

  const handleDownload = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, {
        useCORS: true,
        backgroundColor: null,
        logging: true,
      });
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to generate PNG. Some resources might be blocking it.");
    }
  };

  const handlePublish = async () => {
    dispatch(setPublished(!state.published));
    await backend.put(
      `visualization/${visualizationId ?? state.visualizationId}/published`
    );
  };

  const handleSharing = async () => {
    dispatch(setShared(!state.shared));
    await backend.put(
      `visualization/${visualizationId ?? state.visualizationId}/shared`
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "60%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        ref={chartRef}
      >
        <Suspense fallback={<div></div>}>
          <RendererFactory
            viz={visualizationModel.visualizationModelId}
            state={state}
            showSidebar={false}
            isEmbed={false}
          />
        </Suspense>
      </div>

      <Box
        sx={{
          height: "100%",
          width: "40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
        }}
      >
        <Box
          sx={{
            width: "87%",
            height: "7%",
            display: "flex",
            flexDirection: "row",
            justifyItems: "space-between",
            alignItems: "center",
            border: state.modified ? "2px dashed #001f47" : "2px dashed #ccc",
            padding: "3%  2%",
            borderRadius: 2,
          }}
        >
          <Typography sx={{ width: "60%", textAlign: "left" }}>
            Save your work so you can access it in the future!
          </Typography>
          <Button
            name="save-button"
            variant="contained"
            onClick={handleShare}
            disabled={!state.modified}
            sx={{
              height: "100%",
              width: "40%",
              backgroundColor: state.modified ? "#007FA7" : "#f0f0f0",
              color: "white",
              border: "1px solid black",
              textTransform: "none",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "12px",
              "&:hover": {
                backgroundColor: state.modified ? "#007393" : "#f0f0f0",
              },
              cursor: state.modified ? "pointer" : "not-allowed",
            }}
          >
            <PublishIcon />
            Save
          </Button>
        </Box>
        <Box
          sx={{
            width: "87%",
            height: "7%",
            display: "flex",
            flexDirection: "row",
            justifyItems: "space-between",
            alignItems: "center",
            padding: "3%  2%",
          }}
        >
          <Typography sx={{ width: "60%", textAlign: "left" }}>
            Download your work as PNG!
          </Typography>
          <Button
            variant="outlined"
            disabled={!state.saved}
            onClick={handleDownload}
            sx={{
              height: "100%",
              width: "40%",
              textTransform: "none",
              mt: 1,
              outlineColor: "#007fa7",
              border: "1px solid #007fa7",
              color: "#007fa7",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "12px",
              transition: "background-color 0.3s ease",
            }}
          >
            <DownloadIcon />
            Download
          </Button>
        </Box>
        <Box
          sx={{
            width: "87%",
            height: "7%",
            display: "flex",
            flexDirection: "row",
            justifyItems: "space-between",
            alignItems: "center",
            padding: "3%  2%",
          }}
        >
          <Typography sx={{ width: "60%", textAlign: "left" }}>
            Share your visualization with like-minded individuals!
          </Typography>
          <Button
            variant="outlined"
            disabled={!state.saved}
            onClick={handleSharing}
            sx={{
              height: "100%",
              width: "40%",
              textTransform: "none",
              mt: 1,
              outlineColor: "#007fa7",
              border: "1px solid #007fa7",
              color: "#007fa7",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "12px",
              transition: "background-color 0.3s ease",
            }}
          >
            <ShareIcon />
            {state.shared ? "Shared" : "Share"}
          </Button>
        </Box>
        <Box
          sx={{
            width: "87%",
            height: "7%",
            display: "flex",
            flexDirection: "row",
            justifyItems: "space-between",
            alignItems: "center",
            padding: "3%  2%",
          }}
        >
          <Typography sx={{ width: "60%", textAlign: "left" }}>
            Publish your visualization!
          </Typography>
          <Button
            variant="outlined"
            disabled={!state.saved}
            onClick={handlePublish}
            sx={{
              height: "100%",
              width: "40%",
              textTransform: "none",
              mt: 1,
              outlineColor: "#007fa7",
              border: "1px solid #007fa7",
              color: "#007fa7",
              transition: "background-color 0.3s ease",
            }}
          >
            {state.published == false ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <PublishedWithChangesIcon />
                Publish
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <UnpublishedIcon />
                Unpublish
              </div>
            )}
          </Button>
        </Box>
        {state.published && (
          <Box
            sx={{
              width: "87%",
              height: "30%",
              display: "flex",
              flexDirection: "column",
              padding: "0  3%",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                textAlign: "left",
                width: "100%",
                height: "20%",
                margin: 0,
                padding: 0,
                fonstSize: "16px",
              }}
            >
              Links to Share and Embed
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "30%",
                width: "100%",
                gap: "5%",
              }}
            >
              <input
                readOnly
                value={`<iframe src="http://localhost:3000/visualization/${
                  visualizationId ?? state.visualizationId
                }/embed" title=${
                  state?.title && state?.title.length > 0
                    ? state.title
                    : "Untitled Visualization"
                } style="height: 600px; width: 100%; border: none;" allowtransparency="true"></iframe>`}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  height: "70%",
                  fontSize: "14px",
                  borderRadius: "4px",
                  outline: "none",
                  "&:focus": {
                    border: "1px solid #007fa7",
                    outlineColor: "#007fa7",
                  },
                }}
              />
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `<iframe src="http://localhost:3000/visualization/${
                      visualizationId ?? state.visualizationId
                    }/embed" title=${
                      state?.title && state?.title.length > 0
                        ? state.title
                        : "Untitled Visualization"
                    } style="height: 600px; width: 100%; border: none;" allowtransparency="true"></iframe>`
                  )
                }
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  height: "70%",
                  width: "auto",
                  backgroundColor: "#007fa7",
                }}
              >
                <ContentCopyIcon />
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "30%",
                width: "100%",
                gap: "5%",
              }}
            >
              <input
                readOnly
                value={`<script src="http://localhost:3000/embed.js" data-id="${
                  visualizationId ?? state.visualizationId
                }"></script>`}
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  height: "70%",
                  fontSize: "14px",
                  borderRadius: "4px",
                  outline: "none",
                  "&:focus": {
                    border: "1px solid #007fa7",
                    outlineColor: "#007fa7",
                  },
                }}
              />
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `<script src="http://localhost:3000/embed.js" data-id="${
                      visualizationId ?? state.visualizationId
                    }"></script>`
                  )
                }
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  height: "70%",
                  width: "auto",
                  backgroundColor: "#007fa7",
                }}
              >
                <ContentCopyIcon />
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ShareState;
