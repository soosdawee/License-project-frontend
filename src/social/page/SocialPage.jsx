import { Box } from "@mui/material";
import Navbar from "../../common/component/Navbar";
import SocialComponent from "../component/SocialComponent";
import RequestComponent from "../component/RequestComponent";

const SocialPage = () => {
  return (
    <Box sx={{ height: "100vh", overflow: "auto" }}>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "90%",
          justifyItems: "start",
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: "20%" }}>Friends or something</Box>
        <Box
          sx={{
            width: "60%",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            flex: 1,
            backgroundColor: "white",
            borderRadius: "5px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SocialComponent />
        </Box>
        <Box
          sx={{
            width: "20%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <RequestComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default SocialPage;
