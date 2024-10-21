"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { List, ListItem, ListItemButton, ListItemText, TextField, Box, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { autoLogin } from '../redux/slices/authSlice';
import { updateFilters, resetFilters } from '../redux/slices/filterSlice';
import { fetchCars, filterCars } from '../redux/slices/carSlice'; 
import { Car } from '../types/car'; 
import UserAvatar from './UserAvatar';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const cars = useSelector((state: RootState) => state.cars.cars);
    const carsCount = useSelector((state: RootState) => state.cars.count)
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const filterState = useSelector((state: RootState) => state.filters);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(autoLogin());
    }, [dispatch]);

    // useEffect(() => {
    //     const fetchInitialCars = async () => {
    //         if (carsCount === 0) {
    //             setIsLoading(true)
    //             await dispatch(fetchCars({}));
    //             setIsLoading(false)
    //         }
    //     };
        
    //     fetchInitialCars();
        
    // }, [dispatch, carsCount]);

    useEffect(() => {
        dispatch(updateFilters({ searchTerm }));
    }, [searchTerm, dispatch]);

    useEffect(() => {
        dispatch(filterCars({ filters: filterState }));
    }, [filterState, dispatch]);

    const handleCarClick = (carId: number) => {
        router.push(`/cars/${carId}`);
    };

    const handleClearFilters = () => {
        dispatch(resetFilters());
        setSearchTerm('');
    };

    return (
        <Box
            sx={{
                width: 250,
                padding: 2,
                borderRight: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
                height: '100vh',
                position: 'fixed',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {isLoggedIn ? (
                    <UserAvatar />
                ) : (
                    <Button variant="contained" color="primary" onClick={() => router.push('/login')}>
                        Login
                    </Button>
                )}
            </Box>
            
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
            />

            {isLoading ? (
                <CircularProgress />
            ) : (
                <List>
                    {cars.map((car: Car) => (
                        <ListItem key={car.id} disablePadding>
                            <ListItemButton onClick={() => handleCarClick(car.id)}>
                                <ListItemText primary={`${car.make} ${car.model}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}

            <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="secondary" onClick={handleClearFilters}>
                    Clear Filters
                </Button>
            </Box>
        </Box>
    );
};

export default Sidebar;
