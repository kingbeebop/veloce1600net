import React from 'react';
import Section from '../Section';
import { servicesSectionData } from './data';

const ServicesSection: React.FC = () => {
  return (
    <Section 
      title={servicesSectionData.title} 
      header={servicesSectionData.header}
      image={servicesSectionData.image} 
      content={servicesSectionData.content} 
      buttons={servicesSectionData.buttons}
    />
  );
};

export default ServicesSection;
