// components/CarTile.tsx
"use client";

import React from 'react';
import { Box, Typography, Avatar, Card, CardContent } from '@mui/material';
import { Car } from '../types/car';
import { useRouter } from 'next/navigation';

interface CarTileProps {
  car: Car;
  setLoading: (loading: boolean) => void; // Pass setLoading function as a prop
}

const CarTile: React.FC<CarTileProps> = ({ car, setLoading }) => {
  const router = useRouter();

  const handleClick = () => {
    setLoading(true); // Set loading to true when clicked
    router.push(`/cars/${car.id}`);
  };

  const avatarSrc = car.imagePath ? ('http://localhost:5018' + car.imagePath) : null; // Use car.imagePath if it's not null
  const defaultAvatar = "🚗"; // Car emoji for default avatar

  return (
    <Card onClick={handleClick} sx={{ display: 'flex', cursor: 'pointer', mb: 2, boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {avatarSrc ? (
            <Avatar src={avatarSrc} sx={{ width: 56, height: 56, mr: 2 }} />
          ) : (
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'gray.300', color: 'black', mr: 2 }}>
              {defaultAvatar}
            </Avatar>
          )}
          <Typography variant="h6">{car.make} {car.model}</Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight="bold">${car.price}</Typography>
      </CardContent>
    </Card>
  );
};

export default CarTile;
