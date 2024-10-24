import React, { useState } from 'react';
import { Avatar, Box, Typography, CircularProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression'; // Import the image compression library

const CarImageUploader: React.FC<{
  currentImage: string | null;
  isEditMode: boolean;
  onImageChange: (acceptedFiles: File[]) => void;
}> = ({ currentImage, isEditMode, onImageChange }) => {
  const [isCompressing, setIsCompressing] = useState(false); // State to track compression status
  const [progress, setProgress] = useState(0); // State to track progress

  const handleImageUpload = async (files: File[]) => {
    if (files.length > 0) {
      setIsCompressing(true);
      setProgress(0);

      const file = files[0];
      const options = {
        maxSizeMB: 1, // Maximum size in MB
        maxWidthOrHeight: 1920, // Maximum width or height
        useWebWorker: true,
        onProgress: (progress: number) => {
          setProgress(progress);
        },
      };

      try {
        const compressedFile = await imageCompression(file, options);
        onImageChange([compressedFile]); // Call the onImageChange prop with the compressed file
      } catch (error) {
        console.error('Error compressing image:', error);
      } finally {
        setIsCompressing(false); // Reset the compressing state
        setProgress(0); // Reset progress
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: isEditMode ? handleImageUpload : undefined, // Use handleImageUpload for onDrop
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

      {isCompressing ? (
        <CircularProgress variant="determinate" value={progress} />
      ) : currentImage ? (
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
