import React, { createContext, useReducer } from "react";
import visualizationReducer from "./visualizationReducer";
import initialState from "./initialState";

export const VisualizationContext = createContext();

export const VisualizationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(visualizationReducer, initialState);

  return (
    <VisualizationContext.Provider value={{ state, dispatch }}>
      {children}
    </VisualizationContext.Provider>
  );
};
