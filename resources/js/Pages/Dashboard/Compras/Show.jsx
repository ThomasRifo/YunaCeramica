import { Head, router } from "@inertiajs/react";
import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Divider,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { ArrowBack, Email, Phone, Save } from "@mui/icons-material";
import dayjs from "dayjs";

export default function ComprasShow({ compra, estadosPago, estadosPedido }) {
  const [estadoPago, setEstadoPago] = React.useState(compra.idEstadoPago);
  const [estadoPedido, setEstadoPedido] = React.useState(compra.idEstado);
  const [tracking, setTracking] = React.useState(compra.tracking || '');
  const [guardando, setGuardando] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, message: '', severity: 'success' });

  const handleGuardar = async () => {
    setGuardando(true);
    
    try {
      const response = await fetch(`/dashboard/compras/${compra.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          idEstadoPago: estadoPago,
          idEstado: estadoPedido,
          tracking: tracking,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToast({
          open: true,
          message: 'Estado actualizado correctamente',
          severity: 'success',
        });
        // Recargar la página para obtener datos actualizados
        router.reload();
      } else {
        setToast({
          open: true,
          message: data.message || 'Error al actualizar el estado',
          severity: 'error',
        });
      }
    } catch (error) {
      setToast({
        open: true,
        message: 'Error al actualizar el estado',
        severity: 'error',
      });
    } finally {
      setGuardando(false);
    }
  };

  const getEstadoPagoColor = (estadoPagoId) => {
    const estado = estadosPago.find(e => e.id === estadoPagoId);
    const nombre = estado?.nombre?.toLowerCase() || '';
    if (nombre === 'pagado') return 'success';
    if (nombre === 'pendiente') return 'warning';
    if (nombre === 'rechazado' || nombre === 'cancelado') return 'error';
    return 'default';
  };

  const getEstadoPedidoColor = (estadoId) => {
    const estado = estadosPedido.find(e => e.id === estadoId);
    const nombre = estado?.nombre?.toLowerCase() || '';
    if (nombre === 'entregado') return 'success';
    if (nombre === 'enviado') return 'info';
    if (nombre === 'pendiente') return 'warning';
    if (nombre === 'cancelado') return 'error';
    return 'default';
  };

  const hayCambios = 
    estadoPago !== compra.idEstadoPago ||
    estadoPedido !== compra.idEstado ||
    tracking !== (compra.tracking || '');

  return (
    <>
      <Head title={`Compra #${compra.id} - Dashboard`} />

      <Box sx={{ p: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              router.visit('/dashboard');
            }}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/dashboard/compras"
            onClick={(e) => {
              e.preventDefault();
              router.visit('/dashboard/compras');
            }}
          >
            Compras
          </Link>
          <Typography color="text.primary">Compra #{compra.id}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Compra #{compra.id}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.visit('/dashboard/compras')}
          >
            Volver
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Información del Cliente */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información del Cliente
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>
                    <strong>Nombre:</strong> {compra.nombre} {compra.apellido}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>
                      <strong>Email:</strong> {compra.email}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => window.location.href = `mailto:${compra.email}`}
                      title="Enviar email"
                    >
                      <Email fontSize="small" />
                    </IconButton>
                  </Box>
                  {compra.telefono && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>
                        <strong>Teléfono:</strong> {compra.telefono}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => window.location.href = `https://wa.me/${compra.telefono.replace(/\D/g, '')}`}
                        title="Contactar por WhatsApp"
                      >
                        <Phone fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Información de Entrega */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información de Entrega
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>
                    <strong>Tipo:</strong> {compra.tipo_entrega === 'envio' ? 'Envío a domicilio' : 'Retiro en local'}
                  </Typography>
                  <Typography>
                    <strong>Dirección:</strong> {compra.calle} {compra.numero}
                  </Typography>
                  {compra.piso && (
                    <Typography>
                      <strong>Piso/Depto:</strong> {compra.piso} {compra.departamento}
                    </Typography>
                  )}
                  <Typography>
                    <strong>Ciudad:</strong> {compra.ciudad}, {compra.provincia}
                  </Typography>
                  <Typography>
                    <strong>Código Postal:</strong> {compra.codigoPostal}
                  </Typography>
                  {compra.costo_envio > 0 && (
                    <Typography>
                      <strong>Costo de envío:</strong> ${compra.costo_envio.toLocaleString('es-AR')}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Gestión de Estados */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gestión de Estados
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Estado de Pago</InputLabel>
                      <Select
                        value={estadoPago}
                        label="Estado de Pago"
                        onChange={(e) => setEstadoPago(e.target.value)}
                      >
                        {estadosPago.map((estado) => (
                          <MenuItem key={estado.id} value={estado.id}>
                            {estado.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={estadosPago.find(e => e.id === estadoPago)?.nombre || '-'}
                        color={getEstadoPagoColor(estadoPago)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Estado del Pedido</InputLabel>
                      <Select
                        value={estadoPedido}
                        label="Estado del Pedido"
                        onChange={(e) => setEstadoPedido(e.target.value)}
                      >
                        {estadosPedido.map((estado) => (
                          <MenuItem key={estado.id} value={estado.id}>
                            {estado.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={estadosPedido.find(e => e.id === estadoPedido)?.nombre || '-'}
                        color={getEstadoPedidoColor(estadoPedido)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Número de Tracking"
                      value={tracking}
                      onChange={(e) => setTracking(e.target.value)}
                      placeholder="Ej: AR123456789"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleGuardar}
                    disabled={!hayCambios || guardando}
                  >
                    {guardando ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Productos Comprados */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Productos Comprados
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Producto</strong></TableCell>
                        <TableCell><strong>SKU</strong></TableCell>
                        <TableCell align="right"><strong>Cantidad</strong></TableCell>
                        <TableCell align="right"><strong>Precio Unitario</strong></TableCell>
                        <TableCell align="right"><strong>Subtotal</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {compra.detalles?.map((detalle) => (
                        <TableRow key={detalle.id}>
                          <TableCell>{detalle.nombreProducto}</TableCell>
                          <TableCell>{detalle.sku || '-'}</TableCell>
                          <TableCell align="right">{detalle.cantidad}</TableCell>
                          <TableCell align="right">
                            ${detalle.precioUnitario.toLocaleString('es-AR')}
                          </TableCell>
                          <TableCell align="right">
                            ${(detalle.cantidad * detalle.precioUnitario).toLocaleString('es-AR')}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <strong>Total:</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>${compra.total.toLocaleString('es-AR')}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Información Adicional */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información Adicional
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>
                      <strong>Método de Pago:</strong>
                    </Typography>
                    {compra.metodoPago ? (
                      <Chip
                        label={compra.metodoPago.nombre}
                        color={
                          compra.metodoPago.nombre === 'MercadoPago' ? 'success' :
                          compra.metodoPago.nombre === 'Transferencia' ? 'info' :
                          compra.metodoPago.nombre === 'Efectivo' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    ) : (
                      <Typography>-</Typography>
                    )}
                  </Box>
                  {compra.metodoPago?.nombre === 'Transferencia' && compra.estadoPago?.nombre === 'Pendiente' && (
                    <Typography variant="body2" color="info.main" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                      ⚠️ Esperando confirmación de transferencia
                    </Typography>
                  )}
                  {compra.metodoPago?.nombre === 'Efectivo' && compra.estadoPago?.nombre === 'Pendiente' && (
                    <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                      ⚠️ Contactar al cliente para coordinar el pago
                    </Typography>
                  )}
                  <Typography>
                    <strong>Fecha de Compra:</strong> {dayjs(compra.created_at).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                  {compra.observaciones && (
                    <Typography>
                      <strong>Observaciones:</strong> {compra.observaciones}
                    </Typography>
                  )}
                  {compra.tracking && (
                    <Typography>
                      <strong>Tracking:</strong> {compra.tracking}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

