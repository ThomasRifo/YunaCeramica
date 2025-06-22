import React from 'react';
import TableContainerGeneric from './TableContainer';
import SubcategoriaTableRow from './SubcategoriaTableRow';

const columns = [
  { label: ' ', key: 'imagen' },
  { label: 'Nombre', key: 'nombre' },
  { label: 'Tipo', key: 'tipo' },
  { label: 'Estado', key: 'estado' },
  { label: 'Acciones', key: 'acciones' },
];

const SubcategoriaTable = ({ subcategorias, onEdit, onDelete, onToggleActive }) => (
  <TableContainerGeneric
    columns={columns}
    data={subcategorias}
    renderRow={(subcat, idx) => (
      <SubcategoriaTableRow
        key={subcat.id}
        subcategoria={subcat}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleActive={onToggleActive}
      />
    )}
  />
);

export default SubcategoriaTable; 