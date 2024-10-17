import { configureStore } from '@reduxjs/toolkit';
import carReducer from './slices/carSlice';
import ownerReducer from './slices/ownerSlice';
import saleReducer from './slices/saleSlice';
import filterReducer from './slices/filterSlice';
import authReducer from './slices/authSlice'

// Create the store
const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication state
    filters: filterReducer, // Filter state
    cars: carReducer, // Car state
    owners: ownerReducer, // Owner state
    sales: saleReducer, // Sale state
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in non-production environments
});

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Define types for `AppDispatch`
export type AppDispatch = typeof store.dispatch;

// Optional: Custom thunk configuration type
export interface AsyncThunkConfig {
  state: RootState;
  // Add any additional properties if needed
}

export default store;