// components/LoginModal.tsx
"use client"
import React, { useState } from 'react';
import { Modal, TextField, Button, Typography, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { loginUser, selectAuth } from '../redux/slices/authSlice';

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector(selectAuth);
  
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async () => {
        try {
            await dispatch(loginUser({ username, password })).unwrap();
            onClose(); // Close modal on successful login
        } catch (error) {
            console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#1c1c1c', 
                borderRadius: '8px', 
                width: '300px', 
                margin: 'auto', 
                marginTop: '20%' 
            }}>
                <Typography variant="h6" gutterBottom style={{ color: 'white' }}>Login</Typography>
                <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    required
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputLabelProps={{ style: { color: 'white' } }}
                    inputProps={{ style: { color: 'white', backgroundColor: '#333' } }} // Input field style
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
                    InputLabelProps={{ style: { color: 'white' } }}
                    inputProps={{ style: { color: 'white', backgroundColor: '#333' } }} // Input field style
                />
                {auth.error && <Alert severity="error">{auth.error}</Alert>}
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleLogin} 
                    fullWidth
                    style={{ marginTop: '16px' }}
                >
                    Login
                </Button>
            </div>
        </Modal>
    );
};

export default LoginModal;
