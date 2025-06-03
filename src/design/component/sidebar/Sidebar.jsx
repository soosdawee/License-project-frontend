import React from "react";
import { Box } from "@mui/material";

const Sidebar = ({ children }) => {
  return (
    <Box
      sx={{
        padding: 2,
        flex: 3,
        overflowY: "auto",
        boxSizing: "border-box",
        backgroundColor: "#fafafa",
      }}
    >
      {children}
    </Box>
  );
};

export default Sidebar;
