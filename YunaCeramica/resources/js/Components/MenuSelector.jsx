import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function MenuSelector({ menus, selectedMenus, onChange, fixedMenus = [] }) {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      id="menu-selector"
      options={menus}
      value={[...fixedMenus, ...selectedMenus.filter((m) => !fixedMenus.some(f => f.id === m.id))]}
      getOptionLabel={(option) => option.nombre}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      onChange={(event, newValue) => {
        // evita duplicar los fixed
        const filtered = newValue.filter(opt => !fixedMenus.some(f => f.id === opt.id));
        onChange(filtered);
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const isFixed = fixedMenus.some(f => f.id === option.id);
          const { key, ...props } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={option.nombre}
              {...props}
              disabled={isFixed}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Menús disponibles"
          placeholder="Elegí uno o más"
          fullWidth
        />
      )}
    />
  );
}

MenuSelector.propTypes = {
  menus: PropTypes.array.isRequired,
  selectedMenus: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  fixedMenus: PropTypes.array, // opcional, por si en el futuro querés tener algunos fijos
};
