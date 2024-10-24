import React from 'react';
import Section from '../Section';
import { sellSectionData } from './data';

const SellSection: React.FC = () => {
  return (
    <Section 
      title={sellSectionData.title}
      header={sellSectionData.header}
      image={sellSectionData.image} 
      content={sellSectionData.content} 
      buttons={sellSectionData.buttons}
    />
  );
};

export default SellSection;
