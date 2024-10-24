// "use client";

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   IconButton,
//   Input,
//   FormControl,
//   FormLabel,
//   Select,
//   Typography,
//   Avatar,
//   useTheme,
//   Snackbar,
//   MenuItem,
//   CircularProgress, // Import CircularProgress for the loading spinner
// } from '@mui/material';
// import { AiOutlineEdit, AiOutlineSave, AiOutlineDelete } from 'react-icons/ai';
// import { useDropzone } from 'react-dropzone';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch } from '../redux/store';
// import { updateCar, deleteCar } from '../redux/slices/carSlice';
// import { Car, CarData } from '../types/car';
// import { SelectChangeEvent } from '@mui/material/Select';
// import { RootState } from '../redux/store';
// import { getFullImagePath } from '../utils/image';

// type CarCondition = 'New' | 'Used' | 'Classic' | null;

// interface CarDetailProps {
//   car: Car;
//   carId: number;
// }

// const CarDetail: React.FC<CarDetailProps> = ({ car, carId }) => {
//   const theme = useTheme();
//   const dispatch = useDispatch<AppDispatch>();
//   const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  
//   // State for the image and car data
//   const [currentImage, setCurrentImage] = useState<string | null>(car.imagePath ? getFullImagePath(car.imagePath) : null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isEditMode, setIsEditMode] = useState<boolean>(false);
//   const [carData, setCarData] = useState<CarData>({
//     make: car.make,
//     model: car.model,
//     year: car.year,
//     vin: car.vin,
//     mileage: car.mileage,
//     price: car.price,
//     features: car.features,
//     condition: car.condition as CarCondition,
//   });

//   const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
//   const [snackbarMessage, setSnackbarMessage] = useState<string>('');
//   const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

//   // Handle input field changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setCarData((prev) => ({
//       ...prev,
//       [name]: ['mileage', 'price', 'year'].includes(name) ? Number(value) || null : value,
//     }));
//   };

//   // Handle select field changes
//   const handleSelectChange = (e: SelectChangeEvent<string>) => {
//     const { name, value } = e.target;
//     setCarData((prev) => ({
//       ...prev,
//       [name]: value === '' ? null : (value as CarCondition),
//     }));
//   };

//   // Handle image upload via dropzone
//   const handleImageChange = (acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       const file = acceptedFiles[0];
//       setImageFile(file);
//       const newImageUrl = URL.createObjectURL(file);
//       setCurrentImage(newImageUrl); // Update image state with uploaded image URL
//     }
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: handleImageChange,
//     accept: { 'image/*': [] },
//     multiple: false,
//   });

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const updatedCar = await dispatch(updateCar({ id: carId, updatedCar: carData, imageFile })).unwrap();
//       setCurrentImage(getFullImagePath(updatedCar.imagePath ?? null)); // Update the image after submission
//       showSnackbar('Car updated successfully!');
//       resetForm();
//     } catch (error) {
//       showSnackbar('Something went wrong');
//       console.error('Update failed', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm("Permanently delete this car? This cannot be undone.");
//     if (!confirmDelete) return;

//     try {
//       await dispatch(deleteCar(carId)).unwrap();
//       showSnackbar('Car has been permanently deleted.');
//     } catch (error) {
//       showSnackbar('Failed to delete car. Please try again.');
//       console.error('Delete failed', error);
//     }
//   };

//   const showSnackbar = (message: string) => {
//     setSnackbarMessage(message);
//     setSnackbarOpen(true);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const resetForm = () => {
//     setImageFile(null);
//     setIsEditMode(false);
//     setCurrentImage(car.imagePath ? getFullImagePath(car.imagePath) : null);
//     setCarData({
//       make: car.make,
//       model: car.model,
//       year: car.year,
//       vin: car.vin,
//       mileage: car.mileage,
//       price: car.price,
//       features: car.features,
//       condition: car.condition as CarCondition,
//     });
//   };

