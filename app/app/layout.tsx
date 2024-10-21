"use client";

import { ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import store, { AppDispatch } from '../redux/store'; // Import AppDispatch from your store
import { fetchCars } from '../redux/slices/carSlice'; // Adjust this import if needed
import Banner from '../components/Banner';
import Sidebar from '../components/Sidebar';
import theme from '../theme/theme';

const GlobalInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>(); // Casting dispatch as AppDispatch

  useEffect(() => {
    // Dispatch the fetchCars action to fetch car data on app load
    dispatch(fetchCars({}));
  }, [dispatch]);

  return <>{children}</>;
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        {/* Add additional metadata or links here if needed */}
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* Apply default Material-UI styles */}
          <Banner />
          <Provider store={store}>
            <Box sx={{ position: 'relative' }}> {/* Sidebar is now absolutely positioned */}
              <Sidebar />

              {/* Main content area, now ignoring the sidebar */}
              <Box
                sx={{
                  margin: '0 auto',  // Ensure the main content is centered
                  padding: '16px',
                  width: '100%',
                  maxWidth: '1200px',  // You can adjust this max-width to control the content width
                  position: 'relative',  // Ensure it stays in place relative to the screen, not affected by the sidebar
                }}
              >
                <GlobalInitializer>{children}</GlobalInitializer>
              </Box>
            </Box>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
