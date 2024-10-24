import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the initial state for the app
interface AppState {
  isInitialized: boolean;
  isSidebarOpen: boolean; // Add sidebar state
}

const initialState: AppState = {
  isInitialized: false,
  isSidebarOpen: false, // Initialize the sidebar state
};

// Create the slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initializeApp: (state) => {
      state.isInitialized = true; // Set the app as initialized
    },
    resetApp: (state) => {
      state.isInitialized = false; // For cases where you might want to reset the state
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen; // Toggle sidebar state
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true; // Open sidebar
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false; // Close sidebar
    },
  },
});

// Export the actions
export const { 
  initializeApp, 
  resetApp, 
  toggleSidebar, 
  openSidebar, 
  closeSidebar 
} = appSlice.actions;

// Export the selector to access the initialized state
export const selectIsInitialized = (state: RootState) => state.app.isInitialized;
export const selectIsSidebarOpen = (state: RootState) => state.app.isSidebarOpen; // Selector for sidebar state

// Export the reducer to be included in the store
export default appSlice.reducer;