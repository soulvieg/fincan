import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography, Link, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SignupUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const handleUserSignup = () => {
    console.log("Logging in with", email, password);
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
