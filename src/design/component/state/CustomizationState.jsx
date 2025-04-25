import React from "react";
import RendererFactory from "../renderer/RendererFactory";

const CustomizationState = ({ visualizationModel }) => {
  return (
    <div>
      <RendererFactory viz={visualizationModel} />
    </div>
  );
};

export default CustomizationState;
