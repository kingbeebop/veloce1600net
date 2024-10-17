"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux"; // Import useDispatch
import { AppDispatch } from "@/redux/store";
import { createCar } from "../redux/slices/carSlice"; // Import createCar action
import { CarData } from "../types/car"; // Import CarData type

interface SubmitCarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitCar: React.FC<SubmitCarProps> = ({ isOpen, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const [newCar, setNewCar] = useState<CarData>({
    make: null,
    model: null,
    year: null,
    vin: null,
    mileage: null,
    price: null,
    features: null,
    condition: null
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(createCar({ newCar: newCar, imageFile: image })).unwrap; // Dispatch createCar with the new car and image
      onClose(); // Close the modal
    } catch (error) {
      console.log(error);
      // Handle error (you may want to add error handling logic here)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add New Car</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Make"
            value={newCar.make || ""}
            onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Model"
            value={newCar.model || ""}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Year"
            type="number"
            value={newCar.year || ""}
            onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) || null })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="VIN"
            value={newCar.vin || ""}
            onChange={(e) => setNewCar({ ...newCar, vin: e.target.value })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Mileage"
            type="number"
            value={newCar.mileage || ""}
            onChange={(e) => setNewCar({ ...newCar, mileage: Number(e.target.value) || null })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Price"
            type="number"
            value={newCar.price || ""}
            onChange={(e) => setNewCar({ ...newCar, price: Number(e.target.value) || null })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Features"
            value={newCar.features || ""}
            onChange={(e) => setNewCar({ ...newCar, features: e.target.value })}
            placeholder="Enter features, separated by commas"
            multiline
            rows={3}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Condition</InputLabel>
          <Select
            value={newCar.condition || ""}
            onChange={(e) => setNewCar({ ...newCar, condition: e.target.value as 'New' | 'Used' | 'Classic' })}
          >
            <MenuItem value="" disabled>Select condition</MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
            <MenuItem value="Classic">Classic</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);
            }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitCar;
