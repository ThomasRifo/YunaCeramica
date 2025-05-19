import { Box, Breadcrumbs, Link, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import ReactQuill from 'react-quill';
import { useForm, router } from '@inertiajs/react';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';

const DEFAULT_IMAGE = '/images/default-placeholder.png'; // asegurate de tener esta imagen en public/images

export default function EditImagenes({ slug, imagenes, taller }) {
  const { data, setData, post, put, processing } = useForm({
    imagenes: imagenes.map(img => ({
      id: img.id,
      imagen: img.urlImagen,
      nueva_imagen: null,
      texto: img.texto || '',
    })),
  });

  const [previewUrls, setPreviewUrls] = useState({});

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => {
        // Libera el anterior si existe
        if (prev[index]) URL.revokeObjectURL(prev[index]);
        return { ...prev, [index]: url };
      });
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
  
    const formData = new FormData();
  
    data.imagenes.forEach((img, index) => {
      formData.append(`imagenes[${index}][id]`, img.id);
      formData.append(`imagenes[${index}][texto]`, img.texto || '');
  
      if (img.nueva_imagen) {
        formData.append(`imagenes[${index}][nueva_imagen]`, img.nueva_imagen);
      }
    });
  
    formData.append('_method', 'PUT');
  
    router.post(route('dashboard.paginas.talleres.imagenes.update', { slug }), formData, {
      forceFormData: true,
      onSuccess: () => {
        console.log('Actualizado correctamente');
      },
      onError: (errors) => {
        console.error(errors);
      }
    });
  };

  useEffect(() => {
    // Cleanup al desmontar
    return () => {
      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumbs */}
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

      <form onSubmit={handleSubmit}  encType="multipart/form-data" className="space-y-8">
        {data.imagenes.map((img, index) => {
          const imageUrl = img.nueva_imagen
            ? previewUrls[index]
            : img.imagen
            ? `/storage/talleres/${img.imagen}`
            : DEFAULT_IMAGE;

          return (
            <Card key={index} className="p-4">
              <Typography variant="h6" gutterBottom>Sección #{index + 1}</Typography>

              {/* Imagen preview */}
              <Box
                sx={{
                  aspectRatio: '16 / 9',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid #ccc',
                  mb: 2,
                }}
              >
                {img.nueva_imagen ? (
                  <img
                    src={URL.createObjectURL(img.nueva_imagen)}
                    alt={`Preview Imagen ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : img.imagen ? (
                  <img
                    src={`/storage/talleres/${img.imagen}`}
                    alt={`Imagen ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={DEFAULT_IMAGE}
                    alt="Imagen por defecto"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </Box>

              {/* Subir imagen */}
              <Button variant="outlined" component="label">
                {img.nueva_imagen ? 'Imagen seleccionada' : 'Cambiar Imagen'}
                <input hidden type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} />
              </Button>

              {/* Editor de texto */}
              <Box sx={{ mt: 3 }}>
                <ReactQuill
                  value={img.texto}
                  onChange={(value) => handleTextoChange(value, index)}
                  style={{ height: '200px' }}
                />
              </Box>
            </Card>
          );
        })}

        <CardActions className="justify-center">
          <Button variant="contained" type="submit" disabled={processing}>
            Guardar cambios
          </Button>
        </CardActions>
      </form>
    </div>
  );
}