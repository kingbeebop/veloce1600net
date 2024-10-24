"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Container,
} from '@mui/material'; // Import MUI components
import CarTile from '../../components/CarTile';
import CarFilterBar from '../../components/CarFilterBar';

const CarList: React.FC = () => {
  const { cars, allCars, loading, error } = useSelector((state: RootState) => state.cars);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Cars:', cars);
    console.log('All Cars:', allCars);
  }, [cars, allCars]);

  // Show loading spinner if loading is true or when navigating to a new page
  if (loading || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        <Typography>Error: {error}</Typography>
      </Alert>
    );
  }

  return (
    <Container>
      <CarFilterBar />
      <Box display="flex" flexDirection="column" alignItems="center" width="100%">
        {cars.map((car) => (
          <Box key={car.id} width={{ xs: '100%', sm: '80%', md: '70%', lg: '60%' }} m={1}>
            <CarTile car={car} setLoading={setIsLoading} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default CarList;
