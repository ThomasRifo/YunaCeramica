import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import SubcategoriaImage from './SubcategoriaImage';

const SubcategoriaTableRow = ({ subcategoria, onEdit, onDelete, onToggleActive }) => (
  <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
    <TableCell sx={{ px: 2, py: 1.5 }}>
      <SubcategoriaImage url={subcategoria.imagen_url} alt={subcategoria.nombre} />
    </TableCell>
    <TableCell sx={{ px: 2, py: 1.5, fontWeight: 500 }}>
      {subcategoria.nombre}
    </TableCell>
    <TableCell sx={{ px: 2, py: 1.5 }}>
      <Chip
        label={subcategoria.categoria_nombre}
        size="small"
        variant="outlined"
        color="primary"
      />
    </TableCell>
    <TableCell sx={{ px: 2, py: 1.5 }}>
      <Chip
        label={subcategoria.activo ? 'Activo' : 'Inactivo'}
        size="small"
        color={subcategoria.activo ? 'success' : 'default'}
      />
    </TableCell>
    <TableCell sx={{ px: 2, py: 1.5 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <Tooltip title="Editar Subcategoría">
          <IconButton onClick={() => onEdit(subcategoria)} size="small" color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={subcategoria.activo ? 'Desactivar Subcategoría' : 'Activar Subcategoría'}>
          <IconButton
            onClick={() => onToggleActive(subcategoria)}
            size="small"
            color={subcategoria.activo ? 'warning' : 'success'}
          >
            {subcategoria.activo ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Eliminar Subcategoría">
          <IconButton onClick={() => onDelete(subcategoria)} size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </TableCell>
  </TableRow>
);

export default SubcategoriaTableRow;