import React, { useEffect, useState } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import backend from "../data-access/backend";
import axios from "axios";

const TableComponent = () => {
  const [data, setData] = useState([["", "", ""]]);

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
    <div>
      <HotTable
        data={data.length > 1 ? data.slice(1) : null}
        colHeaders={data[0]}
        rowHeaders={true}
        minRows={5}
        minCols={3}
        stretchH="all"
        contextMenu={true}
        copyPaste={true}
        afterPaste={(changes) => {
          if (changes) {
            const newData = [...data];

            changes.forEach((rowData, rowIndex) => {
              if (newData[rowIndex]) {
                newData[rowIndex] = rowData;
              } else {
                newData.push(rowData);
              }
            });

            setData(newData);
          }
        }}
      />
      <button onClick={handleSave}>Save Table</button>
    </div>
  );
};

export default TableComponent;
