"use client"; // Ensure this is at the top for client-side execution
import React from 'react';
import Section from '../Section'; // Adjust the path as necessary
import { eventsSectionData } from './data'; // Ensure you have the corresponding data file

const EventsSection: React.FC = () => {
  return (
    <Section 
      title={eventsSectionData.title}
      header={eventsSectionData.header}
      image={eventsSectionData.image} 
      content={eventsSectionData.content} 
      buttons={eventsSectionData.buttons}
    />
  );
};

export default EventsSection;
