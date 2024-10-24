'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image'; // Import the Image component from Next.js
import Link from 'next/link';    // Import Link from Next.js for navigation

const Banner: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/" passHref> {/* Make the banner clickable and navigate to / */}
      <Box className="banner" sx={{ cursor: 'pointer' }}> {/* Added pointer cursor for clickable UI */}
        {imgError ? (
          <Typography variant="h2" sx={{ fontFamily: 'serif' }}>
            Veloce1600
          </Typography>
        ) : (
          <Image
            src="/veloce_logo.png" // Image source
            alt="Veloce1600 Logo"
            onError={() => setImgError(true)} // Handle error for image loading
            style={{
              display: 'block',
              margin: '0 auto',
              maxWidth: '400px',
              height: 'auto',
            }}
            width={400} // Set width for optimization
            height={200}
          />
        )}
      </Box>
    </Link>
  );
};

export default Banner