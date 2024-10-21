"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Collapse,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { updateFilters, resetFilters } from "../redux/slices/filterSlice";
import { fetchCars, filterCars } from "../redux/slices/carSlice"; 
import SubmitCar from "./SubmitCar";
import { Car } from "../types/car"; // Assuming you have a Car type

const CarFilterBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceFilterType, setPriceFilterType] = useState<'greater' | 'less' | null>(null);
  const [priceValue, setPriceValue] = useState<number | null>(null);
  const [conditionFilter, setConditionFilter] = useState<'New' | 'Used' | 'Classic' | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const isLoading = useSelector((state: RootState) => state.cars.loading);
  const cars = useSelector((state: RootState) => state.cars.cars); // Car list from state
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [isOpen, setIsOpen] = useState<boolean>(false); // For SubmitCar modal
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false); // For login modal
  const filterState = useSelector((state: RootState) => state.filters);

  useEffect(() => {
    const filters = {
      searchTerm,
      priceFilter: priceValue !== null && priceFilterType
        ? { operator: priceFilterType, value: priceValue }
        : undefined,
      conditionFilter,
    };

    dispatch(updateFilters(filters));
  }, [searchTerm, priceFilterType, priceValue, conditionFilter, dispatch]);

  useEffect(() => {
    dispatch(filterCars({ filters: filterState }));
  }, [filterState, dispatch]);

  const handleFetchCars = async () => {
    await dispatch(fetchCars({}));
  };

  const handleSearch = () => {
    handleFetchCars();
    setSearchTerm("");
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
    setSearchTerm("");
    setPriceFilterType(null);
    setPriceValue(null);
    setConditionFilter(null);
  };

  const handleOpenSubmitCar = () => {
    if (!isLoggedIn) {
      setOpenLoginModal(true); // Open login modal if not logged in
    } else {
      setIsOpen(true); // Open SubmitCar modal if logged in
    }
  };

  const handleCloseSubmitCar = () => {
    setIsOpen(false);
  };

  const handleSnackbarClose = () => {
    setOpenLoginModal(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4} width="100%">
      <Box display="flex" alignItems="center" width="100%" maxWidth="600px" justifyContent="center">
        <TextField
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          variant="outlined"
          size="small"
          style={{ marginRight: "8px", width: "150px" }}
        />
        <IconButton aria-label="Search Cars" onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <IconButton aria-label="Add Car" onClick={handleOpenSubmitCar} style={{ marginLeft: "8px" }}>
          <AddIcon />
        </IconButton>
        <IconButton
          aria-label="Filters"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          style={{ marginLeft: "8px" }}
        >
          {isFiltersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isFiltersOpen}>
        <Box mt={2} p={2} border={1} borderRadius="4px" borderColor="gray.400" width="100%" maxWidth="600px">
          <Typography variant="h6" fontWeight="bold">Filters</Typography>
          <Select
            displayEmpty
            value={conditionFilter ?? ""}
            onChange={(e) => setConditionFilter(e.target.value as 'New' | 'Used' | 'Classic')}
            variant="outlined"
            fullWidth
            style={{ marginBottom: "16px" }}
          >
            <MenuItem value=""><em>Select condition</em></MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
            <MenuItem value="Classic">Classic</MenuItem>
          </Select>
          <Box display="flex" alignItems="center" width="100%" marginBottom="16px">
            <Select
              displayEmpty
              value={priceFilterType ?? ""}
              onChange={(e) => setPriceFilterType(e.target.value as 'greater' | 'less')}
              variant="outlined"
              style={{ marginRight: "8px", flex: "1" }}
            >
              <MenuItem value=""><em>Select price filter type</em></MenuItem>
              <MenuItem value="greater">Greater than</MenuItem>
              <MenuItem value="less">Less than</MenuItem>
            </Select>
            <TextField
              placeholder="Price"
              value={priceValue === null ? "" : priceValue}
              onChange={(e) => setPriceValue(e.target.value ? Number(e.target.value) : null)}
              type="number"
              variant="outlined"
              style={{ width: "100px" }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button onClick={handleFetchCars} variant="contained" color="primary">
              Fetch Cars
            </Button>
            <Button onClick={handleClearFilters} variant="contained" color="secondary">
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Collapse>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {cars.map((car: Car) => (
            <ListItem key={car.id}>
              <ListItemButton>
                <ListItemText primary={`${car.make} ${car.model}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* SubmitCar component in modal */}
      <SubmitCar isOpen={isOpen} onClose={handleCloseSubmitCar} />

      {/* Modal for Login */}
      <Dialog open={openLoginModal} onClose={handleSnackbarClose}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>Please log in to perform this action.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSnackbarClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarFilterBar;