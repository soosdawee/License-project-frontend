import { createContext, useContext, useReducer } from "react";
import visualizationReducer from "../../design/component/state/context/visualizationReducer";
import initialState from "../../design/component/state/context/initialState";

export const EmbeddedContext = createContext();

export const EmbeddedContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(visualizationReducer, initialState);

  return (
    <EmbeddedContext.Provider value={{ state, dispatch }}>
      {children}
    </EmbeddedContext.Provider>
  );
};

export const useEmbeddedContext = () => useContext(EmbeddedContext);
