import { useParams } from "react-router-dom";
import { EmbeddedContextProvider } from "../context/EmbeddedContext";
import EmbeddedComponent from "../component/EmbeddedComponent";

const VisualizationPage = () => {
  const { id } = useParams();

  return (
    <EmbeddedContextProvider>
      <EmbeddedComponent visualizationId={id} type={"created"} />
    </EmbeddedContextProvider>
  );
};

export default VisualizationPage;
