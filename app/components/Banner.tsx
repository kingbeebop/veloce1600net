import React from 'react';
import { Box, Typography } from '@mui/material';

const Banner: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'indigo.600',
        color: 'black',
        textAlign: 'center',
        paddingY: 4, // Equivalent to `py={6}` in Chakra
      }}
    >
      <Typography variant="h2" sx={{ fontFamily: 'serif' }}>
        Veloce1600
      </Typography>
    </Box>
  );
};

export default Banner;
