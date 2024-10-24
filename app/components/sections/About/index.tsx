import React from 'react';
import Section from '../Section';
import { aboutSectionData } from './data';

const AboutSection: React.FC = () => {
  return (
    <Section 
      title={aboutSectionData.title}
      header={aboutSectionData.header}
      image={aboutSectionData.image} 
      content={aboutSectionData.content} 
      buttons={aboutSectionData.buttons}
    />
  );
};

export default AboutSection;
