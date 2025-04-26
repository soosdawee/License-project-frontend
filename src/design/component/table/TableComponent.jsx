import React, { useEffect, useState, useRef } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";

const TableComponent = ({ visualizationModel, tableData, hotRef }) => {
  useEffect(() => {
    registerAllModules();
  }, []);

  return (
    <HotTable
      ref={hotRef}
      data={tableData}
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
    />
  );
};

export default TableComponent;
