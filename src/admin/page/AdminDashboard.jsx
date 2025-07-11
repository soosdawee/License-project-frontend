import { useState } from "react";
import { Box, Button, Stack, Typography, Divider } from "@mui/material";
import Navbar from "../../common/component/Navbar";
import VisualizationModel from "../component/VisualizationModel";
import UserComponent from "../component/UserComponent";
import ReviewedVisualizationsComponent from "../component/ReviewedVisualizationComponent";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("models");

  const getCondtionalContent = () => {
    switch (selectedSection) {
      case "models":
        return <VisualizationModel />;
      case "users":
        return <UserComponent />;
      case "reviewed":
        return <ReviewedVisualizationsComponent />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#f4f6f8",
        overglow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Navbar />
      </Box>

      <Box
        sx={{
          display: "flex",
          pt: "64px",
          height: "90%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "30%",
            height: "90%",
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e0e0e0",
            p: 3,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            color="#001f47"
          >
            Menu
          </Typography>
          <Divider />
          <Stack spacing={2}>
            <Button
              variant={selectedSection === "models" ? "contained" : "outlined"}
              onClick={() => setSelectedSection("models")}
              sx={{
                backgroundColor:
                  selectedSection === "models" ? "#007fa7" : "white",
                color: selectedSection === "models" ? "white" : "#007fa7",
                border: "1px solid #007fa7",
                textTransform: "none",
              }}
              fullWidth
            >
              Visualization Models
            </Button>
            <Button
              name="users-button"
              variant={selectedSection === "users" ? "contained" : "outlined"}
              onClick={() => setSelectedSection("users")}
              sx={{
                backgroundColor:
                  selectedSection === "users" ? "#007fa7" : "white",
                color: selectedSection === "users" ? "white" : "#007fa7",
                border: "1px solid #007fa7",
                textTransform: "none",
              }}
              fullWidth
            >
              Users
            </Button>
            <Button
              variant={
                selectedSection === "reviewed" ? "contained" : "outlined"
              }
              onClick={() => setSelectedSection("reviewed")}
              sx={{
                backgroundColor:
                  selectedSection === "reviewed" ? "#007fa7" : "white",
                color: selectedSection === "reviewed" ? "white" : "#007fa7",
                border: "1px solid #007fa7",
                textTransform: "none",
              }}
              fullWidth
            >
              Reviewed Visualizations
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            width: "70%",
            p: 4,
            flex: 1,
            height: "100%",
            overflowY: "auto",
          }}
        >
          {getCondtionalContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
