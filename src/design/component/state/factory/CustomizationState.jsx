import RendererFactory from "../../renderer/RendererFactory";
import { VisualizationContext } from "../context/VisualizationContext";
import { useContext } from "react";
import { Suspense } from "react";

const CustomizationState = ({ visualizationModel }) => {
  const { state } = useContext(VisualizationContext);

  console.log(state);

  return (
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <Suspense fallback={<div></div>}>
        <RendererFactory
          viz={visualizationModel.visualizationModelId}
          state={state}
          showSidebar={true}
        />
      </Suspense>
    </div>
  );
};

export default CustomizationState;
