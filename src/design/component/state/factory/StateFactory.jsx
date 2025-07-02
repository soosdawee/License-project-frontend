import React, { useEffect, useState, useContext } from "react";
import DataState from "./DataState";
import CustomizationState from "./CustomizationState";
import ShareState from "./ShareState";
import { useParams } from "react-router-dom";
import backend from "../../../../data-access/Backend";
import { VisualizationNames } from "../../../constant/VisualizationTypes";
import { setVisualizationType } from "../context/actions";
import { VisualizationContext } from "../context/VisualizationContext";
import {
  resetState,
  initializeVisualization,
  setHistorical,
} from "../context/actions";
import mapVisualizationToInitialState from "../../../../embed/context/Mapper";

const StateFactory = ({ state, setState }) => {
  const { id } = useParams();
  const { visualizationId } = useParams();
  const [visualizationModel, setvisualizationModel] = useState("");
  const { dispatch } = useContext(VisualizationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get(`visualization_model/${id}`);
        setvisualizationModel(result.data);
        dispatch(
          setVisualizationType(
            VisualizationNames[result.data.visualizationModelId]
          )
        );
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get(`visualization/${visualizationId}`);
        if (response.data.visualizationModelId === 36) {
          dispatch(setHistorical(response.data.tableDatas[1].data));
        }
        dispatch(
          initializeVisualization(mapVisualizationToInitialState(response.data))
        );
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    if (visualizationId) {
      fetchData();
    } else {
      dispatch(resetState());
    }
  }, []);

  switch (state) {
    case "Import Data":
      return (
        <DataState
          visualizationModel={visualizationModel}
          setState={setState}
        />
      );
    case "Customize Visualization":
      return <CustomizationState visualizationModel={visualizationModel} />;
    case "Share Your Work":
      return <ShareState visualizationModel={visualizationModel} />;
    default:
      console.log(state);
      return <div>An error has occured, there is no state!</div>;
  }
};

export default StateFactory;
