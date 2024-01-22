import React, { useState } from "react";
import {
  auth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/system";
import "./Login.css";

const LoginBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  maxWidth: "400px",
  margin: "auto",
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const signIn = (e) => {
    e.preventDefault();
    setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        // Signed in
        toast.success("Signed in successfully!");
      })
      .catch((error) => {
        toast.error("UserName or Password Incorrect.");
      });
  };

  return (
    <Container maxWidth="xs">
      <ToastContainer />
      <LoginBox my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form>
          <TextField
            label="Email address"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
			            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={signIn}
            style={{ marginTop: '1rem' }}
          >
            Sign In
          </Button>
        </form>
      </LoginBox>
    </Container>
  );
};

export default Login;

