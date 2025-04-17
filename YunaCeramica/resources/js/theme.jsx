import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      mode: 'light', // Cambia a 'dark' por defecto si deseas usar el modo oscuro
      primary: {
        main: '#f8bbd0', // Rosa pastel
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: '#fff', // Claro para el modo 'light'
        paper: '#f5f5f5', // Claro para el modo 'light'
      },
      text: {
        primary: '#000',
        secondary: '#555',
      },
      // Modo oscuro
      darkMode: {
        primary: {
          main: '#f48fb1', // Cambiar a un tono más oscuro de rosa
        },
        background: {
          default: '#121212', // Fondo oscuro
          paper: '#1e1e1e', // Fondo más oscuro para los elementos
        },
        text: {
          primary: '#fff',
          secondary: '#ccc',
        },
      },
    },
  });

export default theme;