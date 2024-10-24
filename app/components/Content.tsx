import React, { ReactNode, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { parseFormattedText } from '../utils/text'; // Adjust the import path as necessary

interface ContentProps {
  children: ReactNode; // Children can be a formatted string or React nodes
  onSectionChange: (index: number) => void; // Callback for section change
  activeSection: number; // New prop to indicate the currently active section
}

const Content: React.FC<ContentProps> = ({ children, onSectionChange, activeSection }) => {
  const childrenArray = React.Children.toArray(children);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>(Array(childrenArray.length).fill(null));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLDivElement | null; // Cast to HTMLDivElement

            if (target) {
              const index = sectionRefs.current.indexOf(target);
              if (index !== -1) {
                onSectionChange(index); // Notify parent component of the active section
              }
            }
          }
        });
      },
      { threshold: 0.5 } // Detect when 50% of the section is visible
    );

    const currentRefs = sectionRefs.current;

    currentRefs.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      currentRefs.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [onSectionChange]);

  // Effect to scroll to the active section smoothly
  useEffect(() => {
    const activeSectionRef = sectionRefs.current[activeSection]; // Get the current active section
    if (activeSectionRef) {
      activeSectionRef.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the active section
    }
  }, [activeSection]);

  return (
    <Box
      sx={{
        height: 'calc(100vh - 450px)', // Subtract header height
        overflowY: 'auto', // Allow vertical scrolling
        padding: '200px',
      }}
    >
      {childrenArray.map((child, index) => (
        <Box
          key={index}
          ref={(el) => {
            sectionRefs.current[index] = el as HTMLDivElement | null; 
          }}
          sx={{
            marginTop: index === 0 ? 0 : '200px', // No top margin for the first child
            marginBottom: index === childrenArray.length - 1 ? 0 : '200px', // No bottom margin for the last child
          }}
        >
          {/* Check if child is a string, and parse it; otherwise, render it directly */}
          {typeof child === 'string' ? parseFormattedText(child) : child}
        </Box>
      ))}
    </Box>
  );
};

export default Content;