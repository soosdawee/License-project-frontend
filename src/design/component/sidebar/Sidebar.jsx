import React from "react";
import { Box } from "@mui/material";

const Sidebar = ({ children, look }) => {
  return <Box sx={look}>{children}</Box>;
};

export default Sidebar;
