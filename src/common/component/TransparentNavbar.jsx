import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Logo from "../image/datavuelogo.svg";

const TransparentNavbar = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        height: "10%",
        backgroundColor: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gradient Blur Layer */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          background:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.001))",
          backdropFilter: "blur(1.5px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
      />

      <Toolbar
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "12%", height: "auto" }} />
      </Toolbar>
    </AppBar>
  );
};

export default TransparentNavbar;
