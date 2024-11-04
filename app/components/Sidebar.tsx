import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { List, ListItem, ListItemButton, ListItemText, TextField, Box, Button, CircularProgress, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { autoLogin } from '../redux/slices/authSlice';
import { updateFilters, resetFilters } from '../redux/slices/filterSlice';
import { fetchCars, filterCars } from '../redux/slices/carSlice'; 
import { Car } from '../types/car'; 
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { toggleSidebar, selectIsSidebarOpen } from '../redux/slices/appSlice'; // Import sidebar actions and selector

const Sidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const cars = useSelector((state: RootState) => state.cars.cars);
    const allCars = useSelector((state: RootState) => state.cars.allCars);
    const isLoading = useSelector((state: RootState) => state.cars.loading); 
    const filterState = useSelector((state: RootState) => state.filters);
    
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // Access the sidebar open state from the app slice
    const isSidebarOpen = useSelector(selectIsSidebarOpen); 

    useEffect(() => {
        dispatch(autoLogin());
    }, [dispatch]);

    useEffect(() => {
        const fetchInitialCars = async () => {
            if (allCars.length === 0) {
                await dispatch(fetchCars({}));
            }
        };

        fetchInitialCars();
        console.log("All cars: ", allCars)
    }, [dispatch, allCars]);

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

    // Toggle sidebar visibility using Redux action
    const toggleSidebarVisibility = () => {
        dispatch(toggleSidebar());
    };

    return (
        <>
            {/* Sidebar */}
            <Box
                sx={{
                    width: 250,
                    padding: 2,
                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: '#121212', // Dark background
                    color: 'white', // White text color
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: isSidebarOpen ? 0 : '-230px', // Use Redux state for position
                    transition: 'left 0.3s ease-in-out',
                    zIndex: 1000,
                    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)',
                }}
            >
                {/* Sidebar content */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={toggleSidebarVisibility} sx={{ padding: '5px' }}>
                        {isSidebarOpen ? <ArrowBackIosNewIcon sx={{ color: 'white' }} /> : <ArrowForwardIosIcon sx={{ color: 'white' }} />}
                    </IconButton>
                </Box>
                
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search cars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2, '& .MuiInputBase-root': { backgroundColor: '#333', color: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }} // Input field style
                />

                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {cars.map((car: Car) => (
                            <ListItem key={car.id} disablePadding>
                                <ListItemButton onClick={() => handleCarClick(car.id)}>
                                    <ListItemText primary={`${car.make} ${car.model}`} sx={{ color: 'white' }} /> {/* White text for car names */}
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

            {/* Tab when Sidebar is closed */}
            {!isSidebarOpen && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '0',
                        transform: 'translateY(-50%)',
                        width: '30px',
                        height: '100px',
                        backgroundColor: '#121212', // Dark background
                        borderTopRightRadius: '5px',
                        borderBottomRightRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        zIndex: 1100,
                    }}
                    onClick={toggleSidebarVisibility} // Toggle via Redux action
                >
                    <ArrowForwardIosIcon sx={{ color: 'white' }} />
                </Box>
            )}
        </>
    );
};

export default Sidebar;
