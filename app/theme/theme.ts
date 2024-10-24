import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Set the theme to dark mode
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
    background: {
      default: '#000000', // Set the default background to black
      paper: '#1A1A1A', // Set the background for Material-UI Paper components (optional)
    },
    text: {
      primary: '#ffffff', // Set primary text color to white
      secondary: '#B0BEC5', // Optional: Define secondary text color if needed
    },
  },
});

export default theme;
