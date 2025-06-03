import React, { useEffect, useRef, useContext } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { setData } from "../state/context/actions";

const TableComponent = ({ visualizationModel }) => {
  const { state, dispatch } = useContext(VisualizationContext);
  const hotTableRef = useRef(null); // ✅ Create ref

  useEffect(() => {
    registerAllModules();
  }, []);

  return (
    <HotTable
      ref={hotTableRef}
      data={state.data}
      colHeaders={visualizationModel.columnNames || true}
      rowHeaders={true}
      minRows={15}
      minCols={visualizationModel.columnNames?.length || 3}
      contextMenu={true}
      copyPaste={true}
      selectionMode="multiple"
      fillHandle={{
        direction: "vertical",
        autoInsertRow: true,
      }}
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation"
      style={{ padding: 0 }}
      afterChange={(changes, source) => {
        if (source === "loadData" || !changes) return;

        const hotInstance = hotTableRef.current?.hotInstance;
        if (!hotInstance) return;
        const rawData = hotInstance.getData();

        dispatch(setData(rawData));
      }}
    />
  );
};

export default TableComponent;
