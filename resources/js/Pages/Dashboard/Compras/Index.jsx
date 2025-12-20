import { Head, router } from "@inertiajs/react";
import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { Visibility, Email, Phone } from "@mui/icons-material";
import dayjs from "dayjs";

export default function ComprasIndex({ comprasPendientes, enviosPendientes, todasLasCompras }) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleVerDetalle = (compraId) => {
    router.visit(`/dashboard/compras/${compraId}`);
  };

  const getEstadoPagoColor = (estadoPago) => {
    const nombre = estadoPago?.nombre?.toLowerCase() || '';
    if (nombre === 'pagado') return 'success';
    if (nombre === 'pendiente') return 'warning';
    if (nombre === 'rechazado' || nombre === 'cancelado') return 'error';
    return 'default';
  };

  const getEstadoPedidoColor = (estado) => {
    const nombre = estado?.nombre?.toLowerCase() || '';
    if (nombre === 'entregado') return 'success';
    if (nombre === 'enviado') return 'info';
    if (nombre === 'pendiente') return 'warning';
    if (nombre === 'cancelado') return 'error';
    return 'default';
  };

  const renderTablaCompras = (compras) => {
    if (!compras || compras.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No hay compras en esta sección
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Total</strong></TableCell>
              <TableCell><strong>Método Pago</strong></TableCell>
              <TableCell><strong>Estado Pago</strong></TableCell>
              <TableCell><strong>Estado Pedido</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compras.map((compra) => (
              <TableRow key={compra.id} hover>
                <TableCell>#{compra.id}</TableCell>
                <TableCell>
                  {compra.nombre} {compra.apellido}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {compra.email}
                    <IconButton
                      size="small"
                      onClick={() => window.location.href = `mailto:${compra.email}`}
                      title="Enviar email"
                    >
                      <Email fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  {compra.telefono ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {compra.telefono}
                      <IconButton
                        size="small"
                        onClick={() => window.location.href = `https://wa.me/${compra.telefono.replace(/\D/g, '')}`}
                        title="Contactar por WhatsApp"
                      >
                        <Phone fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>${compra.total.toLocaleString('es-AR')}</TableCell>
                <TableCell>
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
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={compra.estadoPago?.nombre || '-'}
                    color={getEstadoPagoColor(compra.estadoPago)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={compra.estado?.nombre || '-'}
                    color={getEstadoPedidoColor(compra.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {dayjs(compra.created_at).format('DD/MM/YYYY HH:mm')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleVerDetalle(compra.id)}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Head title="Compras - Dashboard" />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Gestión de Compras
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label={`Compras Pendientes (${comprasPendientes?.length || 0})`}
              sx={{ fontWeight: tabValue === 0 ? 'bold' : 'normal' }}
            />
            <Tab 
              label={`Envíos Pendientes (${enviosPendientes?.length || 0})`}
              sx={{ fontWeight: tabValue === 1 ? 'bold' : 'normal' }}
            />
            <Tab 
              label={`Todas las Compras (${todasLasCompras?.total || 0})`}
              sx={{ fontWeight: tabValue === 2 ? 'bold' : 'normal' }}
            />
          </Tabs>
        </Box>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Compras Pendientes de Pago
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Compras que aún no han sido pagadas. Puedes contactar al cliente o cambiar el estado del pago.
              </Typography>
              {renderTablaCompras(comprasPendientes)}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Envíos Pendientes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Compras pagadas que aún no han sido enviadas. Puedes actualizar el estado del envío y agregar tracking.
              </Typography>
              {renderTablaCompras(enviosPendientes)}
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Todas las Compras
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Historial completo de todas las compras realizadas.
              </Typography>
              {renderTablaCompras(todasLasCompras?.data || [])}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

