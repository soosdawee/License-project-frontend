import React from "react";
import { useLocation } from "react-router-dom";
import RendererFactory from "../component/renderer/RendererFactory";

const StudioPage = () => {
  const location = useLocation();
  const { vizType } = location.state || {};

  return <RendererFactory vizType={vizType} />;
};

export default StudioPage;
