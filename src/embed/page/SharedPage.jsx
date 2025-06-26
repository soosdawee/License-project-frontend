import { useParams } from "react-router-dom";
import { EmbeddedContextProvider } from "../context/EmbeddedContext";
import EmbeddedComponent from "../component/EmbeddedComponent";

const SharedPage = () => {
  const { id } = useParams();

  return (
    <EmbeddedContextProvider>
      <EmbeddedComponent visualizationId={id} type={"shared"} />
    </EmbeddedContextProvider>
  );
};

export default SharedPage;
