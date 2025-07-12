import { EmbeddedContext } from "../context/EmbeddedContext";
import { useEffect, useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import RendererFactory from "../../design/component/renderer/RendererFactory";
import mapVisualizationToInitialState from "../context/Mapper";
import { initializeVisualization } from "../../design/component/state/context/actions";
import backend from "../../data-access/Backend";
import RenderingFailed from "../../common/image/rendering_failed.svg";

const EmbeddedComponent = ({ visualizationId, type }) => {
  const { state, dispatch } = useContext(EmbeddedContext);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchVisualization = async () => {
      try {
        let response;
        if (type === "shared") {
          response = await backend.get(
            `visualization/shared/${visualizationId}`
          );
        } else if (type === "published") {
          response = await axios.get(
            `http://localhost:8080/visualization/published/${visualizationId}`
          );
        } else {
          response = await backend.get(`visualization/${visualizationId}`);
        }

        dispatch(
          initializeVisualization(mapVisualizationToInitialState(response.data))
        );
      } catch (err) {
        console.error("Failed to load visualization:", err);
        setHasError(true);
      }
    };

    fetchVisualization();
  }, [visualizationId]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        m: 0,
        p: 0,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "transparent",
      }}
    >
      {hasError ? (
        <>
          <img
            src={RenderingFailed}
            alt="Visualization failed to load"
            style={{ maxWidth: "500px", width: "80%" }}
          />
          <Typography variant="h6" mt={2}>
            There was an error loading the visualization.
          </Typography>
        </>
      ) : state?.visualizationModelId != null ? (
        <RendererFactory
          viz={state.visualizationModelId}
          state={state}
          showSidebar={false}
          isEmbed={true}
        />
      ) : (
        <Typography variant="body1">Loading visualization...</Typography>
      )}
    </Box>
  );
};

export default EmbeddedComponent;
