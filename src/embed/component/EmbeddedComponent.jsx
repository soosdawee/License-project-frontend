import { EmbeddedContext } from "../context/EmbeddedContext";
import { useEffect, useContext, useState } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import RendererFactory from "../../design/component/renderer/RendererFactory";
import mapVisualizationToInitialState from "../context/Mapper";
import { initializeVisualization } from "../../design/component/state/context/actions";

const EmbeddedComponent = ({ visualizationId }) => {
  const { state, dispatch } = useContext(EmbeddedContext);

  console.log(state);

  useEffect(() => {
    const fetchVisualization = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/visualization/${visualizationId}`
        );
        dispatch(
          initializeVisualization(mapVisualizationToInitialState(response.data))
        );
      } catch (err) {
        console.log("GECIFASZ");
      }
    };

    fetchVisualization();
  }, [visualizationId]);

  return (
    <Box>
      {state?.visualizationModelId != null ? (
        <RendererFactory
          viz={state.visualizationModelId}
          state={state}
          showSidebar={false}
        />
      ) : (
        <p>Loading visualization...</p>
      )}
    </Box>
  );
};

export default EmbeddedComponent;
