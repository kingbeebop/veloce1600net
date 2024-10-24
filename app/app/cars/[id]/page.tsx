"use client";

import { useRouter } from 'next/navigation';
import { Button, Box, Container, Typography } from '@mui/material';
import CarDetail from '../../../components/CarDetail/CarDetail';
import { fetchCarById } from '../../../utils/api';
import { Car } from '../../../types/car';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    <Container maxWidth="lg" sx={{ padding: 4, position: 'relative' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push('/cars')}
        sx={{
          position: 'absolute',
          top: 16,
          left: '-70px', // Positioned further left from the main body
          padding: '8px 16px',
          backgroundColor: 'black',
          color: 'white',
          '&:hover': {
            backgroundColor: 'grey.800',
          },
          transition: 'background-color 0.3s ease',
          zIndex: 1,
        }}
      >
        <ArrowBackIcon sx={{ mr: 1 }} />
        Back to Cars
      </Button>

      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : car ? (
        <Box sx={{ mt: 4 }}> {/* Added margin-top for spacing */}
          <CarDetail car={car} carId={carId} />
        </Box>
      ) : (
        <Typography variant="h6">Car not found</Typography>
      )}
    </Container>
  );
};

export default CarPage;
