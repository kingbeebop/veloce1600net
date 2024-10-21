'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

const Banner: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: 'indigo.600',
        color: 'black',
        textAlign: 'center',
        paddingY: 4,
      }}
    >
      {imgError ? (
        <Typography variant="h2" sx={{ fontFamily: 'serif' }}>
          Veloce1600
        </Typography>
      ) : (
        <img
          src="/veloce_logo.png"
          alt="Veloce1600 Logo"
          onError={() => setImgError(true)}
          style={{
            display: 'block',
            margin: '0 auto',
            maxWidth: '400px', // Set the maximum width of the logo
            height: 'auto',
          }}
        />
      )}
    </Box>
  );
};

export default Banner;
