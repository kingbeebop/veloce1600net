// utils/text.tsx
import React from 'react';

/**
 * Parses a formatted string and returns an array of React elements.
 * Supports **bold** and _italic_ formatting.
 *
 * @param text - The input string to parse.
 * @returns An array of React nodes.
 */
export const parseFormattedText = (text: string): React.ReactNode => {
  const formattedText = text.split(/(\*\*.*?\*\*|_.*?_)/g).map((part, index) => {
    // Handle bold text
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>; // Remove ** and wrap in <strong>
    }
    // Handle italic text
    else if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={index}>{part.slice(1, -1)}</em>; // Remove _ and wrap in <em>
    }
    // Return normal text as is, wrapped in a <span>
    return <span key={index}>{part}</span>; 
  });

  return <>{formattedText}</>; // Wrap in a React fragment for proper rendering
};
