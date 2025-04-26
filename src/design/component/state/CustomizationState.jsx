import React from "react";
import RendererFactory from "../renderer/RendererFactory";

const CustomizationState = ({ visualizationModel, tableData }) => {
  return (
    <div>
      <RendererFactory viz={visualizationModel} tableData={tableData} />
    </div>
  );
};

export default CustomizationState;
