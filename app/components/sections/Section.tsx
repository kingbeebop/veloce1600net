import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SectionProps } from '../../types/section';
import { parseFormattedText } from '../../utils/text'; // Import the utility

const Section: React.FC<SectionProps> = ({ title, header, content, buttons, image }) => {
  if (image) {
    console.log("---");
  }

  return (
    <Box
      id={title.replace(/\s+/g, '-').toLowerCase()} // Set a unique ID for scrolling
      sx={{
        position: 'relative',
        width: '100%',
        height: '400px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      {/* Render Header Only If Not Null */}
      {header && (
        <Typography variant="h2" sx={{ position: 'absolute', top: 20 }}>
          {header}
        </Typography>
      )}
      
      {/* Content Section with Indentation and Spacing */}
      <Box sx={{ position: 'absolute', bottom: 80, padding: 2 }}>
        {content.map((item, index) => (
          <Typography 
            key={index} 
            variant={item.variant} 
            sx={{ marginBottom: 2, textIndent: '2em' }} // Adds indentation and spacing
          >
            {parseFormattedText(item.text)} {/* Use parseFormattedText to format the text */}
          </Typography>
        ))}
      </Box>

      {/* Render Buttons */}
      {buttons && buttons.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            display: 'flex',
            flexDirection: 'row', // Horizontal alignment
            gap: 1, // Space between buttons
          }}
        >
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant="outlined" // Use outlined variant to match the new style
              onClick={button.action}
              sx={{ padding: '10px 20px', textTransform: 'none' }}
            >
              {button.name}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Section;
