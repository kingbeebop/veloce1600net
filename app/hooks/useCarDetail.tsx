import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { updateCar, deleteCar } from '../redux/slices/carSlice';
import { Car, CarData } from '../types/car';
import { getFullImagePath } from '../utils/image';
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent

const useCarDetail = (car: Car, carId: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const [carData, setCarData] = useState<CarData>({
    make: car.make,
    model: car.model,
    year: car.year,
    vin: car.vin,
    mileage: car.mileage,
    price: car.price,
    features: car.features,
    condition: car.condition,
  });
  const [currentImage, setCurrentImage] = useState<string | null>(car.imagePath ? getFullImagePath(car.imagePath) : null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const handleEditClick = () => setIsEditMode((prev) => !prev);

  const handleDeleteClick = async () => {
    try {
      await dispatch(deleteCar(carId)).unwrap();
      setSnackbarMessage('Car deleted');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to delete');
      setSnackbarOpen(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedCar = await dispatch(updateCar({ id: carId, updatedCar: carData, imageFile })).unwrap();
      setCarData(updatedCar);
      setSnackbarMessage('Car updated successfully');
    } catch (error) {
      setSnackbarMessage('Failed to update car');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleImageChange = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCurrentImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setCarData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return {
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
  };
};

export default useCarDetail;
