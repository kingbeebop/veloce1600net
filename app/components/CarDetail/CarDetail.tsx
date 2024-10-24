import React from 'react';
import { Box, CircularProgress, Snackbar, Typography, useTheme, IconButton } from '@mui/material';
import CarImageUploader from './CarImageUploader';
import CarForm from './CarForm';
import { AiOutlineEdit, AiOutlineSave, AiOutlineDelete } from 'react-icons/ai'; // Import icons
import useCarDetail from '../../hooks/useCarDetail';
import { Car } from '../../types/car';

const CarDetail: React.FC<{ car: Car; carId: number }> = ({ car, carId }) => {
  const theme = useTheme();
  const {
    carData,
    currentImage,
    isEditMode,
    loading,
    snackbarOpen,
    snackbarMessage,
    handleEditClick,
    handleDeleteClick,
    handleSnackbarClose,
    handleSubmit,
    handleImageChange,
    handleInputChange,
    handleSelectChange,
  } = useCarDetail(car, carId);

  // Create the header text from Make and Model
  const headerText = `${carData.make || ''} ${carData.model || ''}`.trim();

  return (
    <Box sx={{ padding: theme.spacing(4), maxWidth: 1200, margin: 'auto', position: 'relative' }}>
      
      {/* Edit and Save Buttons */}
      <Box sx={{ position: 'absolute', top: theme.spacing(2), right: theme.spacing(2), display: 'flex', gap: 1 }}>
        <IconButton onClick={isEditMode ? handleSubmit : handleEditClick} disabled={loading}>
          {isEditMode ? <AiOutlineSave /> : <AiOutlineEdit />}
        </IconButton>
        <IconButton onClick={handleDeleteClick} color="error" disabled={loading}>
          <AiOutlineDelete />
        </IconButton>
      </Box>

      {/* Make and Model Header */}
      <Typography variant="h5" sx={{ marginBottom: theme.spacing(2), marginTop: theme.spacing(2) }}>
        {headerText}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, width: '100%' }}>
        {/* Image Uploader: vertically centered */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CarImageUploader
            currentImage={currentImage}
            isEditMode={isEditMode}
            onImageChange={handleImageChange}
          />
        </Box>

        {/* Car Form: vertically centered */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <CarForm
            carData={carData}
            isEditMode={isEditMode}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
        </Box>
      </Box>

      {/* Snackbar and Loading */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
      {loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />}
    </Box>
  );
};

export default CarDetail;
