import { EmbeddedContext } from "../context/EmbeddedContext";
import { useEffect, useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import RendererFactory from "../../design/component/renderer/RendererFactory";
import mapVisualizationToInitialState from "../context/Mapper";
import {
  initializeVisualization,
  setData,
} from "../../design/component/state/context/actions";
import Papa from "papaparse";
import backend from "../../data-access/Backend";
import RenderingFailed from "../../common/image/rendering_failed.svg";

const EmbeddedComponent = ({ visualizationId, type }) => {
  const { state, dispatch } = useContext(EmbeddedContext);
  const [hasError, setHasError] = useState(false);

  const fetchGoogleSheetData = async (sheetUrl) => {
    if (
      !sheetUrl ||
      typeof sheetUrl !== "string" ||
      !sheetUrl.startsWith("http")
    ) {
      console.error("Invalid sheet URL:", sheetUrl);
      return null;
    }

    try {
      const url = new URL(sheetUrl);
      const parts = url.pathname.split("/");
      const sheetId = parts[3];
      const gidMatch = url.hash.match(/gid=(\d+)/);
      const gid = gidMatch ? gidMatch[1] : "0";

      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&_=${Date.now()}`;
      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error("Failed to fetch Google Sheet");

      const csvText = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          complete: (results) => {
            const cleanData = results.data.filter((row) =>
              row.some((cell) => cell !== "")
            );
            resolve(cleanData);
          },
          error: (err) => reject(err),
        });
      });
    } catch (err) {
      console.error("fetchGoogleSheetData error:", err);
      alert("Error loading Google Sheet");
      return null;
    }
  };

  const handleLoadGoogleSheet = async () => {
    const data = await fetchGoogleSheetData(state.sheetsLink);
    console.log(data);
    dispatch(setData(data));
  };

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

  useEffect(() => {
    if (
      state.visualizationModelId != null &&
      state.sheetsLink &&
      typeof state.sheetsLink === "string" &&
      state.sheetsLink.trim() !== ""
    ) {
      handleLoadGoogleSheet();
    }
  }, [state.sheetsLink]);

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
