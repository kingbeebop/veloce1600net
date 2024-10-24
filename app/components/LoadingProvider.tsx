import { useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { initializeApp } from '../redux/slices/appSlice';
import { selectIsInitialized } from '../redux/slices/appSlice';
import { fetchCars } from '../redux/slices/carSlice';
import LoadingScreen from './LoadingScreen';
import { preloadSectionImages } from '../utils/preloadImages';
import { useLocation } from 'react-router-dom';

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialized = useSelector(selectIsInitialized);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken'); // Retrieve access token from local storage
    const isCarsRoute = location.pathname.startsWith('/cars'); // Check if the current route is /cars or a subroute

    // If there's an access token or we're on the cars route, skip loading
    if (accessToken || isCarsRoute) {
      setLoadingComplete(true); // Set loading as complete
      dispatch(initializeApp()); // Initialize app if not already initialized
    } else {
      const initializeAppState = async () => {
        await preloadSectionImages(); // Preload all section images
        await dispatch(fetchCars({})); // Fetch data
        dispatch(initializeApp()); // Initialize app
        setLoadingComplete(true); // Mark loading as complete
      };

      if (!isInitialized) {
        initializeAppState();
      } else {
        setLoadingComplete(true); // Already initialized
      }
    }
  }, [dispatch, isInitialized, location.pathname]);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Render children immediately and position them underneath the loading screen */}
      <div style={{ visibility: loadingComplete ? 'visible' : 'hidden' }}>
        {children}
      </div>

      {/* Loading screen absolutely positioned on top of the children */}
      <LoadingScreen 
        loadingComplete={loadingComplete} 
        onAnimationComplete={() => setLoadingComplete(true)} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999, // Ensure it's on top of everything
        }}
      />
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