//   const handleEditClick = () => {
//     if (isLoggedIn) {
//       setIsEditMode((prev) => !prev);
//       if (!isEditMode) {
//         setCurrentImage(car.imagePath ? getFullImagePath(car.imagePath) : null);
//       }
//     } else {
//       setOpenLoginModal(true);
//     }
//   };

//   const handleDeleteClick = () => {
//     if (isLoggedIn) {
//       handleDelete();
//     } else {
//       setOpenLoginModal(true);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         padding: theme.spacing(4),
//         borderRadius: 2,
//         boxShadow: theme.shadows[5],
//         maxWidth: 1200,
//         margin: 'auto',
//         backgroundColor: theme.palette.background.paper,
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 2,
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography variant="h4">Car Details</Typography>
//         <Box>
//           <IconButton
//             onClick={handleEditClick}
//             aria-label={isEditMode ? 'Save Car' : 'Edit Car'}
//             color="primary"
//             disabled={loading}
//           >
//             {isEditMode ? <AiOutlineSave onClick={handleSubmit} /> : <AiOutlineEdit />}
//           </IconButton>
//           <IconButton onClick={handleDeleteClick} aria-label="Delete Car" color="error">
//             <AiOutlineDelete />
//           </IconButton>
//         </Box>
//       </Box>

//       <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             flex: 1,
//             border: `1px dashed ${theme.palette.divider}`,
//             borderRadius: 2,
//             position: 'relative',
//             overflow: 'hidden',
//             padding: theme.spacing(2),
//           }}
//           {...getRootProps()}
//         >
//           {isEditMode ? (
//             <>
//               <input {...getInputProps()} />
//               {currentImage ? (
//                 <Avatar
//                   src={currentImage}
//                   alt="Uploaded Car"
//                   variant="rounded"
//                   sx={{ width: '100%', height: 300, objectFit: 'cover', mb: 2 }}
//                 />
//               ) : (
//                 <Box
//                   sx={{
//                     height: 300,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     cursor: 'pointer',
//                     '&:hover': {
//                       backgroundColor: theme.palette.action.hover,
//                     },
//                   }}
//                 >
//                   <Typography color="textSecondary">Drop an image here or click to select a file</Typography>
//                 </Box>
//               )}
//               <Typography variant="body2" color="textSecondary" align="center">
//                 Drag and drop an image or use the button above to upload
//               </Typography>
//             </>
//           ) : currentImage ? (
//             <Avatar
//               src={currentImage}
//               alt="Current Car"
//               variant="rounded"
//               sx={{ width: '100%', height: 300, objectFit: 'cover', mb: 2 }}
//             />
//           ) : (
//             <Typography variant="h2" sx={{ fontSize: '100px', margin: 0 }}>
//               🚗
//             </Typography>
//           )}
//         </Box>

//         <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
//           {['make', 'model', 'vin', 'mileage', 'price', 'features', 'year', 'condition'].map((field) => (
//             <FormControl key={field}>
//               <FormLabel>{field}</FormLabel>
//               {field === 'condition' ? (
//                 <Select
//                   name={field}
//                   value={carData[field] || ''}
//                   onChange={handleSelectChange}
//                   disabled={!isEditMode}
//                   fullWidth
//                 >
//                   <MenuItem value="New">New</MenuItem>
//                   <MenuItem value="Used">Used</MenuItem>
//                   <MenuItem value="Classic">Classic</MenuItem>
//                 </Select>
//               ) : (
//                 <Input
//                   name={field}
//                   value={carData[field] || ''}
//                   onChange={handleInputChange}
//                   disabled={!isEditMode}
//                   fullWidth
//                   type={['mileage', 'price', 'year'].includes(field) ? 'number' : 'text'}
//                 />
//               )}
//             </FormControl>
//           ))}
//         </Box>
//       </Box>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         message={snackbarMessage}
//       />

//       {/* CircularProgress */}
//       {loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />}
//     </Box>
//   );
// };

// export default CarDetail;
