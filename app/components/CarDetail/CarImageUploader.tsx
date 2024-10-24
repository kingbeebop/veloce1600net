import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const CarImageUploader: React.FC<{
  currentImage: string | null;
  isEditMode: boolean;
  onImageChange: (acceptedFiles: File[]) => void;
}> = ({ currentImage, isEditMode, onImageChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: isEditMode ? onImageChange : undefined, // Disable onDrop when not in edit mode
    accept: { 'image/*': [] },
    multiple: false,
    noClick: !isEditMode, // Disable clicking when not in edit mode
    noDrag: !isEditMode,  // Disable drag when not in edit mode
  });

  return (
    <Box
      {...(isEditMode ? getRootProps() : {})} // Only apply drag/drop props when in edit mode
      sx={{
        border: isEditMode ? '1px dashed' : 'none', // Show border only in edit mode
        padding: isEditMode ? 2 : 0,
        borderRadius: 2,
        width: { xs: '80vh', sm: '60vh', md: '50vh', lg: '40vh' }, // Responsive width
        height: { xs: '80vh', sm: '60vh', md: '50vh', lg: '40vh' }, // Responsive height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: currentImage ? 'transparent' : isEditMode ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
      }}
    >
      {isEditMode && <input {...getInputProps()} />} {/* Input is rendered only in edit mode */}

      {currentImage ? (
        <Avatar
          src={currentImage}
          variant="rounded"
          sx={{
            width: '100%', // Full width of the box
            height: '100%', // Full height of the box
            objectFit: 'cover', // Maintain aspect ratio
          }}
        />
      ) : (
        <Typography variant="body2" color={isEditMode ? 'textPrimary' : 'textSecondary'}>
          {isEditMode ? 'Drag and drop an image' : 'No Image Available'}
        </Typography>
      )}
    </Box>
  );
};

export default CarImageUploader;
