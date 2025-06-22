import React from 'react';
import Box from '@mui/material/Box';

const SubcategoriaImage = ({ url, alt }) => {
  if (!url) {
    return (
      <Box
        sx={{ width: 80, height: 80, bgcolor: '#e0e0e0', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Placeholder gris */}
      </Box>
    );
  }
  return (
    <img src={url} alt={alt} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
  );
};

export default SubcategoriaImage; 