import { Link } from '@inertiajs/react';
import { Button, Typography, Box } from '@mui/material';

export default function Index() {
  return (
    <Box className="max-w-3xl mx-auto p-6 space-y-8">
      <Typography variant="h4" className="text-center">
        Editar página de talleres
      </Typography>

      <Box className="flex flex-col items-center gap-4">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          component={Link}
          href={route('dashboard.paginas.talleres.imagenes.edit', { slug: 'ceramica-y-cafe' })}
        >
          Editar Cerámica & Café
        </Button>

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          component={Link}
          href={route('dashboard.paginas.talleres.imagenes.edit', { slug: 'ceramica-y-gin' })}
        >
          Editar Cerámica & Gin
        </Button>
      </Box>
    </Box>
  );
}
