import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Snackbar, Alert } from '@mui/material';
import { Delete, CloudUpload, DragIndicator } from '@mui/icons-material';

export default function Create({ subcategorias }) {
  const [imagenes, setImagenes] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data, setData, post, processing, errors } = useForm({
    nombre: '',
    descripcion: '',
    idSubcategoria: '',
    precio: '',
    stock: '',
    sku: '',
    peso: '',
    dimensiones: '',
    tags: '',
    descuento: '',
  });

  // Filtrar solo subcategorías de productos (categoría ID 1)
  const subcategoriasProductos = subcategorias.filter(sub => sub.idCategoria === 1);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Guardar solo los archivos, crear previews en el render
    const nuevasImagenes = files.map(file => ({
      file,
    }));

    setImagenes(prev => [...prev, ...nuevasImagenes]);
  };

  const handleRemoveImage = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
  };



  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImagenes = [...imagenes];
    const draggedItem = newImagenes[draggedIndex];
    
    newImagenes.splice(draggedIndex, 1);
    newImagenes.splice(dropIndex, 0, draggedItem);
    
    setImagenes(newImagenes);
    setDraggedIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (imagenes.length === 0) {
      setSnackbar({ open: true, message: 'Debes agregar al menos una imagen', severity: 'error' });
      return;
    }

    const formData = new FormData();
    
    // Agregar datos del producto
    Object.keys(data).forEach(key => {
      if (data[key] !== '' && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    // Agregar imágenes con su orden
    imagenes.forEach((img, index) => {
      formData.append(`imagenes[${index}]`, img.file);
      formData.append(`orden[${index}]`, index);
    });

    router.post(route('dashboard.productos.store'), formData, {
      forceFormData: true,
      onSuccess: () => {
        setSnackbar({ open: true, message: 'Producto creado exitosamente', severity: 'success' });
        setTimeout(() => {
          router.visit(route('dashboard.productos.index'));
        }, 1500);
      },
      onError: (errors) => {
        setSnackbar({ open: true, message: 'Error al crear el producto. Verifica los campos.', severity: 'error' });
        console.error(errors);
      },
    });
  };

  // No necesitamos cleanup ya que creamos las URLs en el render

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Producto
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4 }}>
          {/* Columna Izquierda - Datos del Producto */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre del Producto"
              value={data.nombre}
              onChange={(e) => setData('nombre', e.target.value)}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />

            <TextField
              fullWidth
              label="Descripción"
              value={data.descripcion}
              onChange={(e) => setData('descripcion', e.target.value)}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
              multiline
              rows={4}
              required
            />

            <FormControl fullWidth error={!!errors.idSubcategoria}>
              <InputLabel>Subcategoría</InputLabel>
              <Select
                value={data.idSubcategoria}
                onChange={(e) => setData('idSubcategoria', e.target.value)}
                label="Subcategoría"
                required
              >
                {subcategoriasProductos.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>
                    {sub.nombre}
                  </MenuItem>
                ))}
              </Select>
              {errors.idSubcategoria && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.idSubcategoria}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="SKU"
              value={data.sku}
              onChange={(e) => setData('sku', e.target.value)}
              error={!!errors.sku}
              helperText={errors.sku}
              required
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={data.precio}
                onChange={(e) => setData('precio', e.target.value)}
                error={!!errors.precio}
                helperText={errors.precio}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                required
              />

              <TextField
                fullWidth
                label="Descuento (%)"
                type="number"
                value={data.descuento}
                onChange={(e) => setData('descuento', e.target.value)}
                error={!!errors.descuento}
                helperText={errors.descuento}
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={data.stock}
                onChange={(e) => setData('stock', e.target.value)}
                error={!!errors.stock}
                helperText={errors.stock}
                inputProps={{ min: 0 }}
                required
              />

              <TextField
                fullWidth
                label="Peso (kg)"
                type="number"
                value={data.peso}
                onChange={(e) => setData('peso', e.target.value)}
                error={!!errors.peso}
                helperText={errors.peso}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Box>

            <TextField
              fullWidth
              label="Dimensiones (ej: 10x10x5 cm)"
              value={data.dimensiones}
              onChange={(e) => setData('dimensiones', e.target.value)}
              error={!!errors.dimensiones}
              helperText={errors.dimensiones}
              required
            />

            <TextField
              fullWidth
              label="Tags (separados por comas)"
              value={data.tags}
              onChange={(e) => setData('tags', e.target.value)}
              error={!!errors.tags}
              helperText={errors.tags}
              placeholder="cerámica, artesanal, decorativo"
            />
          </Box>

          {/* Columna Derecha - Imágenes */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Imágenes del Producto
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Arrastra las imágenes para reordenarlas. La primera será la imagen principal.
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Agregar Imágenes
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {imagenes.length === 0 ? (
              <Box
                sx={{
                  border: '2px dashed #e0e0e0',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <CloudUpload sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">
                  No hay imágenes. Haz clic en "Agregar Imágenes" para comenzar.
                </Typography>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 2,
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  p: 1
                }}
              >
                {imagenes.map((img, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1',
                    cursor: draggedIndex === index ? 'grabbing' : 'grab',
                    opacity: draggedIndex === index ? 0.5 : 1,
                    transition: 'all 0.2s',
                    border: draggedIndex === index ? '2px dashed #1976d2' : '1px solid #e0e0e0',
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: '#f5f5f5',
                    '&:hover': {
                      boxShadow: draggedIndex === index ? 'none' : 2,
                      '& .delete-button': {
                        opacity: 1,
                      }
                    }
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver(e);
                    if (draggedIndex !== null && draggedIndex !== index) {
                      e.currentTarget.style.border = '2px dashed #ff9800';
                    }
                  }}
                  onDragLeave={(e) => {
                    if (draggedIndex !== index) {
                      e.currentTarget.style.border = '1px solid #e0e0e0';
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.border = '1px solid #e0e0e0';
                    handleDrop(e, index);
                  }}
                >
                  {/* Preview de la imagen - Ocupa todo el contenedor */}
                  {img && img.file ? (
                    <img
                      src={URL.createObjectURL(img.file)}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'text.secondary',
                        bgcolor: '#fafafa',
                        gap: 1,
                      }}
                    >
                      <CloudUpload sx={{ fontSize: 40, opacity: 0.3 }} />
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        Sin imagen
                      </Typography>
                    </Box>
                  )}

                  {/* Badge de Imagen Principal */}
                  {index === 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <DragIndicator sx={{ fontSize: '1rem' }} />
                      Principal
                    </Box>
                  )}

                  {/* Botón de eliminar - Visible en hover */}
                  <IconButton
                    className="delete-button"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'error.main',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        bgcolor: 'error.dark',
                      },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => router.visit(route('dashboard.productos.index'))}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={processing || imagenes.length === 0}
          >
            {processing ? 'Creando...' : 'Crear Producto'}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

