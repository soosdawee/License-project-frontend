import React, { useEffect, useRef, useContext, useMemo } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { VisualizationContext } from "../state/context/VisualizationContext";
import { setData } from "../state/context/actions";

const estimateTextWidth = (text, font = "14px Arial") => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  return context.measureText(text).width + 20; // add padding
};

const calculateColWidths = (data, columnHeaders) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const numCols = data[0].length;
  const widths = new Array(numCols).fill(50);

  for (let col = 0; col < numCols; col++) {
    let maxWidth = 0;

    // Consider column header width if headers exist
    if (columnHeaders && columnHeaders[col]) {
      const headerText = String(columnHeaders[col]);
      maxWidth = Math.max(
        maxWidth,
        estimateTextWidth(headerText, "bold 14px Arial")
      );
    }

    // Consider data cell widths
    for (let row = 0; row < data.length; row++) {
      const cellText = String(data[row]?.[col] ?? "");
      maxWidth = Math.max(maxWidth, estimateTextWidth(cellText));
    }

    widths[col] = Math.ceil(maxWidth);
  }

  // Make columns uniform by using the average width
  const totalWidth = widths.reduce((sum, width) => sum + width, 0);
  const avgWidth = totalWidth / numCols;

  // Return uniform widths
  return new Array(numCols).fill(Math.ceil(avgWidth));
};

const TableComponent = ({ visualizationModel }) => {
  const { state, dispatch } = useContext(VisualizationContext);
  const hotTableRef = useRef(null);

  useEffect(() => {
    registerAllModules();
  }, []);

  const colWidths = useMemo(
    () => calculateColWidths(state.data, visualizationModel.columnNames),
    [state.data, visualizationModel.columnNames]
  );

  return (
    <HotTable
      ref={hotTableRef}
      data={state.data}
      colHeaders={visualizationModel.columnNames || true}
      colWidths={colWidths}
      rowHeaders={true}
      minRows={20}
      minCols={visualizationModel.columnNames?.length || 3}
      contextMenu={true}
      copyPaste={true}
      selectionMode="multiple"
      fillHandle={{ direction: "vertical", autoInsertRow: true }}
      autoWrapRow={true}
      autoWrapCol={true}
      manualColumnResize={true}
      stretchH="all"
      licenseKey="non-commercial-and-evaluation"
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      afterChange={(changes, source) => {
        if (source === "loadData" || !changes) return;
        const hotInstance = hotTableRef.current?.hotInstance;
        if (!hotInstance) return;
        const rawData = hotInstance.getData();
        dispatch(setData(rawData));
      }}
      cells={(row, col) => {
        const cellProperties = {};
        if (visualizationModel.visualizationModelId === 25 && row === 0) {
          cellProperties.className = "header-row-style";
        }
        return cellProperties;
      }}
    />
  );
};

export default TableComponent;
