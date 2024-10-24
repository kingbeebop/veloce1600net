import { NextRouter } from 'next/router';

// Define a function that takes the router as a parameter
export const navigateToCars = (router: NextRouter) => {
  router.push('/cars');
};
