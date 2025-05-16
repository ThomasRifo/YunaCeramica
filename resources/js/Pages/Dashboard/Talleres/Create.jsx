// resources/js/Pages/Talleres/Create.jsx

import * as React from 'react';
import { router, useForm } from '@inertiajs/react';
import { Box, TextField, Button, Typography, InputAdornment, FormControl, FormHelperText, Select, MenuItem } from '@mui/material';
import InputLabel from '@/Components/InputLabel';
import { useTheme } from "@mui/material/styles";
import MenuSelector from '@/Components/MenuSelector';


export default function Create({ subcategorias, menus }) {
  const { data, setData, post, processing, errors } = useForm({
    nombre: '',
    descripcion: '',
    fecha: '',
    hora: '',
    precio: '',
    cupoMaximo: '',
    ubicacion: '',
    idSubcategoria: '',
    menus: [],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Asegúrate de que solo los IDs sean enviados, no los objetos completos
    const menuIds = data.menus.map(menu => menu.id);  // Extrae solo los IDs de los menús seleccionados
    console.log(menuIds)
    post(route('dashboard.talleres.store'), {
menuIds, 
    });
  };

  const theme = useTheme();

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Crear Taller
      </Typography>

      <TextField
        fullWidth
        label="Nombre"
        value={data.nombre}
        onChange={(e) => setData('nombre', e.target.value)}
        error={!!errors.nombre}
        helperText={errors.nombre}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Descripcion"
        value={data.descripcion}
        onChange={(e) => setData('descripcion', e.target.value)}
        error={!!errors.descripcion}
        helperText={errors.descripcion}
        margin="normal"
      />

      <TextField
        fullWidth
        sx={{ width: 'calc(50% - 12px)', mr: 3 }}
        label="Fecha"
        type="date"
        value={data.fecha}
        onChange={(e) => setData('fecha', e.target.value)}
        InputLabelProps={{ shrink: true }}
        error={!!errors.fecha}
        helperText={errors.fecha}
        margin="normal"
      />

      <TextField
        fullWidth
        sx={{ width: 'calc(50% - 12px)' }}
        label="Hora"
        type="time"
        value={data.hora}
        onChange={(e) => setData('hora', e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 60 }}
        error={!!errors.hora}
        helperText={errors.hora}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Precio"
        sx={{ width: 1 / 4, mr: 3 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        type="number"
        value={data.precio}
        onChange={(e) => setData('precio', e.target.value)}
        error={!!errors.precio}
        helperText={errors.precio}
        margin="normal"
      />

      <TextField
        sx={{ width: 1 / 6 }}
        label="Cupo Máximo"
        value={data.cupoMaximo}
        onChange={(e) => setData('cupoMaximo', e.target.value)}
        error={!!errors.cupoMaximo}
        helperText={errors.cupoMaximo}
        margin="normal"
      />

      <FormControl error={!!errors.idSubcategoria} sx={{ width: '50%', ml: 3, mt: 2 }}>
      <InputLabel className='MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiFormLabel-filled MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined css-113d811-MuiFormLabel-root-MuiInputLabel-root'>Tipo de taller</InputLabel>
      
        <Select
labelId="select-subcategoria-label"
id="select-subcategoria"
variant="outlined" 
label="Tipo de taller"
          value={data.idSubcategoria}
          onChange={(e) => setData('idSubcategoria', e.target.value)}
        >
          {subcategorias.map((sub) => (
            <MenuItem key={sub.id} value={sub.id}>
              {sub.nombre}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{errors.idSubcategoria}</FormHelperText>
      </FormControl>

      <MenuSelector
  menus={menus}  // El array completo de menús
  selectedMenus={menus.filter(menu => data.menus.includes(menu.id))}  // Solo pasamos los objetos completos
  onChange={(newMenuIds) => {
    // Verifica el tipo de datos que llega en newMenuIds
   

    // Si newMenuIds es un array de objetos, extraemos solo los IDs
    const menuIds = newMenuIds.map(menu => menu.id);  // Extraemos los IDs

    // Actualizamos el estado solo con los IDs
    setData('menus', menuIds);  // Solo guardamos los IDs en el estado
  }}
/>

      <TextField
        fullWidth
        label="Ubicación"
        value={data.ubicacion}
        onChange={(e) => setData('ubicacion', e.target.value)}
        error={!!errors.ubicacion}
        helperText={errors.ubicacion}
        margin="normal"
      />

      <Box mt={3}>
        <Button
          type="submit"
          variant={theme.palette.mode === "dark" ? "outlined" : "contained"}
          disabled={processing}
          sx={{
            bgcolor: theme.palette.mode === "dark" ? 'transparent' : '#f8bbd0',
            color: theme.palette.mode === "dark" ? '#f8bbd0' : '#000',
            borderColor: theme.palette.mode === "dark" ? '#f8bbd0' : undefined,
            '&:hover': {
              bgcolor: theme.palette.mode === "dark" ? '#f8bbd0' : '#f48fb1',
              color: '#000',
              transition: 'all 0.3s ease-in-out',
            }
          }}
        >
          Crear Taller
        </Button>
      </Box>
    </Box>
  );
}
