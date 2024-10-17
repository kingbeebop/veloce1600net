"use client";

import { useRouter } from 'next/navigation';
import { Button, Box, Container, Typography } from '@mui/material'; // Import MUI components
import CarDetail from '../../../components/CarDetail';
import { fetchCarById } from '../../../utils/api';
import { Car } from '../../../types/car';
import { useEffect, useState } from 'react';

const CarPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const carId = Number(params.id);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCarData = async () => {
      try {
        const fetchedCar = await fetchCarById(carId);
        setCar(fetchedCar);
      } catch (error) {
        console.error("Error fetching car data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCarData();
  }, [carId]);

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Box display="flex" justifyContent="flex-start" marginBottom={2}>
        <Button variant="contained" color="primary" onClick={() => router.push('/cars')}>
          Back to Cars
        </Button>
      </Box>

      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : car ? (
        <CarDetail car={car} carId={carId} />
      ) : (
        <Typography variant="h6">Car not found</Typography>
      )}
    </Container>
  );
};

export default CarPage;
