import { useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { initializeApp } from '../redux/slices/appSlice';
import { selectIsInitialized } from '../redux/slices/appSlice';
import { fetchCars } from '../redux/slices/carSlice';
import LoadingScreen from './LoadingScreen';
import { preloadSectionImages } from '../utils/preloadImages';
import { usePathname } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialized = useSelector(selectIsInitialized);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [onLoadingScreen, setOnLoadingScreen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const isCarsRoute = pathname.startsWith('/cars');

    const initializeAppState = async () => {
      await preloadSectionImages();
      await dispatch(fetchCars({}));
      dispatch(initializeApp());
      setLoadingComplete(true);
    };

    // Determine if we need to initialize the app state
    if (!accessToken && !isCarsRoute) {
      // If there's no access token and not on the cars route, show loading screen
      initializeAppState();
      setOnLoadingScreen(true); // Show loading screen as we are fetching data
    } else {
      // If we have an access token or we're on the cars route
      setLoadingComplete(true); // Skip loading screen
      dispatch(initializeApp());
    }

    setIsChecking(false); // Mark checking as complete
  }, [dispatch, isInitialized, pathname]);

  // Effect to handle loading screen visibility based on loading state
  useEffect(() => {
    if (!isChecking) {
      if (!loadingComplete) {
        setOnLoadingScreen(true); // Show loading screen if not loaded yet
      } else if (onLoadingScreen) {
        // If loading is complete but onLoadingScreen is still true, we should show it
        setOnLoadingScreen(true); 
      }
    }
  }, [isChecking, loadingComplete, onLoadingScreen]);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {isChecking ? ( // Show progress wheel while checking
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress sx={{ color: 'white' }} /> {/* White circular progress */}
        </Box>
      ) : (
        <div style={{ visibility: loadingComplete ? 'visible' : 'hidden' }}>
          {children}
        </div>
      )}
      {onLoadingScreen && ( // Show loading screen if onLoadingScreen is true
        <LoadingScreen
          loadingComplete={loadingComplete}
          onAnimationComplete={() => {
            // Hide loading screen on user interaction
            setOnLoadingScreen(false); 
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        />
      )}
    </div>
  );
};

export default LoadingProvider;



// import { useEffect, useState, ReactNode } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch } from '../redux/store';
// import { initializeApp } from '../redux/slices/appSlice';
// import { selectIsInitialized } from '../redux/slices/appSlice';
// import { fetchCars } from '../redux/slices/carSlice';
// import LoadingScreen from './LoadingScreen';
// import { preloadSectionImages } from '../utils/preloadImages';

// const LoadingProvider = ({ children }: { children: ReactNode }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const isInitialized = useSelector(selectIsInitialized);
//   const [loadingComplete, setLoadingComplete] = useState(false);

//   useEffect(() => {
//     const initializeAppState = async () => {
//       await preloadSectionImages(); // Preload all section images
//       await dispatch(fetchCars({})); // Fetch data
//       dispatch(initializeApp()); // Initialize app
//       setLoadingComplete(true); // Mark loading as complete
//     };

//     if (!isInitialized) {
//       initializeAppState();
//     } else {
//       setLoadingComplete(true); // Already initialized
//     }
//   }, [dispatch, isInitialized]);

//   return (
//     <div style={{ position: 'relative', height: '100vh' }}>
//       {/* Render children immediately and position them underneath the loading screen */}
//       <div style={{ visibility: loadingComplete ? 'visible' : 'hidden' }}>
//         {children}
//       </div>

//       {/* Loading screen absolutely positioned on top of the children */}
//       <LoadingScreen 
//         loadingComplete={loadingComplete} 
//         onAnimationComplete={() => setLoadingComplete(true)} 
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           zIndex: 9999, // Ensure it's on top of everything
//         }}
//       />
//     </div>
//   );
// };

// export default LoadingProvider;


