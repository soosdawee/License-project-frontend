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
          }}
        >
          <SocialComponent />
        </Box>
        <Box sx={{ width: "20%", overflow: "hidden" }}>
          <RequestComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default SocialPage;
