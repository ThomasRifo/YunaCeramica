import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, CardActions, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { router } from '@inertiajs/react';
import PiezasParaPintar from './PiezasParaPintar';
import PiezasRealizadas from './PiezasRealizadas';

export default function ArchivosIndex() {
  const [archivos, setArchivos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setArchivos(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (archivos.length === 0) return;
    setSubiendo(true);
    setMensaje('');
    const formData = new FormData();
    archivos.forEach((file, i) => {
      formData.append('archivos[]', file);
    });
    router.post(route('dashboard.archivos.upload'), formData, {
      forceFormData: true,
      onSuccess: () => {
        setMensaje('¡Archivos subidos correctamente!');
        setArchivos([]);
      },
      onError: () => setMensaje('Error al subir archivos.'),
      onFinish: () => setSubiendo(false),
    });
  };

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
        <Typography variant="h4" gutterBottom>Subir Archivos</Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={subiendo}
              >
                Seleccionar archivos
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*,video/*"
                  onChange={handleChange}
                />
              </Button>
              {archivos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Archivos seleccionados:</Typography>
                  <ul>
                    {archivos.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                </Box>
              )}
              {subiendo && <LinearProgress sx={{ mt: 2 }} />}
              {mensaje && <Typography sx={{ mt: 2 }} color={mensaje.includes('Error') ? 'error' : 'primary'}>{mensaje}</Typography>}
            </CardContent>
            <CardActions>
              <Button type="submit" variant="contained" color="primary" disabled={subiendo || archivos.length === 0}>
                Subir
              </Button>
            </CardActions>
          </Card>
        </form>
      </Box>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 8 }}>
        <PiezasParaPintar />
        <PiezasRealizadas />
      </Box>
    </>
  );
} 