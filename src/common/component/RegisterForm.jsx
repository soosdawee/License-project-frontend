import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../image/datavuelogo_dark.svg";
import { Link as RouterLink } from "react-router-dom";

const RegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/user/register", {
        firstname: firstName,
        lastname: lastName,
        email: email,
        userPassword: password,
      });

      // Optionally, handle response, e.g. auto-login or redirect to login page
      navigate("/login");
    } catch (error) {
      console.log("Failed registration\n", error);
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
            Get started with
          </Typography>
          <img src={Logo} style={{ width: "30%", height: "auto" }} />
        </Box>

        <Typography
          variant="body1"
          sx={{ textAlign: "center", mb: 2, color: "#001f47" }}
        >
          Already have an account?{" "}
          <Typography
            component={RouterLink}
            to="/login"
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
            Login
          </Typography>
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            name="firstname"
            label="First Name"
            type="text"
            fullWidth
            margin="normal"
            variant="outlined"
            value={firstName}
            sx={{
              "& label.Mui-focused": {
                color: "#007393",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#007393",
                },
              },
            }}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            name="lastname"
            label="Last Name"
            type="text"
            fullWidth
            margin="normal"
            variant="outlined"
            value={lastName}
            sx={{
              "& label.Mui-focused": {
                color: "#007393",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#007393",
                },
              },
            }}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            sx={{
              "& label.Mui-focused": {
                color: "#007393",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#007393",
                },
              },
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            sx={{
              "& label.Mui-focused": {
                color: "#007393",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#007393",
                },
              },
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
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
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterForm;
