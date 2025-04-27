// src/components/LoginUser.tsx
import React, { useState } from "react";
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
import { useUser } from "../contexts/UserContext";

const LoginUser = () => {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useUser();

  const handleUserLogin = async () => {
    setError(null);

    // Frontend-only validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred.");
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
            sx={{ fontFamily: "'Rubik', sans-serif", fontWeight: 400 }}
          >
            ☕ Welcome Back!
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
            required
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
            sx={{ fontFamily: "'Rubik', sans-serif", fontSize: "16px" }}
          />
          <TextField
            fullWidth
            required
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            sx={{ fontFamily: "'Rubik', sans-serif", fontSize: "16px" }}
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
            sx={{
              fontFamily: "'Rubik', sans-serif",
              mt: 2,
              bgcolor: "#6d4c41",
            }}
            onClick={handleUserLogin}
          >
            Login
          </Button>

          <Typography mt={2}>
            <Link
              onClick={() => navigate("/forgot-password")}
              sx={{ fontFamily: "'Rubik', sans-serif", cursor: "pointer" }}
            >
              Forgot Password?
            </Link>
          </Typography>
          <Typography mt={2}>
            Don't have an account?{" "}
            <Link
              onClick={() => navigate("/signup-user")}
              sx={{ fontFamily: "'Rubik', sans-serif", cursor: "pointer" }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginUser;