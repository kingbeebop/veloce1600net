"use client";

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from '../redux/store';
import Banner from '../components/Banner';
import Sidebar from '../components/Sidebar';
import theme from '../theme/theme';
import { Box } from '@mui/material';

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
            <Box sx={{ display: 'flex' }}>
              {/* Sidebar as a permanent fixture on the left */}
              <Sidebar />
              
              {/* Main content area */}
              <Box sx={{ flexGrow: 1, marginLeft: '250px', padding: '16px' }}>
                {children}
              </Box>
            </Box>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
