import { Box, Breadcrumbs, Link, Typography, Button, Card, CardActions, Snackbar, Alert } from '@mui/material';
import ReactQuill from 'react-quill';
import { useForm, router } from '@inertiajs/react';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import ImageCropperEasy from '@/Components/ImageCropperEasy';
import CircularProgress from '@mui/material/CircularProgress';

const DEFAULT_IMAGE = '/images/default-placeholder.png';

export default function EditImagenesCropper({ slug, imagenes }) {
  const { data, setData, processing } = useForm({
    imagenes: imagenes.map(img => ({
      id: img.id,
      imagen: img.urlImagen,
      nueva_imagen: null,
      texto: img.texto || '',
      crop_x: img.crop_x ?? 0,
      crop_y: img.crop_y ?? 0,
      zoom: img.zoom ?? 1,
    })),
  });

  const [previewUrls, setPreviewUrls] = useState({});
  const [resetTriggers, setResetTriggers] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [guardando, setGuardando] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  // Cuando el cropper termina, actualiza el blob y el preview
  const handleCropComplete = (blob, index) => {
    const url = URL.createObjectURL(blob);
    setPreviewUrls(prev => {
      if (prev[index]) URL.revokeObjectURL(prev[index]);
      return { ...prev, [index]: url };
    });
    setData('imagenes', data.imagenes.map((img, i) => (
      i === index ? { ...img, nueva_imagen: blob } : img
    )));
    setResetTriggers(prev => ({ ...prev, [index]: (prev[index] || 0) + 1 }));
  };

  // Cuando el usuario mueve o hace zoom, actualiza los valores de crop/zoom
  const handleCropChange = (crop, zoom, index) => {
    setData('imagenes', data.imagenes.map((img, i) => (
      i === index ? { ...img, crop_x: crop.x, crop_y: crop.y, zoom } : img
    )));
  };

  // Cuando el usuario sube una nueva imagen, sí se guarda el archivo
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setData('imagenes', data.imagenes.map((img, i) => (
        i === index ? { ...img, nueva_imagen: file } : img
      )));
    }
  };

  const handleTextoChange = (value, index) => {
    setData('imagenes', data.imagenes.map((img, i) => (
      i === index ? { ...img, texto: value } : img
    )));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGuardando(true);
    const formData = new FormData();
    data.imagenes.forEach((img, index) => {
      formData.append(`imagenes[${index}][id]`, img.id);
      formData.append(`imagenes[${index}][texto]`, img.texto || '');
      if (img.nueva_imagen) {
        formData.append(`imagenes[${index}][nueva_imagen]`, img.nueva_imagen);
      }
      formData.append(`imagenes[${index}][crop_x]`, img.crop_x ?? 0);
      formData.append(`imagenes[${index}][crop_y]`, img.crop_y ?? 0);
      formData.append(`imagenes[${index}][zoom]`, img.zoom ?? 1);
    });
    formData.append('_method', 'PUT');
    router.post(route('dashboard.paginas.talleres.imagenes.update', { slug }), formData, {
      forceFormData: true,
      onSuccess: () => {
        setSnackbar({ open: true, message: '¡Cambios guardados correctamente!', severity: 'success' });
        setGuardando(false);
      },
      onError: (errors) => {
        setSnackbar({ open: true, message: 'Error al guardar los cambios', severity: 'error' });
        setGuardando(false);
        console.error(errors);
      },
      onFinish: () => setGuardando(false)
    });
  };

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (guardando) {
      const interval = setInterval(() => {
        setLoadingDots(prev => prev.length < 3 ? prev + '.' : '');
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingDots('');
    }
  }, [guardando]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Link underline="hover" color="inherit" href="/dashboard/talleres">Talleres</Link>
          <Typography color="text.primary">{slug.replaceAll('-', ' ')}</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" className="mb-8 text-center">
        Editar imágenes y textos - {slug.replaceAll('-', ' ')}
      </Typography>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
        {data.imagenes.map((img, index) => {
          // Siempre usar la imagen original
          const imageUrl = img.imagen
            ? img.imagen.startsWith('data:')
              ? img.imagen
              : `/storage/talleres/${img.imagen}`
            : DEFAULT_IMAGE;

          return (
            <Card key={index} className="p-4 space-y-4">
              <Typography variant="h6" gutterBottom>Sección #{index + 1}</Typography>

              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 320px', minWidth: 260, maxWidth: 400 }}>
                  <ImageCropperEasy
                    initialImage={imageUrl}
                    aspectRatio={1.4/1.5}
                    initialCrop={{ x: img.crop_x, y: img.crop_y }}
                    initialZoom={img.zoom}
                    onCropChange={(crop, zoom) => handleCropChange(crop, zoom, index)}
                    buttonText="Cambiar imagen"
                    showButton={true}
                    onFileChange={e => handleFileChange(e, index)}
                  />
                </div>
                <div style={{ flex: '1 1 320px', minWidth: 260, maxWidth: 500, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <ReactQuill
                    value={img.texto}
                    onChange={value => handleTextoChange(value, index)}
                    style={{ height: '200px', minHeight: '360px' }}
                  />
                </div>
              </div>
            </Card>
          );
        })}

        {/* Botón flotante */}
        <div style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
        }}>
          <Button
            variant="contained"
            type="submit"
            disabled={processing || guardando}
            size="large"
            sx={{ boxShadow: 3, minWidth: 220, maxWidth: 220, justifyContent: 'center' }}
          >
            {guardando ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} />
                <span style={{ display: 'inline-block', minWidth: 110, textAlign: 'left' }}>
                  Guardando<span style={{ display: 'inline-block', minWidth: 24 }}>{loadingDots}</span>
                </span>
              </span>
            ) : 'Guardar cambios'}
          </Button>
        </div>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
} 