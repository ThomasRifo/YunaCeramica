import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, CardActions, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { router } from '@inertiajs/react';

export default function PiezasRealizadas() {
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
    formData.append('tipo', 'realizadas');
    archivos.forEach((file, i) => {
      formData.append('archivos[]', file);
    });
    router.post(route('dashboard.archivos.upload.realizadas'), formData, {
      forceFormData: true,
      onSuccess: () => {
        setMensaje('¡Imágenes subidas correctamente!');
        setArchivos([]);
      },
      onError: () => setMensaje('Error al subir las imágenes.'),
      onFinish: () => setSubiendo(false),
    });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h4" gutterBottom>Piezas Realizadas</Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={subiendo}
            >
              Seleccionar imágenes
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleChange}
              />
            </Button>
            {archivos.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Imágenes seleccionadas:</Typography>
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
  );
} 