"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Content from '../components/Content';
import { aboutSectionData as aboutData } from '../components/sections/About/data';
import { contactSectionData as contactData } from '../components/sections/Contact/data';
import { sellSectionData as sellData } from '../components/sections/Sell/data';
import { servicesSectionData as servicesData } from '../components/sections/Services/data';
import { storeSectionData as storeData } from '../components/sections/Store/data';
import { eventsSectionData as eventsData } from '../components/sections/Events/data';

// Dynamically import sections
const AboutSection = dynamic(() => import('../components/sections/About')) as React.FC;
const ContactSection = dynamic(() => import('../components/sections/Contact')) as React.FC;
const SellSection = dynamic(() => import('../components/sections/Sell')) as React.FC;
const ServicesSection = dynamic(() => import('../components/sections/Services')) as React.FC;
const StoreSection = dynamic(() => import('../components/sections/Store')) as React.FC;
const EventsSection = dynamic(() => import('../components/sections/Events')) as React.FC;

// Define section data with types
interface SectionData {
  title: string;
  image: string;
  component: React.FC;
  path: string;
}

const sectionsData: SectionData[] = [
  { title: aboutData.title, image: aboutData.image, component: AboutSection, path: '/about' },
  { title: contactData.title, image: contactData.image, component: ContactSection, path: '/contact' },
  { title: sellData.title, image: sellData.image, component: SellSection, path: '/sell' },
  { title: servicesData.title, image: servicesData.image, component: ServicesSection, path: '/services' },
  { title: eventsData.title, image: eventsData.image, component: EventsSection, path: '/events' },
  { title: storeData.title, image: storeData.image, component: StoreSection, path: '/store' },
];

const Page: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>(Array(sectionsData.length).fill(null));
  const scrollTimeoutRef = useRef<number | null>(null); // Ref to hold timeout ID

  // Debounced scroll handler
  const handleScroll = () => {
    if (scrollTimeoutRef.current) return; // If timeout is active, ignore scroll

    scrollTimeoutRef.current = window.setTimeout(() => {
      const scrollPosition = window.scrollY;
      const sectionOffsets = sectionRefs.current.map(ref => ref?.offsetTop || 0);
      let currentActiveSection = activeSection;

      // Find the active section based on scroll position
      for (let i = 0; i < sectionOffsets.length; i++) {
        if (scrollPosition >= sectionOffsets[i] - 200) { // Adjust threshold for when to update
          currentActiveSection = i;
        }
      }

      if (currentActiveSection !== activeSection) {
        setActiveSection(currentActiveSection);
      }

      scrollTimeoutRef.current = null; // Clear timeout after processing
    }, 100); // Adjust timeout duration as needed
  };

  // Handle initial URL to scroll to the appropriate section
  useEffect(() => {
    const hash = window.location.hash;
    const sectionTitle = hash.replace('#', '');

    const matchingSection = sectionsData.find(section => section.title.toLowerCase() === sectionTitle.toLowerCase());
    if (matchingSection) {
      const matchingSectionIndex = sectionsData.indexOf(matchingSection);
      setActiveSection(matchingSectionIndex);
      sectionRefs.current[matchingSectionIndex]?.scrollIntoView({ behavior: 'smooth' });
    }

    // Attach scroll event listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionChange = (index: number) => {
    if (index !== activeSection) {
      setActiveSection(index);
      window.location.hash = sectionsData[index].title.toLowerCase();
      sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header
        sections={sectionsData.map(({ title, image }) => ({ title, image }))}
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
      />

      <Content onSectionChange={handleSectionChange} activeSection={activeSection}>
        {sectionsData.map((section, index) => (
          <div
            key={index}
            ref={(el) => { sectionRefs.current[index] = el; }}
            style={{ minHeight: '100vh', scrollSnapAlign: 'start' }} // Make each section snap into view
          >
            <section.component />
          </div>
        ))}
      </Content>
    </>
  );
};

export default Page;
