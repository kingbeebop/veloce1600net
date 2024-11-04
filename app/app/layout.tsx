// app/layout.tsx
"use client";

import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import store from '../redux/store'; 
import Banner from '../components/Banner';
// import Sidebar from '../components/Sidebar';
import theme from '../theme/theme';
import { useRouter } from 'next/navigation';
import LoginAvatar from '../components/LoginAvatar'; 
import LoadingProvider from '../components/LoadingProvider';

const RootLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const sectionTitle = path.split('/').pop(); 

    const sections = ['about', 'contact', 'sell', 'services', 'store', 'events'];

    if (sections.includes(sectionTitle ?? "about")) {
      router.replace(`/#${sectionTitle}`);
    }

    const handleHashChange = () => {
      const sectionId = window.location.hash.replace('#', '');
      const sectionElement = document.getElementById(sectionId);

      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [router]);

  return (
    <html lang="en">
      <head>
        {/* Additional metadata or links */}
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Provider store={store}>
            <LoadingProvider> {/* Move LoadingProvider here to cover everything */}
              <LoginAvatar />
              <Banner />
              <Box sx={{ position: 'relative' }}>
                {/* <Sidebar /> */}
                <Box
                  sx={{
                    margin: '0 auto',
                    padding: '16px',
                    width: '100%',
                    maxWidth: '1200px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {children}
                </Box>
              </Box>
            </LoadingProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
