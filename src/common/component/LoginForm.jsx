import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <Container maxWidth="sm" style={{ backgroundColor: "white", padding: 0 }}>
      <Box sx={{ mt: 0, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="black">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              "&:hover": {
                backgroundColor: "#45a049",
                boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
              },
              mt: 2,
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
