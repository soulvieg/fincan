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

const LoginUser: React.FC = () => {
  /* ------------------------------------------------ state */
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useUser();

  /* ------------------------------------------------ handlers */
  const handleUserLogin = async () => {
    setError(null);

    /* quick validation */
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Login failed. Please check your credentials.");
        return;
      }

      /* -----------------------------------------------
         extra redirect rules for admin e-mails
         --------------------------------------------- */
      const lower = email.toLowerCase().trim();
      if (lower === "products@fincan.com") {
        window.location.href = "http://localhost/admin/inventory";
        return;
      }
      if (lower === "sales@fincan.com") {
        window.location.href = "http://localhost/admin/sales";
        return;
      }

      /* normal customer */
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  /* ------------------------------------------------ render */
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
            backgroundColor: "rgba(255,255,255,0.9)",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontFamily: "'Rubik', sans-serif" }}>
            ☕ Welcome Back!
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth required label="Email" type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            variant="outlined" margin="normal"
          />
          <TextField
            fullWidth required label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            variant="outlined" margin="normal"
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

          <Button
            variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#6d4c41" }}
            onClick={handleUserLogin}
          >
            Login
          </Button>

          <Typography mt={2}>
            <Link sx={{ cursor: "pointer" }} onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </Link>
          </Typography>
          <Typography mt={2}>
            Don’t have an account?{" "}
            <Link sx={{ cursor: "pointer" }} onClick={() => navigate("/signup-user")}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginUser;