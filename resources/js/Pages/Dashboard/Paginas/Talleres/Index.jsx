import { Link } from '@inertiajs/react';
import { Button, Typography, Box } from '@mui/material';

export default function Index({ subcategorias = [] }) {
  // Colores alternados para los botones
  const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
  
  return (
    <Box className="max-w-3xl mx-auto p-6 space-y-8">
      <Typography variant="h4" className="text-center">
        Editar página de talleres
      </Typography>

      <Box className="flex flex-col items-center gap-4">
        {subcategorias.length > 0 ? (
          subcategorias.map((subcategoria, index) => (
            <Button
              key={subcategoria.id}
              variant="contained"
              color={colors[index % colors.length]}
              fullWidth
              component={Link}
              href={route('dashboard.paginas.talleres.imagenes.edit', { slug: subcategoria.url })}
            >
              Editar {subcategoria.nombre}
            </Button>
          ))
        ) : (
          <Typography variant="body1" className="text-center text-gray-500">
            No hay subcategorías disponibles
          </Typography>
        )}
      </Box>
    </Box>
  );
}
