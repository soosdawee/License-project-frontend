import React, { useEffect, useState } from "react";
import DataState from "./DataState";
import CustomizationState from "./CustomizationState";
import ShareState from "./ShareState";
import { useParams } from "react-router-dom";
import backend from "../../../data-access/Backend";

const StateFactory = ({ state, setState }) => {
  const [tableData, setTableData] = useState([["", "", ""]]);
  const { id } = useParams();
  const [visualizationModel, setvisualizationModel] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.get(`visualization_model/${id}`);
        setvisualizationModel(result.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [id]);

  switch (state) {
    case "Import Data":
      return (
        <DataState
          visualizationModel={visualizationModel}
          tableData={tableData}
          setTableData={setTableData}
          setState={setState}
        />
      );
    case "Customize Visualization":
      return (
        <CustomizationState
          visualizationModel={visualizationModel}
          tableData={tableData}
        />
      );
    case "Share Your Work":
      return <ShareState />;
    default:
      console.log(state);
      return <div>An error has occured, there is no state!</div>;
  }
};

export default StateFactory;
