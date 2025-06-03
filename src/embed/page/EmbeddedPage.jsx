import { useParams } from "react-router-dom";
import { EmbeddedContextProvider } from "../context/EmbeddedContext";
import EmbeddedComponent from "../component/EmbeddedComponent";

const EmbeddedPage = () => {
  const { id } = useParams();

  return (
    <EmbeddedContextProvider>
      <EmbeddedComponent visualizationId={id} />
    </EmbeddedContextProvider>
  );
};

export default EmbeddedPage;
