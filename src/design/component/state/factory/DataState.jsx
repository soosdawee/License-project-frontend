import React, { useRef } from "react";
import TableComponent from "../../table/TableComponent";
import { Button, Box } from "@mui/material";

const DataState = ({ visualizationModel, setState }) => {
  return (
    <Box>
      <TableComponent visualizationModel={visualizationModel} />
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
      >
        Proceed
      </Button>
    </Box>
  );
};

export default DataState;
