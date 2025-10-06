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
  Select,
  MenuItem,
  FormControl,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { Download as DownloadIcon, Email as EmailIcon } from '@mui/icons-material';
import EmailModal from './EmailModal';

export default function View({ taller, tallerClientesPagados, tallerClientesPendientes }) {
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [updatePagoOpen, setUpdatePagoOpen] = useState(false);
  const [selectedPendiente, setSelectedPendiente] = useState(null);
  const [estadoEdicion, setEstadoEdicion] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cambiosAConfirmar, setCambiosAConfirmar] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [confirmarPagoParcialOpen, setConfirmarPagoParcialOpen] = useState(false);
  const [participantePagoParcial, setParticipantePagoParcial] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Declaración de todas las variables necesarias
  let totalRecaudado = 0;
  const grupos = {};
  const resumenGrupos = {};
  const resumenMenus = {};
  let groupId = 0;
  let rows = [];

  // Crear el objeto acompByCliente usando los acompañantes de cada tallerCliente
  const acompByCliente = tallerClientesPagados.reduce((acc, tc) => {
    if (tc.acompaniantes && tc.acompaniantes.length > 0) {
      acc[tc.id] = tc.acompaniantes;
    }
    return acc;
  }, {});

  // Generación de filas y cálculo del total recaudado
  tallerClientesPagados.forEach((tc) => {
    groupId++;
    const baseRow = {
      id: `tc-${tc.id}`,
      realId: tc.id,
      tipo: 'cliente',
      nombre: tc.nombre_cliente || tc.cliente?.name,
      apellido: tc.apellido_cliente || tc.cliente?.apellido,
      estadoPago: tc.estado_pago?.nombre,
      estadoPagoId: tc.estado_pago?.id,
      menu: tc.menu?.nombre || 'Sin seleccionar',
      email: tc.email_cliente || tc.cliente?.email,
      telefono: tc.telefono_cliente || tc.cliente?.telefono,
      metodoPago: tc.metodo_pago?.nombre || 'No especificado',
      group: groupId,
      clienteId: tc.id,
    };
    rows.push(baseRow);

    // Calcular total recaudado
    if (tc.estado_pago?.id === 3) {
      totalRecaudado += tc.cantPersonas * taller.precio;
    } else if (tc.estado_pago?.id === 2) {
      totalRecaudado += tc.cantPersonas * (taller.precio / 2);
    }

    if (tc.acompaniantes && tc.acompaniantes.length > 0) {
      tc.acompaniantes.forEach((a) => {
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
          metodoPago: tc.metodo_pago?.nombre || 'No especificado',
          group: groupId,
          clienteId: tc.id,
        });
      });
    }
  });

  const handleUpdatePago = (nuevoEstado) => {
    if (!selectedPendiente) return;
  
    router.put(
      route('dashboard.taller.actualizarPago', selectedPendiente.realId),
      { nuevoEstado },
      {
        preserveScroll: true,
        onSuccess: () => {
          setUpdatePagoOpen(false);
          setSelectedPendiente(null);
        },
      }
    );
  };

  // Columnas para la tabla de pagados/parciales
  const columnsPagados = [
    { field: 'numero', headerName: '#', width: 60 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { 
      field: 'estadoPago', 
      headerName: 'Estado de pago', 
      flex: 1,
      renderCell: (params) => {
        if (params.row.tipo === 'cliente' && params.row.estadoPagoId === 2) {
          return (
            <FormControl fullWidth size="small">
              <Select
                value={params.row.estadoPagoId}
                displayEmpty
                onChange={(e) => {
                  if (e.target.value === 3) {  // Solo si se selecciona "Pagado"
                    setParticipantePagoParcial(params.row);
                    setConfirmarPagoParcialOpen(true);
                  }
                }}
              >
                <MenuItem value={2}>Pago Parcial</MenuItem>
                <MenuItem value={3}>Pagado</MenuItem>
              </Select>
            </FormControl>
          );
        }
        return params.row.estadoPago;
      }
    },
    { field: 'menu', headerName: 'Menú', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'telefono', headerName: 'Teléfono', flex: 1 },
    { field: 'metodoPago', headerName: 'Método de pago', flex: 1 },
  ];

  // Columnas para la tabla de pendientes (agrego método de pago y select de estado)
  const columnsPendientes = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { field: 'estadoPago', headerName: 'Estado de pago', flex: 1 },
    { field: 'menu', headerName: 'Menú', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'telefono', headerName: 'Teléfono', flex: 1 },
    { field: 'metodoPago', headerName: 'Método de pago', flex: 1 },
    {
      field: 'nuevoEstado',
      headerName: 'Nuevo estado',
      flex: 1,
      renderCell: (params) => {
        if (params.row.tipo === 'cliente') {
          return (
            <FormControl fullWidth size="small">
              <Select
                value={estadoEdicion[params.row.realId] ?? ''}
                displayEmpty
                onChange={e => {
                  setEstadoEdicion(prev => ({ ...prev, [params.row.realId]: e.target.value }));
                }}
              >
                <MenuItem value="">Sin cambio</MenuItem>
                <MenuItem value={2}>Pago Parcial</MenuItem>
                <MenuItem value={3}>Pagado</MenuItem>
              </Select>
            </FormControl>
          );
        }
        return null;
      },
    },
  ];

  tallerClientesPagados.forEach(tc => {
    const referido = tc.referido || `individual-${tc.id}`; // si no tiene referido, lo consideramos individual
    if (!grupos[referido]) grupos[referido] = [];
    grupos[referido].push({
      nombre: tc.cliente?.name,
      apellido: tc.cliente?.apellido,
      menu: tc.menu?.nombre,
    });
  
    // Si tiene acompañantes, sumarlos al grupo
    if (tc.acompaniantes && tc.acompaniantes.length > 0) {
      tc.acompaniantes.forEach(a => {
        grupos[referido].push({
          nombre: a.nombre,
          apellido: a.apellido,
          menu: a.menu?.nombre,
        });
      });
    }
  });
  
  // Crear mapeo de códigos de referido a groupId
  const referidoToGroupId = {};
  let currentGroupId = 0;
  
  // Primero, asignar groupIds únicos a cada código de referido
  tallerClientesPagados.forEach(tc => {
    const referido = tc.referido || `individual-${tc.id}`;
    if (!referidoToGroupId[referido]) {
      referidoToGroupId[referido] = ++currentGroupId;
    }
  });

  // Generar filas para pagados/parciales con numeración correlativa
  const rowsPagados = [];
  let numeroCorrelativo = 1;
  tallerClientesPagados.forEach((tc) => {
    const referido = tc.referido || `individual-${tc.id}`;
    const groupId = referidoToGroupId[referido];
    
    const baseRow = {
      numero: numeroCorrelativo++,
      id: `tc-${tc.id}`,
      realId: tc.id,
      tipo: 'cliente',
      nombre: tc.nombre_cliente || tc.cliente?.name,
      apellido: tc.apellido_cliente || tc.cliente?.apellido,
      estadoPago: tc.estado_pago?.nombre,
      estadoPagoId: tc.estado_pago?.id,
      menu: tc.menu?.nombre || 'Sin seleccionar',
      email: tc.email_cliente || tc.cliente?.email,
      telefono: tc.telefono_cliente || tc.cliente?.telefono,
      metodoPago: tc.metodo_pago?.nombre || 'No especificado',
      group: groupId,
      clienteId: tc.id,
    };
    rowsPagados.push(baseRow);
    if (tc.acompaniantes && tc.acompaniantes.length > 0) {
      tc.acompaniantes.forEach((a) => {
        rowsPagados.push({
          numero: numeroCorrelativo++,
          id: `ac-${a.id}`,
          tipo: 'acompaniante',
          nombre: a.nombre,
          apellido: a.apellido,
          estadoPago: tc.estado_pago?.nombre,
          estadoPagoId: tc.estado_pago?.id,
          menu: a.menu?.nombre || 'Sin seleccionar',
          email: a.email,
          telefono: a.telefono,
          metodoPago: tc.metodo_pago?.nombre || 'No especificado',
          group: groupId,
          clienteId: tc.id,
        });
      });
    }
  });
  // Resumen de menús
  rowsPagados.forEach(row => {
    const menu = row.menu || 'Sin seleccionar';
    if (!resumenMenus[menu]) resumenMenus[menu] = 0;
    resumenMenus[menu]++;
  });

  // Calcular cantidad de participantes confirmados (pagados o parciales)
  const cantidadConfirmados = rowsPagados.length;

  // Calcular resumen de grupos
  rowsPagados.forEach(row => {
    const grupo = row.group;
    if (!resumenGrupos[grupo]) {
      resumenGrupos[grupo] = 0;
    }
    resumenGrupos[grupo]++;
  });

  // Convertir el resumen de grupos a un formato más amigable
  const gruposFormateados = {};
  Object.values(resumenGrupos).forEach(cantidad => {
    const tipo = cantidad === 1 ? 'Individual' : cantidad === 2 ? 'Doble' : cantidad === 3 ? 'Triple' : `${cantidad} personas`;
    if (!gruposFormateados[tipo]) {
      gruposFormateados[tipo] = 0;
    }
    gruposFormateados[tipo]++;
  });

  // Botón para guardar todos los cambios
  const handleGuardarCambios = () => {
    // Filtrar solo los cambios válidos (clientes con nuevo estado seleccionado)
    const cambios = Object.entries(estadoEdicion)
      .filter(([id, nuevoEstado]) => nuevoEstado && Number(nuevoEstado) !== 0)
      .map(([id, nuevoEstado]) => {
        const cliente = tallerClientesPendientes.find(tc => tc.id === Number(id));
        return {
          id: Number(id),
          nuevoEstado: Number(nuevoEstado),
          nombre: cliente?.nombre_cliente || cliente?.cliente?.name,
          apellido: cliente?.apellido_cliente || cliente?.cliente?.apellido,
          email: cliente?.email_cliente || cliente?.cliente?.email,
        };
      });
    setCambiosAConfirmar(cambios);
    setConfirmDialogOpen(true);
  };

  const handleConfirmarCambios = async () => {
    setGuardando(true);
    try {
      const response = await fetch(route('dashboard.talleres.actualizarEstadosPagoMasivo'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          cambios: cambiosAConfirmar.map(c => ({ id: c.id, nuevoEstado: c.nuevoEstado })),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResultados(data.resultados);
        setConfirmDialogOpen(false);
        setEstadoEdicion({});
        // Opcional: recargar la página o actualizar los datos localmente
        window.location.reload();
      } else {
        alert('Error al guardar los cambios: ' + (data.error || 'Error desconocido'));
      }
    } catch (e) {
      alert('Error al guardar los cambios: ' + e.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleConfirmarPagoParcial = () => {
    if (!participantePagoParcial) return;

    router.put(
      route('dashboard.taller.actualizarPago', participantePagoParcial.realId),
      { nuevoEstado: 3 },
      {
        preserveScroll: true,
        onSuccess: () => {
          setConfirmarPagoParcialOpen(false);
          setParticipantePagoParcial(null);
        },
      }
    );
  };

  // Crear mapeo de códigos de referido a groupId para pendientes
  const referidoToGroupIdPendientes = {};
  let currentGroupIdPendientes = 0;
  
  // Primero, asignar groupIds únicos a cada código de referido para pendientes
  tallerClientesPendientes.forEach(tc => {
    const referido = tc.referido || `individual-${tc.id}`;
    if (!referidoToGroupIdPendientes[referido]) {
      referidoToGroupIdPendientes[referido] = ++currentGroupIdPendientes;
    }
  });

  // Generar filas para pendientes
  const rowsPendientes = [];
  tallerClientesPendientes.forEach((tc) => {
    const referido = tc.referido || `individual-${tc.id}`;
    const groupId = referidoToGroupIdPendientes[referido];
    
    const baseRow = {
      id: `tc-${tc.id}`,
      realId: tc.id,
      tipo: 'cliente',
      nombre: tc.nombre_cliente || tc.cliente?.name,
      apellido: tc.apellido_cliente || tc.cliente?.apellido,
      estadoPago: tc.estado_pago?.nombre,
      estadoPagoId: tc.estado_pago?.id,
      menu: tc.menu?.nombre || 'Sin seleccionar',
      email: tc.email_cliente || tc.cliente?.email,
      telefono: tc.telefono_cliente || tc.cliente?.telefono,
      metodoPago: tc.metodo_pago?.nombre || 'No especificado',
      group: groupId,
      clienteId: tc.id,
    };
    rowsPendientes.push(baseRow);
    if (tc.acompaniantes && tc.acompaniantes.length > 0) {
      tc.acompaniantes.forEach((a) => {
        rowsPendientes.push({
          id: `ac-${a.id}`,
          tipo: 'acompaniante',
          nombre: a.nombre,
          apellido: a.apellido,
          estadoPago: tc.estado_pago?.nombre,
          estadoPagoId: tc.estado_pago?.id,
          menu: a.menu?.nombre || 'Sin seleccionar',
          email: a.email,
          telefono: a.telefono,
          metodoPago: tc.metodo_pago?.nombre || 'No especificado',
          group: groupId,
          clienteId: tc.id,
        });
      });
    }
  });

  const handleSendEmail = async (emailData) => {
    setIsSendingEmail(true);
    try {
      const response = await fetch(route('dashboard.taller.send-email', taller.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el email');
      }

      setEmailModalOpen(false);
      setToast({
        open: true,
        message: `Emails encolados correctamente. Se enviarán ${data.emailsEncolados} emails.`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error:', error);
      setToast({
        open: true,
        message: error.message || 'Error al enviar el email',
        severity: 'error'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <>
      <Head title={`Taller - ${taller.nombre}`} />

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard">
            Dashboard
          </Link>
          <Link underline="hover" color="inherit" href="/dashboard/talleres">
            Talleres
          </Link>
          <Typography color="text.primary">{taller.nombre}</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography sx={{ mb: 4 }} variant="h4" gutterBottom>{taller.nombre}</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Card sx={{ minWidth: 180, flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle">Fecha: {dayjs(taller.fecha).format('DD-MM-YYYY')}</Typography><br></br>
              
              <Typography variant="subtitle">Ubicación: {taller.ubicacion}</Typography><br></br>
              <Typography variant="subtitle">Precio: ${taller.precio.toLocaleString('es-AR')} </Typography>
        
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 180, flex: 1 }}>
            <CardContent>
              <Typography sx={{ fontSize: '1.3rem' }}>Inscriptos</Typography>
              <Typography>{cantidadConfirmados} / {taller.cupoMaximo}</Typography>
              <LinearProgress variant="determinate" value={Math.min(100, (cantidadConfirmados / taller.cupoMaximo) * 100)} sx={{ height: 10, borderRadius: 5, mt: 1 }} />
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 180, flex: 1 }}>
            <CardContent>
              <Typography sx={{ fontSize: '1.3rem' }}>Total recaudado</Typography>
              <Typography sx={{ fontSize: '1.3rem' }}>${totalRecaudado.toLocaleString('es-AR')}</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EmailIcon />}
            onClick={() => setEmailModalOpen(true)}
          >
            Enviar Email a Participantes
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => window.open(route('talleres.descargar-lista', taller.id), '_blank')}
          >
            Descargar Lista de Participantes
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Card sx={{ minWidth: 220, flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle2">Mesas</Typography>
              <TableContainer component={Paper} sx={{ boxShadow:'none'}}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tamaño</TableCell>
                      <TableCell>Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(gruposFormateados).map(([tipo, cantidad]) => (
                      <TableRow key={tipo}>
                        <TableCell>{tipo}</TableCell>
                        <TableCell>{cantidad}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 220, flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle2">Menús</Typography>
              <TableContainer component={Paper} sx={{ boxShadow:'none'}}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Menú</TableCell>
                      <TableCell>Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(resumenMenus).map(([menu, cantidad]) => (
                      cantidad > 0 && (
                        <TableRow key={menu}>
                          <TableCell>{menu}</TableCell>
                          <TableCell>{cantidad}</TableCell>
                        </TableRow>
                      )
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom> Confirmados</Typography>
      <Paper sx={{ height: 400, width: '100%', mb: 4 }}>
        <DataGrid
          rows={rowsPagados}
          columns={columnsPagados}
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
              backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f7bcd8',
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
          }}
        />
      </Paper>

      <Typography variant="h5" gutterBottom>Pendientes de Pago</Typography>
      <Paper sx={{ height: 400, width: '100%', mb: 2 }}>
        <DataGrid
          rows={rowsPendientes}
          columns={columnsPendientes}
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
              backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f7bcd8',
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
          }}
        />
      </Paper>
      <Button
        variant="contained"
        color="primary"
        disabled={Object.values(estadoEdicion).filter(e => e && Number(e) !== 0).length === 0 || guardando}
        onClick={handleGuardarCambios}
      >
        Guardar cambios
      </Button>

      {/* Diálogo de confirmación masiva */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmar cambios de estado de pago</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Confirmas los siguientes cambios?
          </DialogContentText>
          <ul>
            {cambiosAConfirmar.map((c, idx) => (
              <li key={c.id}>
                Cambiar a <strong>{c.nombre} {c.apellido}</strong> ({c.email}) a <strong>{c.nuevoEstado === 2 ? 'Pago Parcial' : 'Pagado'}</strong>
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={guardando}>Cancelar</Button>
          <Button onClick={handleConfirmarCambios} color="primary" variant="contained" disabled={guardando}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para pago parcial */}
      <Dialog open={confirmarPagoParcialOpen} onClose={() => setConfirmarPagoParcialOpen(false)}>
        <DialogTitle>Confirmar cambio de estado de pago</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Deseas cambiar el estado de pago de <strong>{participantePagoParcial?.nombre} {participantePagoParcial?.apellido}</strong> con correo <strong>{participantePagoParcial?.email}</strong> a pagado?
          </DialogContentText>
          <DialogContentText color="error" sx={{ mt: 2 }}>
            Esta acción no tendrá vuelta atrás.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmarPagoParcialOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarPagoParcial} color="primary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <EmailModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSend={handleSendEmail}
        isLoading={isSendingEmail}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
