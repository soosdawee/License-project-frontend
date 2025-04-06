import React, { useEffect, useState } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import backend from "../data-access/Backend";
import { registerAllModules } from "handsontable/registry";

const TableComponent = () => {
  const [data, setData] = useState([["", "", ""]]);

  registerAllModules();

  useEffect(() => {
    const fetchData = async () => {
      const response = await backend.get("table_data/5");
      setData(response.data.data);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const response = await backend.post(
      "http://localhost:8080/table_data",
      JSON.stringify({ data })
    );

    console.log(response);

    if (response.ok) {
      alert("Table saved successfully!");
    }
  };

  return (
    <div style={{ padding: 0 }}>
      <HotTable
        data={data}
        colHeaders={false}
        rowHeaders={true}
        minRows={15}
        minCols={5}
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
        cells={(row, col) => {
          if (row === 0) {
            return { className: "header-row" };
          }
        }}
      />
      <button onClick={handleSave}>Save Table</button>
    </div>
  );
};

export default TableComponent;
