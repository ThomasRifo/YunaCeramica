import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SubcategoriaImage from './SubcategoriaImage';

const SubcategoriaTableRow = ({ subcategoria, onEdit, onDelete, onToggleActive }) => (
  <TableRow>
    <TableCell sx={{ px: 3 }}>
      <SubcategoriaImage url={subcategoria.imagen_url} alt={subcategoria.nombre} />
    </TableCell>
    <TableCell sx={{ px: 3 }}>{subcategoria.nombre}</TableCell>
    <TableCell sx={{ px: 3 }}>{subcategoria.categoria_nombre}</TableCell>
    <TableCell sx={{ px: 3 }}>{subcategoria.activo ? 'Activo' : 'Inactivo'}</TableCell>
    <TableCell sx={{ px: 3 }}>
    <span title="Editar">
      <IconButton onClick={() => onEdit(subcategoria)} size="small" color="primary" >
        <EditIcon  />
      </IconButton>
      </span>
      <span title="Eliminar">
      <IconButton onClick={() => onDelete(subcategoria)} size="small" color="error" alt="Eliminar">
        <DeleteIcon />
      </IconButton>
      </span>
      <span title={subcategoria.activo ? 'Desactivar' : 'Activar'}>
      <IconButton onClick={() => onToggleActive(subcategoria)} size="small" color={subcategoria.activo ? 'default' : 'success'}>
        {subcategoria.activo ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
      </span>
    </TableCell>
  </TableRow>
);

export default SubcategoriaTableRow; 