import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

export default function View({ taller, tallerClientes, acompaniantes }) {
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const acompByCliente = acompaniantes.reduce((acc, a) => {
    if (!acc[a.idTallerCliente]) acc[a.idTallerCliente] = [];
    acc[a.idTallerCliente].push(a);
    return acc;
  }, {});

  let rows = [];
  let groupId = 0;

  tallerClientes.forEach((tc) => {
    groupId++;
    const baseRow = {
      id: `tc-${tc.id}`,
      realId: tc.id,
      tipo: 'cliente',
      nombre: tc.cliente?.name,
      apellido: tc.cliente?.apellido,
      estadoPago: tc.estado_pago?.nombre,
      estadoPagoId: tc.estado_pago?.id,
      menu: tc.menu?.nombre || 'Sin seleccionar',
      email: tc.cliente?.email,
      telefono: tc.cliente?.telefono,
      group: groupId,
      clienteId: tc.id,
    };
    rows.push(baseRow);

    if (tc.pagoGrupal && acompByCliente[tc.id]) {
      acompByCliente[tc.id].forEach((a) => {
        rows.push({
          id: `ac-${a.id}`,
          tipo: 'acompaniante',
          nombre: a.nombre,
          apellido: a.apellido,
          estadoPago: tc.estado_pago?.nombre,
          estadoPagoId: tc.estado_pago?.id,
          menu: a.menu?.nombre || 'Sin seleccionar',
          email: a.email,
          telefono: a.telefono,
          group: groupId,
          clienteId: tc.id,
        });
      });
    }
  });

  const handleUpdatePago = () => {
    if (!selectedParticipant) return;
  
    router.put(
      route('dashboard.taller.actualizarPago', selectedParticipant.realId),
      {},
      {
        preserveScroll: true,
        onSuccess: () => setOpen(false),
      }
    );
  
    setConfirmOpen(false);
  };

  const columns = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { field: 'estadoPago', headerName: 'Estado de pago', flex: 1 },
    { field: 'menu', headerName: 'Menú', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'telefono', headerName: 'Teléfono', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => {
        if (
          params.row.tipo === 'cliente' &&
          params.row.estadoPagoId === 2
        ) {
          return (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedParticipant(params.row);
                setConfirmOpen(true);
              }}
            >
              Actualizar pago
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <>
      <Head title={`Taller - ${taller.titulo}`} />

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard">
            Dashboard
          </Link>
          <Link underline="hover" color="inherit" href="/dashboard/talleres">
            Talleres
          </Link>
          <Typography color="text.primary">{taller.titulo}</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" gutterBottom>
        {taller.nombre}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Información general</Typography>
          <Typography>Fecha: {dayjs(taller.fecha).format('DD-MM-YYYY')}</Typography>
          <Typography>Ubicación: {taller.ubicacion}</Typography>
          <Typography>Capacidad: {taller.cupoMaximo}</Typography>
          <Typography>Descripción: {taller.descripcion}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>Participantes</Typography>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowClassName={(params) =>
            params.row.group % 2 === 0 ? 'grupo-even' : 'grupo-odd'
          }
          hideFooterPagination
          sx={{
            border: 0,
            '& .grupo-even': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
            },
            '& .grupo-odd': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#ffe6ef',
            },
            '& .MuiDataGrid-columnHeaders': {
              borderTop: '2px solid',
              borderBottom: '2px solid',
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.paper,
              position: 'sticky',
              top: 0,
              zIndex: 1,
            },
            '& .MuiDataGrid-columnHeader': {
              px: 2,
            },
            '& .MuiDataGrid-cell': {
              px: 2,
            },
          }}
        />
      </Paper>

      {/* Diálogo de confirmación */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Actualizar estado de pago</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas actualizar el estado de pago de{' '}
            <strong>{selectedParticipant?.nombre} {selectedParticipant?.apellido}</strong> a <strong>Pagado</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpdatePago} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
