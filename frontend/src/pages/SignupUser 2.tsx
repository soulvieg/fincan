import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography, Link, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUserSignup = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/signup`, {
        name,
        email,
        homeAddress: "Default Address", // Replace or update as needed
        password,
      });
      console.log("Signup successful:", response.data);
      // Optionally, navigate to a different page after signup
      navigate("/login-user");
    } catch (err: any) {
      console.error("Signup error:", err.response?.data || err.message);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('https://images.pexels.com/photos/3737655/pexels-photo-3737655.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: "rgba(255, 255, 255, 0.9)", textAlign: "center" }}>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: "'Rubik', sans-serif" }}>
            ☕ Create Account
          </Typography>
          <TextField fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} variant="outlined" margin="normal" />
          <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" margin="normal" />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#6d4c41" }} onClick={handleUserSignup}>
            Sign Up
          </Button>
          <Typography mt={2}>
            Already have an account?{" "}
            <Link onClick={() => navigate("/login-user")} sx={{ cursor: "pointer" }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupUser;