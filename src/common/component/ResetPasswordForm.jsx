import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Logo from "../image/datavuelogo_dark.svg";
import axios from "axios";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      alert("Missing or invalid token.");
      //      navigate("/login");
      console.log(token);
    }
  }, [token, navigate]);

  const handleReset = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/user/reset_password?token=${encodeURIComponent(
          token
        )}&password=${encodeURIComponent(password)}`
      );

      alert("Password successfully reset.");
      navigate("/login");
    } catch (error) {
      console.error("Reset failed:", error);
      alert("Reset failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ backgroundColor: "white", padding: 0 }}>
      <Box
        sx={{
          mt: 0,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          border: "1px solid #001f47",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: "2%",
          }}
        >
          <Typography variant="h4" color="#001f47">
            Reset your
          </Typography>
          <img src={Logo} style={{ width: "30%", height: "auto" }} />
        </Box>

        <form onSubmit={handleReset}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& label.Mui-focused": { color: "#007393" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#007393" },
              },
            }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              "& label.Mui-focused": { color: "#007393" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#007393" },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#001f47",
              color: "white",
              textTransform: "none",
              mt: 2,
              border: "1px solid #001f47",
              transition: "background-color 0.3s ease",
            }}
          >
            Reset Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPasswordForm;
