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
  return context.measureText(text).width + 20;
};

const calculateColWidths = (data, columnHeaders) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const numCols = data[0].length;
  const widths = new Array(numCols).fill(50);

  for (let col = 0; col < numCols; col++) {
    let maxWidth = 0;

    if (columnHeaders && columnHeaders[col]) {
      const headerText = String(columnHeaders[col]);
      maxWidth = Math.max(
        maxWidth,
        estimateTextWidth(headerText, "bold 14px Arial")
      );
    }

    for (let row = 0; row < data.length; row++) {
      const cellText = String(data[row]?.[col] ?? "");
      maxWidth = Math.max(maxWidth, estimateTextWidth(cellText));
    }

    widths[col] = Math.ceil(maxWidth);
  }

  const totalWidth = widths.reduce((sum, width) => sum + width, 0);
  const avgWidth = totalWidth / numCols;

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

  const columnSettings = useMemo(() => {
    if (!visualizationModel.columnNames) return [];

    return visualizationModel.columnNames.map((header) => {
      const lower = header.toLowerCase();
      if (lower.includes("name") || lower.includes("note")) {
        return {
          type: "text",
          allowInvalid: false,
        };
      } else if (lower.includes("value") || lower.includes("label")) {
        return {
          type: "numeric",
          numericFormat: {
            pattern: "0.[000]",
          },
          allowInvalid: false,
        };
      } else {
        return {
          type: "text",
        };
      }
    });
  }, [visualizationModel.columnNames]);

  const isReadOnly = !!state.sheetsLink;

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
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      afterChange={(changes, source) => {
        if (source === "loadData" || !changes || isReadOnly) return;
        const hotInstance = hotTableRef.current?.hotInstance;
        if (!hotInstance) return;
        const rawData = hotInstance.getData();
        dispatch(setData(rawData));
      }}
      cells={(row, col) => {
        const props = {};

        if (isReadOnly) {
          props.readOnly = true;
          return props;
        }

        if (visualizationModel.visualizationModelId === 33 && row === 0) {
          props.readOnly = false;
        } else if (columnSettings[col]) {
          Object.assign(props, columnSettings[col]);
        }

        if (visualizationModel.visualizationModelId === 32 && row === 0) {
          props.className = "header-row-style";
        }

        return props;
      }}
    />
  );
};

export default TableComponent;
