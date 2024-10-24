import React from 'react';
import Section from '../Section';
import { contactSectionData } from './data';

const ContactSection: React.FC = () => {
  return (
    <Section 
      title={contactSectionData.title}
      header={contactSectionData.header}
      image={contactSectionData.image} 
      content={contactSectionData.content} 
      buttons={contactSectionData.buttons}
    />
  );
};

export default ContactSection;
