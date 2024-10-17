"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation'; // Updated import for Next.js router
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Backdrop,
  Fade,
  Alert,
} from '@mui/material'; // Import MUI components
import { loginUser, selectAuth } from '../redux/slices/authSlice';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>(''); // Email state for modal
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const auth = useSelector(selectAuth);

  // Check if the user is already logged in
  useEffect(() => {
    if (auth.isLoggedIn && auth.user) {
      router.push('/cars'); // Redirect to /cars if user is logged in
    }
  }, [auth.isLoggedIn, auth.user, router]);

  // Handle user login
  const handleLogin = useCallback(async () => {
    try {
      const action = await dispatch(loginUser({ username, password })).unwrap();
      if (action) {
        router.push('/cars'); // Navigate after successful login
      }
    } catch (error) {
      console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [dispatch, username, password, router]);

  // Handle token refresh
  // const handleRefreshToken = useCallback(async () => {
  //   try {
  //     const action = await dispatch(refreshToken()).unwrap();
  //   } catch (refreshError) {
  //     console.error('Token refresh failed:', refreshError instanceof Error ? refreshError.message : 'Unknown error');
  //   }
  // }, [dispatch]);

  // Forgot password modal submission (placeholder logic for now)
  const handleForgotPasswordSubmit = () => {
    console.log('Forgot Password logic to be implemented');
    setModalOpen(false); // Close the modal after submission (for now, nothing happens)
    setEmail(''); // Clear the email state
  };

  return (
    <Box maxWidth="400px" mx="auto" mt={10} p={5} borderRadius="8px" boxShadow={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        required
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        required
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {auth.error && <Alert severity="error">{auth.error}</Alert>}
      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
        Login
      </Button>
      <Button variant="text" onClick={() => setModalOpen(true)} fullWidth>
        Forgot username or password?
      </Button>

      {/* Forgot Password Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              width: '300px',
              margin: 'auto',
              marginTop: '20%',
            }}
          >
            <Typography variant="h6">Forgot Username or Password?</Typography>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on change
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleForgotPasswordSubmit}
              fullWidth
            >
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Login;
