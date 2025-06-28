import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../image/datavuelogo_dark.svg";
import { Link as RouterLink } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        email: email,
        userPassword: password,
      });

      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("userType", response.data.userType);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("userId", response.data.userId);
      navigate("/charts");
    } catch (error) {
      console.log("Failed login\n");
    }
  };

  const handlePasswordReset = async () => {
    try {
      await axios.post(
        `http://localhost:8080/user/forgot_password?email=${encodeURIComponent(
          resetEmail
        )}`
      );

      setModalOpen(false);
      setResetEmail("");
      alert("If the email exists, a reset link has been sent.");
    } catch (error) {
      alert("Error sending reset link.");
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
            Welcome to
          </Typography>
          <img src={Logo} style={{ width: "30%", height: "auto" }} />
        </Box>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mb: 2, color: "#001f47" }}
        >
          Don&apos;t have an account?{" "}
          <Typography
            component={RouterLink}
            to="/register"
            sx={{
              color: "#001f47",
              textDecoration: "none",
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            Register
          </Typography>
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            sx={{
              "& label.Mui-focused": { color: "#007393" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#007393" },
              },
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            sx={{
              "& label.Mui-focused": { color: "#007393" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#007393" },
              },
            }}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Typography
              variant="body2"
              sx={{
                color: "#007393",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => setModalOpen(true)}
            >
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              outlineColor: "#001f47",
              border: "1px solid #001f47",
              backgroundColor: "#001f47",
              color: "white",
              textTransform: "none",
              mt: 2,
              transition: "background-color 0.3s ease",
            }}
          >
            Login
          </Button>
        </form>
      </Box>

      {/* Modal for forgot password */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #001f47",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" mb={2}>
            Forgot Password
          </Typography>
          <TextField
            label="Enter your email"
            type="email"
            fullWidth
            variant="outlined"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            sx={{
              mb: 2,
              "& label.Mui-focused": { color: "#007393" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#007393" },
              },
            }}
          />
          <Button
            onClick={handlePasswordReset}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#001f47",
              color: "white",
              textTransform: "none",
            }}
          >
            Send Reset Link
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default LoginForm;
