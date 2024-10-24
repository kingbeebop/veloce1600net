// components/LoginAvatar.tsx
import React, { useState, useEffect } from 'react';
import { Button, Avatar, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu'; // Import UserMenu

const LoginAvatar = () => {
  const router = useRouter();
  const auth = useSelector(selectAuth);

  const [modalOpen, setModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  // Check if the user is logged in and close the login modal if necessary
  useEffect(() => {
    if (auth.isLoggedIn) {
      setModalOpen(false); // Close modal on successful login
    }
  }, [auth.isLoggedIn, router]);

  // Handle clicking the avatar to open the user menu
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle closing the user menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const menuOpen = Boolean(menuAnchorEl);

  return (
    <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
      {auth.isLoggedIn ? (
        <IconButton onClick={handleAvatarClick}>
          <Avatar alt="User Avatar" />
        </IconButton>
      ) : (
        <Button 
          onClick={() => setModalOpen(true)} 
          style={{
            color: 'white', 
            padding: '8px 16px',
            backgroundColor: 'transparent'
          }}
        >
          Log In
        </Button>
      )}

      {/* Login modal for non-logged-in users */}
      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* User menu for logged-in users */}
      {auth.isLoggedIn && (
        <UserMenu 
          anchorEl={menuAnchorEl} 
          open={menuOpen} 
          onClose={handleMenuClose} 
        />
      )}
    </div>
  );
};

export default LoginAvatar;