import { Head } from "@inertiajs/react";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Add } from "@mui/icons-material";
import { router } from '@inertiajs/react';
import { useTheme } from "@mui/material/styles";

export default function ProductosIndex({ productos = [] }) {
  const [productoSeleccionado, setProductoSeleccionado] = React.useState(null);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const theme = useTheme();

  const handleEditar = (producto) => {
    router.visit(`/dashboard/productos/${producto.id}/edit`);
  };

  const handleEliminar = (producto) => {
    setProductoSeleccionado(producto);
    setOpenConfirm(true);
  };

  const confirmarEliminar = () => {
    if (productoSeleccionado) {
      router.delete(route('dashboard.productos.destroy', productoSeleccionado.id), {
        onSuccess: () => {
          setOpenConfirm(false);
          setProductoSeleccionado(null);
        }
      });
    }
  };

  const columns = [
    {
      field: "imagen",
      headerName: "Imagen",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const imagenPrincipal = params.row.imagenes && params.row.imagenes.length > 0
          ? `/storage/productos/${params.row.imagenes[0].urlImagen}`
          : '/storage/uploads/placeholder.jpg';
        return (
          <img
            src={imagenPrincipal}
            alt={params.row.nombre}
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
          />
        );
      }
    },
    {
      field: "nombre",
      headerName: "Nombre",
      width: 250,
      sortable: true,
      filterable: false,
    },
    {
      field: "subcategoria",
      headerName: "Subcategoría",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.row.subcategoria?.nombre || '-',
    },
    {
      field: "precio",
      headerName: "Precio",
      width: 120,
      align: "center",
      sortable: true,
      filterable: false,
      renderCell: (params) => `$ ${params.row.precio.toLocaleString('es-AR')}`,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 100,
      align: "center",
      sortable: true,
      filterable: false,
      renderCell: (params) => (
        <span style={{ 
          color: params.row.stock > 0 ? 'green' : 'red',
          fontWeight: params.row.stock === 0 ? 'bold' : 'normal'
        }}>
          {params.row.stock}
        </span>
      ),
    },
    {
      field: "sku",
      headerName: "SKU",
      width: 150,
      sortable: false,
      filterable: false,
    },
    {
      field: "activo",
      headerName: "Estado",
      width: 100,
      align: "center",
      sortable: true,
      filterable: false,
      renderCell: (params) => (
        <span style={{ 
          color: params.row.activo ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {params.row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <IconButton
            size="small"
            onClick={() => handleEditar(params.row)}
            color="primary"
            title="Editar"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEliminar(params.row)}
            color="error"
            title="Eliminar"
          >
            <DeleteForeverIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = productos.data ? productos.data.map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    stock: producto.stock,
    sku: producto.sku,
    activo: producto.activo,
    imagenes: producto.imagenes,
    subcategoria: producto.subcategoria,
  })) : [];

  return (
    <>
      <Head title="Productos - Dashboard" />
      <Paper sx={{ p: 3, height: '100%', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Productos</h2>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.visit('/dashboard/productos/create')}
          >
            Crear Producto
          </Button>
        </div>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          autoHeight
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        />

        {/* Dialog de confirmación de eliminación */}
        <Dialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas eliminar el producto "{productoSeleccionado?.nombre}"?
              Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={confirmarEliminar} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}



