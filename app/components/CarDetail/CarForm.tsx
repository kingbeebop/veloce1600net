import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { CarData } from '../../types/car';
import { SelectChangeEvent } from '@mui/material/Select';

// Define the fields that are expected in CarData
const fields: Array<keyof CarData> = [
  'make',
  'model',
  'vin',
  'mileage',
  'price',
  'features',
  'year',
  'condition',
];

const CarForm: React.FC<{
  carData: CarData;
  isEditMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (e: SelectChangeEvent<string>) => void;
}> = ({ carData, isEditMode, onInputChange, onSelectChange }) => {
  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxHeight: '65vh', // Shorter height to leave space for the banner
        overflowY: 'auto',  // Enable scrolling inside the form if it exceeds maxHeight
        border: '1px solid #ccc', // Optional: Add a border to visually differentiate the form area
        borderRadius: 2,     // Optional: Rounding the corners
      }}
    >
      {fields.map((field) => {
        const value =
          ['mileage', 'price', 'year'].includes(field)
            ? String(carData[field] || '') // Convert to string for numeric fields
            : carData[field] || '';

        return (
          <Box key={field} sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <FormControl fullWidth variant="outlined">
              <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
              {field === 'condition' ? (
                <Select
                  name={field}
                  value={value}
                  onChange={onSelectChange}
                  disabled={!isEditMode}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Used">Used</MenuItem>
                  <MenuItem value="Classic">Classic</MenuItem>
                </Select>
              ) : field === 'features' ? (
                // Larger textarea for features field
                <Input
                  name={field}
                  value={value}
                  onChange={onInputChange}
                  disabled={!isEditMode}
                  multiline
                  minRows={4} // Minimum height to accommodate more text
                  sx={{
                    height: 'auto',
                    maxHeight: 200, // Set maximum height for the text area
                    overflowY: 'auto', // Enable scrolling within the text area if needed
                  }}
                />
              ) : (
                <Input
                  name={field}
                  value={value}
                  onChange={onInputChange}
                  disabled={!isEditMode}
                  type={['mileage', 'price', 'year'].includes(field) ? 'text' : 'text'} // Keep as text
                  sx={{ borderRadius: 1 }}
                />
              )}
            </FormControl>
          </Box>
        );
      })}
    </Box>
  );
};

export default CarForm