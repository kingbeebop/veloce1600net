"use client";

import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  title: string;
  image: string;
}

interface HeaderProps {
  sections: Section[];
  activeSection: number;
  setActiveSection: (index: number) => void;
}

const Header: React.FC<HeaderProps> = ({ sections, activeSection, setActiveSection }) => {
  const activeSectionData = sections[activeSection] || { title: '', image: '' };
  const prevSectionData = sections[activeSection === 0 ? sections.length - 1 : activeSection - 1] || { title: '', image: '' };

  // Preload images on component mount
  useEffect(() => {
    sections.forEach(section => {
      const img = new Image(); // Create a new HTMLImageElement
      img.src = section.image; // Set the source to preload the image
    });
  }, [sections]);

  const scrollToSection = (index: number) => {
    setActiveSection(index); // Update active section
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        backgroundColor: 'black',
        height: '350px', // Set a fixed height for the header
        overflow: 'hidden', // Prevent any overflow from animations
      }}
    >
      {/* Previous Section */}
      <AnimatePresence>
        <motion.div
          key={prevSectionData.title}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${prevSectionData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 5px black',
            }}
          >
            {prevSectionData.title}
          </Typography>
        </motion.div>
      </AnimatePresence>

      {/* Active Section */}
      <AnimatePresence>
        <motion.div
          key={activeSectionData.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${activeSectionData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '2px 2px 5px black',
            }}
          >
            {activeSectionData.title}
          </Typography>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons with Animated Underline */}
      <Box sx={{ backgroundColor: 'black', padding: '10px 0', position: 'relative', zIndex: 1 }}>
        <nav style={{ display: 'flex', justifyContent: 'center' }}>
          {sections.map((section, index) => (
            <Button
              key={index}
              onClick={() => scrollToSection(index)}
              sx={{
                position: 'relative',
                fontWeight: activeSection === index ? 'bold' : 'normal',
                color: 'white',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: activeSection === index ? '100%' : '0',
                  height: '2px',
                  bottom: 0,
                  left: 0,
                  backgroundColor: 'white',
                  transition: 'width 0.3s ease', // Animate underline width
                },
              }}
            >
              {section.title}
            </Button>
          ))}
        </nav>
      </Box>
    </Box>
  );
};

export default Header;
