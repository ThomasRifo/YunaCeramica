// resources/js/Components/UserMenu.jsx

import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { Avatar, Menu, MenuItem, IconButton, Tooltip, Divider } from "@mui/material";
import NavLink from "./NavLink";

export default function UserMenu() {
  const { auth } = usePage().props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Si no hay usuario autenticado, no mostramos el menú
  if (!auth?.user) {
    return null;
  }

  return (
    <>
    <div className="p-4 mr-2">
      <Tooltip title="Cuenta">
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <Avatar alt={auth.user.name || 'Usuario'} src="/default-avatar.png" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "10px" }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled>
          {auth.user.name || 'Usuario'}
        </MenuItem>

        <Divider />

        <Link className="block" component={Link} href="/profile">
          Perfil
        </Link>

        <Link component={Link} href={route('logout')} method="post" as="button">
          Cerrar sesión
        </Link>
      </Menu>
      </div>
    </>
  );
}
