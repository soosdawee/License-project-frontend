import React from "react";
import RendererFactory from "../renderer/RendererFactory";

const DataState = ({ visualizationModel }) => {
  return (
    <div>
      <RendererFactory viz={visualizationModel} />
    </div>
  );
};

export default DataState;
