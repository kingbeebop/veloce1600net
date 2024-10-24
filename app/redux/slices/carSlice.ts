import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Car, CarData } from '../../types/car';
import { CarApiResponse } from '../../types/apiResponse';
import {
    fetchCars as apiFetchCars,
    searchCarsFromAPI,
    submitCar,
    updateCar as apiUpdateCar,
    deleteCar as apiDeleteCar,
    fetchCarById as apiFetchCarById
} from '../../utils/api';
import { RootState } from '../store';

interface PriceFilter {
    operator: 'greater' | 'less';
    value: number;
}

interface FilterState {
    searchTerm: string;
    priceFilter: PriceFilter | null;
    conditionFilter: 'New' | 'Used' | 'Classic' | null;
}

interface CarState {
    cars: Car[];
    allCars: Car[];
    count: number;
    currentPage: number;
    loading: boolean;
    error: string | null;
    pageSize: number;
    page: number;
}

const initialState: CarState = {
    cars: [],
    allCars: [],
    count: 0,
    currentPage: 1,
    loading: false,
    error: null,
    pageSize: 10,
    page: 1,
};

// Thunks
export const fetchCars = createAsyncThunk<CarApiResponse, { page?: number; pageSize?: number }>(
    'cars/fetchCars',
    async ({ page = 1, pageSize = 20 } = {}) => {
        return await apiFetchCars(page, pageSize);
    }
);

export const searchCars = createAsyncThunk<CarApiResponse, { searchTerm: string; page?: number; pageSize?: number }>(
    'cars/searchCars',
    async ({ searchTerm, page = 1, pageSize = 20 }) => {
        return await searchCarsFromAPI(searchTerm);
    }
);

export const createCar = createAsyncThunk<Car, { newCar: Omit<Car, 'id'>; imageFile?: File | null }>(
    'cars/createCar',
    async ({ newCar, imageFile }, { rejectWithValue }) => {
        try {
            return await submitCar(newCar, imageFile ?? null);
        } catch {
            return rejectWithValue("Failed to create car");
        }
    }
);

export const updateCar = createAsyncThunk<Car, { id: number; updatedCar: CarData; imageFile?: File | null }>(
    'cars/updateCar',
    async ({ id, updatedCar, imageFile }, { dispatch, rejectWithValue }) => {
        try {
            const updatedCarData = await apiUpdateCar(id, updatedCar, imageFile ?? null);
            dispatch(carSlice.actions.updateCarInState({ id, updatedCar: updatedCarData }));
            return updatedCarData;
        } catch {
            return rejectWithValue("Failed to update car");
        }
    }
);

export const deleteCar = createAsyncThunk<number, number>(
    'cars/deleteCar',
    async (carId, { rejectWithValue }) => {
        try {
            await apiDeleteCar(carId);
            return carId; // Return the car ID for removal from state
        } catch {
            return rejectWithValue("Failed to delete car");
        }
    }
);

export const getCarById = createAsyncThunk<Car, number>(
    'cars/getCarById',
    async (carId, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const existingCar = state.cars.allCars.find(car => car.id === carId);
        if (existingCar) {
            return existingCar; // Return existing car if found
        }

        try {
            return await apiFetchCarById(carId); // Fetch from API if not found
        } catch {
            return rejectWithValue("Failed to fetch car");
        }
    }
);

const carSlice = createSlice({
    name: 'cars',
    initialState,
    reducers: {
        updateCarInState(state, action: PayloadAction<{ id: number; updatedCar: Car }>) {
            const { id, updatedCar } = action.payload;
            const index = state.allCars.findIndex(car => car.id === id);
            if (index !== -1) {
                state.allCars[index] = updatedCar; // Update the car in allCars
                // Update the car in filtered cars as well
                const filteredIndex = state.cars.findIndex(car => car.id === id);
                if (filteredIndex !== -1) {
                    state.cars[filteredIndex] = updatedCar;
                }
            }
        },
        filterCars(state, action: PayloadAction<{ filters: FilterState }>) {
            const { searchTerm, priceFilter, conditionFilter } = action.payload.filters;

            const areAllFiltersEmpty = !searchTerm && !priceFilter && !conditionFilter;

            if (areAllFiltersEmpty) {
                state.cars = state.allCars;
                state.count = state.allCars.length;
                return;
            }

            let filteredCars = [...state.allCars];

            if (searchTerm) {
                const searchStr = searchTerm.toLowerCase();
                filteredCars = filteredCars.filter(car => {
                    return (
                        car.make?.toLowerCase().includes(searchStr) ||
                        car.model?.toLowerCase().includes(searchStr) ||
                        car.year?.toString().includes(searchStr)
                    );
                });
            }

            if (priceFilter) {
                filteredCars = filteredCars.filter(car => {
                    if (priceFilter.operator === 'greater') {
                        return car.price != null && car.price > priceFilter.value;
                    } else if (priceFilter.operator === 'less') {
                        return car.price != null && car.price < priceFilter.value;
                    }
                    return true;
                });
            }

            if (conditionFilter) {
                filteredCars = filteredCars.filter(car =>
                    (car.condition && car.condition.toLowerCase() === conditionFilter.toLowerCase()) || car.condition == null
                );
            }

            state.cars = filteredCars;
            state.count = filteredCars.length;
        },
        setAllCars(state, action: PayloadAction<Car[]>) {
            state.allCars = action.payload;
            state.cars = action.payload;
            state.count = action.payload.length;
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        resetCars(state) {
            state.cars = state.allCars.slice(0, state.pageSize);
            state.currentPage = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCars.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCars.fulfilled, (state, action: PayloadAction<CarApiResponse>) => {
                state.loading = false;
                state.allCars = action.payload.results;
                state.cars = action.payload.results;
                state.count = action.payload.count;
            })
            .addCase(fetchCars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch cars";
            })
            .addCase(createCar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCar.fulfilled, (state, action) => {
                state.loading = false;
                state.allCars.push(action.payload); // Add the new car to allCars
                state.cars.push(action.payload); // Optionally add it to filtered cars
                state.count = state.allCars.length;
            })
            .addCase(createCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string; // Set error message
            })
            .addCase(updateCar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCar.fulfilled, (state, action) => {
                state.loading = false;
                // Update is now handled by the updateCarInState reducer
            })
            .addCase(updateCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string; // Set error message
            })
            .addCase(deleteCar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted car by ID
                state.allCars = state.allCars.filter(car => car.id !== action.payload);
                state.cars = state.cars.filter(car => car.id !== action.payload); // Also remove from filtered cars
                state.count = state.allCars.length; // Update count
            })
            .addCase(deleteCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string; // Set error message
            })
            .addCase(getCarById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCarById.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally do something with the fetched car
            })
            .addCase(getCarById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string; // Set error message
            });
    },
});

// Selectors
export const selectCars = (state: RootState) => state.cars.cars;
export const selectCarCount = (state: RootState) => state.cars.count;
export const selectLoading = (state: RootState) => state.cars.loading;
export const selectError = (state: RootState) => state.cars.error;

// Export actions and reducer
export const { setAllCars, filterCars, setCurrentPage, resetCars } = carSlice.actions;
export default carSlice.reducer;
