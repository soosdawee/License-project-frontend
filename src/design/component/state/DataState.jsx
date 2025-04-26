import React, { useRef } from "react";
import TableComponent from "../table/TableComponent";
import { Button, Box } from "@mui/material";

const DataState = ({
  visualizationModel,
  tableData,
  setTableData,
  setState,
}) => {
  const hotRef = useRef(null);

  const handleSaveClick = () => {
    const hotInstance = hotRef.current.hotInstance;
    const currentData = hotInstance.getData();
    setTableData(currentData);
    setState("Customize Visualization");
  };

  return (
    <Box>
      <TableComponent
        visualizationModel={visualizationModel}
        tableData={tableData}
        hotRef={hotRef}
      />
      <Button
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: "#1976d2",
          color: "white",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#115293",
          },
          textTransform: "none",
        }}
        onClick={handleSaveClick}
      >
        Proceed
      </Button>
    </Box>
  );
};

export default DataState;
