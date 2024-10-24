// components/UserMenu.tsx
import React from 'react';
import { Popover, Box, Avatar, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux'; // Use the default dispatch hook
import { AppDispatch } from '../redux/store'; // Import the AppDispatch type
import { logout } from '../redux/slices/authSlice'; // Import the logout action

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ anchorEl, open, onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>(); // Cast dispatch with AppDispatch type

  // Handle Logout button
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    onClose(); // Close the popover
    router.push('/'); // Optionally route to home after logout
  };

  // Handle Settings button
  const handleSettings = () => {
    onClose(); // Close the popover
    router.push('/settings'); // Navigate to the settings page
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Show the avatar inside the popover */}
        <Avatar alt="User Avatar" sx={{ marginBottom: 1 }} />

        {/* Settings Button */}
        <Button
          onClick={handleSettings}
          variant="text"
          fullWidth
          sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
        >
          Settings
        </Button>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="text"
          fullWidth
          sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
        >
          Logout
        </Button>
      </Box>
    </Popover>
  );
};

export default UserMenu;
