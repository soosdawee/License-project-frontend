import RendererFactory from "../../renderer/RendererFactory";
import { VisualizationContext } from "../context/VisualizationContext";
import { useContext } from "react";

const CustomizationState = ({ visualizationModel }) => {
  const { state } = useContext(VisualizationContext);

  console.log(state);

  return (
    <div style={{ height: "100%", width: "100%", overflow: "auto" }}>
      <RendererFactory
        viz={visualizationModel.visualizationModelId}
        state={state}
        showSidebar={true}
      />
    </div>
  );
};

export default CustomizationState;
