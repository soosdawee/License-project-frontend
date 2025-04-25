import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 0, alignItems: "start" }}>
          MyApp
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {localStorage.getItem("userType") === "ADMIN" && (
            <Button
              component={Link}
              to="/admin-dashboard"
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Admin Dashboard
            </Button>
          )}
          <Button color="inherit" sx={{ textTransform: "none" }}>
            Social Platform
          </Button>
          <Button color="inherit" sx={{ textTransform: "none" }}>
            Create New Visualization
          </Button>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 2,
              height: 28,
              alignSelf: "center",
              borderColor: "rgba(255,255,255,0.5)",
            }}
          />

          <Box>
            <Button color="inherit" onClick={handleMenuClick}>
              More
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
