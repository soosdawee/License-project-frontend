import { Box, Typography } from "@mui/material";
import RegisterForm from "../component/RegisterForm";
import LandinIllustration from "../image/login_illustration.svg";

const RegisterPage = () => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: { xs: "column", md: "row" },
        overflowY: "hidden",
        backgroundColor: "#001f47",
      }}
    >
      <Box
        sx={{
          height: "92%",
          width: "97%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflowY: "hidden",
          backgroundColor: "#f5f5f5",
          borderRadius: "15px",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "95%",
              height: "95%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "15px",
              backgroundColor: "#001f47",
            }}
          >
            <img
              src={LandinIllustration}
              alt="Landing Illustration"
              style={{
                width: "85%",
                height: "85%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RegisterForm />
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
