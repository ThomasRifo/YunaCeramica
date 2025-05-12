// resources/js/Pages/Talleres/Edit.jsx

import * as React from 'react';
import { router, useForm } from '@inertiajs/react';
import { Box, TextField, Button, Typography, FilledInput, InputAdornment, OutlinedInput, FormControl, FormHelperText, Select, MenuItem, Link, Grid } from '@mui/material';
import InputLabel from '@/Components/InputLabel';
import dayjs from 'dayjs';
import { useTheme } from "@mui/material/styles";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MenuSelector from '@/Components/MenuSelector';
import { AppProvider } from "@toolpad/core/AppProvider";
import useInertiaRouter from "../../../Layouts/InertiaRouterAdapter";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';


export default function Edit({ taller, subcategorias, menus }) {
  const router = useInertiaRouter();
  const { data, setData, put, processing, errors } = useForm({
    nombre: taller.nombre || '',
    fecha: taller.fecha || '',
    hora: taller.hora || '',
    precio: taller.precio || '',
    cupoMaximo: taller.cupoMaximo || '',
    descripcion: taller.descripcion || '',
    ubicacion: taller.ubicacion || '',
    idSubcategoria: taller.idSubcategoria || '',
    menus: taller.menus?.map(menu => menu.id) || [],
  });

  const [menuHtmls, setMenuHtmls] = React.useState(() => {
    const initialHtmls = {};
    taller.menus.forEach(menu => {
      initialHtmls[menu.id] = menu.pivot?.html || '';
    });
    return initialHtmls;
  });
  
  const handleMenuHtmlChange = (menuId, value) => {
    setMenuHtmls(prev => ({ ...prev, [menuId]: value }));
  };
  
  const handleUpdateMenuHtmls = () => {
    const menusData = [];
    for (const [id, html] of Object.entries(menuHtmls)) {
      menusData.push({
        id: parseInt(id),
        html: html || ''
      });
    }

    console.log('Datos a enviar:', menusData);

    axios.put(route('dashboard.talleres.updateMenusHtml', taller.id), {
      menus: menusData
    })
    .then(response => {
      console.log('Menús actualizados correctamente');
      // Opcional: mostrar mensaje de éxito
    })
    .catch(error => {
      console.error('Error al actualizar menús:', error);
      // Opcional: mostrar mensaje de error
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  

    const payload = {
      ...data,
      menuIds: data.menus,  
    };
    if (data.hora && !data.hora.includes(':')) {
      const parsed = dayjs(data.hora).format('HH:mm');
      setData('hora', parsed);
    }
    put(route('dashboard.talleres.update', taller.id), {
      preserveScroll: true,
      data: payload,
    });
  };

   const theme = useTheme();
  
    const toggleColorMode = () => {
      setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

  return (
    <>

    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Editar Taller
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
  sx={{
    width: 'calc(50% - 12px)', // 50% menos 12px de margen
    mr: 3,
  }}
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
  sx={{
    width: 'calc(50% - 12px)',
  }}
  label="Hora"
  type="time"
  value={data.hora}
  onChange={(e) => setData('hora', e.target.value)}
  InputLabelProps={{ shrink: true }}
  inputProps={{ step: 60 }} // 🔥 solo horas y minutos
  error={!!errors.hora}
  helperText={errors.hora}
  margin="normal"
/>


<TextField
        fullWidth
        label="Precio"
        sx={{
          width: 1/4,
          mr: 3
        }}
        slotProps={{

            input: {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            },
          }}
        type="number"
        value={data.precio}
        onChange={(e) => setData('precio', e.target.value)}
        error={!!errors.precio}
        helperText={errors.precio}
        margin="normal"
        
      />
<TextField
        sx={{
          width: 1/6
        }}
        label="Cupo Máximo"
        value={data.cupoMaximo}
        onChange={(e) => setData('cupoMaximo', e.target.value)}
        error={!!errors.cupoMaximo}
        helperText={errors.cupoMaximo}
        margin="normal"
      />

<FormControl          
  error={!!errors.idSubcategoria}
  sx={{
    width: '50%',              
    ml: 3,
    mt: 2,                    
  }}
>
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

  <FormHelperText>
    {errors.idSubcategoria}
  </FormHelperText>
</FormControl>

<MenuSelector
  menus={menus}  // todos los menús disponibles
  selectedMenus={menus.filter(menu => data.menus.includes(menu.id))}  // los objetos completos de los menús seleccionados
  onChange={(newMenuObjects) => {
    const menuIds = newMenuObjects.map(menu => menu.id); // solo IDs
    setData('menus', menuIds);
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





<Box mt={3} className="mb-10">
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

          Guardar Cambios
        </Button>
      </Box>
    </Box>
    <Box mt={4} className="mb-10" >
  <Typography variant="h6" gutterBottom>Contenido HTML de cada Menú</Typography>
  <Grid container spacing={2}>
  {taller.menus.map(menu => (
    <Grid item xs={12} sm={6} md={4} key={menu.id} className="w-1/4 p-1 mb-20">
      <Typography variant="subtitle2" gutterBottom>
        {menu.nombre || `Menú ${menu.id}`}
      </Typography>
      <ReactQuill
        theme="snow"
        value={menuHtmls[menu.id] || ''}
        onChange={(value) => handleMenuHtmlChange(menu.id, value)}
        style={{ height: 200 }}
      />
    </Grid>
  ))}
</Grid>


  <Button
    onClick={handleUpdateMenuHtmls}
    variant="outlined"
    color="secondary"
    sx={{ mt: 2 }}
  >
    Guardar Contenido de Menús
  </Button>
</Box>

    </>
  );
}
