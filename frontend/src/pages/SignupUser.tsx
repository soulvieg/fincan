// src/components/SignupUser.tsx
import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5001";

const SignupUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUserSignup = async () => {
    setError(null);

    const parts = name.trim().split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "";

    try {
      const response = await axios.post(
        `${API_BASE}/api/users/signup`,
        {
          firstName,
          lastName,
          email,
          homeAddress,
          phone,
          password,
          userType: "regular",
        },
        { withCredentials: true }
      );
      if (response.status === 201 || response.data) {
        navigate("/login-user");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Signup error:", err.response || err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please check your inputs.";
      setError(msg);
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
        backgroundImage:
          "url('https://images.pexels.com/photos/3737655/pexels-photo-3737655.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontFamily: "'Rubik', sans-serif" }}
          >
            ☕ Create Account
          </Typography>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Home Address"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            variant="outlined"
            margin="normal"
          />
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
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#6d4c41" }}
            onClick={handleUserSignup}
          >
            Sign Up
          </Button>

          <Typography mt={2}>
            Already have an account?{" "}
            <Link
              onClick={() => navigate("/login-user")}
              sx={{ cursor: "pointer" }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupUser;