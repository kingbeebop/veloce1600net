"use client";

import React, { useState } from 'react';
import { Box, Button, Typography, Modal, Fade } from '@mui/material'; // Import MUI components
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';

const UserAvatar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(selectAuth);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    await dispatch(logout());
    setModalOpen(false); // Close modal after logging out
  };

  return (
    <Box>
      <Box
        onClick={() => setModalOpen(true)}
        sx={{
          cursor: 'pointer',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          backgroundColor: 'grey.300', // Placeholder for avatar background
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1">{auth.user?.username.charAt(0).toUpperCase()}</Typography>
      </Box>

      {/* User Info Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
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
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">Hello,</Typography>
            <Typography variant="body1">{auth.user?.username}</Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => console.log('Navigate to User Settings')} // Placeholder for navigation logic
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Go to User Settings
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default UserAvatar;
