import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Logo from "../image/datavuelogo.svg";
import DehazeIcon from "@mui/icons-material/Dehaze";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.setItem("jwt", "");
    localStorage.setItem("userId", "");
    localStorage.setItem("email", "");
    localStorage.setItem("userType", "");
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ height: "10%" }}>
      <Toolbar
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#001f47",
          height: "100%",
        }}
      >
        <img src={Logo} style={{ width: "12%", height: "auto" }} />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {localStorage.getItem("userType") === "ADMIN" && (
            <Button
              name="admin-dashboard"
              component={Link}
              to="/admin-dashboard"
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Admin Dashboard
            </Button>
          )}
          {localStorage.getItem("userType") === "FACTCHECKER" && (
            <Button
              component={Link}
              to="/factchecker-dashboard"
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Fact-checker Dashboard
            </Button>
          )}
          <Button
            name="social-button"
            color="inherit"
            component={Link}
            to="/social"
            sx={{ textTransform: "none" }}
          >
            Social Platform
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/charts"
            sx={{ textTransform: "none" }}
          >
            Create New Visualization
          </Button>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 1,
              height: 28,
              alignSelf: "center",
              borderColor: "rgba(255,255,255,0.5)",
            }}
          />

          <Box>
            <Button
              name="more-button"
              color="inherit"
              onClick={handleMenuClick}
            >
              <DehazeIcon />
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
              <MenuItem
                name="settings"
                component={Link}
                to={"/settings"}
                onClick={handleClose}
              >
                Settings
              </MenuItem>
              <MenuItem
                name="profile"
                component={Link}
                to={`/profile/${localStorage.getItem("userId")}`}
                onClick={handleClose}
              >
                Profile
              </MenuItem>
              <MenuItem
                name="my-visualizations"
                component={Link}
                to={`/my-visualizations/${localStorage.getItem("userId")}`}
                onClick={handleClose}
              >
                My Visualizations
              </MenuItem>
              <MenuItem component={Link} to="/" onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Navbar);
