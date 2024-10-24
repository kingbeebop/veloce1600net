"use client"; // Ensure this is at the top for client-side execution
import React from 'react';
import Section from '../Section'; // Adjust the path as necessary
import { storeSectionData } from './data'; // Ensure you have the corresponding data file
import { useRouter } from 'next/navigation'; // Import useRouter

const StoreSection: React.FC = () => {
  const router = useRouter(); // Get the router instance

  // Update the button's action to navigate using the router
  const navigateToCars = () => {
    router.push('/cars');
  };

  return (
    <Section 
      title={storeSectionData.title}
      header={storeSectionData.header}
      image={storeSectionData.image} 
      content={storeSectionData.content} 
      buttons={[
        {
          name: 'Inventory',
          action: navigateToCars, // Use the handle function for the action
        },
      ]}
    />
  );
};

export default StoreSection;
