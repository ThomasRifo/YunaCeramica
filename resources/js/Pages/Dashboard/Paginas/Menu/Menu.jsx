import React, { useState, useMemo, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Box,
    Button,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Chip,
    Tooltip,
    Snackbar,
    Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SearchBar from "@/Components/SearchBar";

export default function Menu({ menus = [] }) {
    const { flash = {}, errors: pageErrors = {} } = usePage().props;

    const [search, setSearch] = useState("");
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    const [nombre, setNombre] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (flash?.success) {
            setSnackbar({
                open: true,
                message: flash.success,
                severity: "success",
            });
        } else if (flash?.error || pageErrors?.error) {
            setSnackbar({
                open: true,
                message: flash.error || pageErrors.error,
                severity: "error",
            });
        }
    }, [flash, pageErrors]);

    // Filtrar menús por nombre
    const filteredMenus = useMemo(() => {
        const s = search.toLowerCase();
        return menus.filter((m) => m.nombre.toLowerCase().includes(s));
    }, [search, menus]);

    const handleOpenCreate = () => {
        setNombre("");
        setFormErrors({});
        setOpenCreate(true);
    };

    const handleOpenEdit = (menu) => {
        setSelectedMenu(menu);
        setNombre(menu.nombre || "");
        setFormErrors({});
        setOpenEdit(true);
    };

    const handleOpenDelete = (menu) => {
        setSelectedMenu(menu);
        setOpenDelete(true);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        router.post(
            route("dashboard.paginas.menu.store"),
            { nombre },
            {
                onSuccess: () => {
                    setOpenCreate(false);
                    setSubmitting(false);
                    setSnackbar({
                        open: true,
                        message: "Menú creado correctamente",
                        severity: "success",
                    });
                },
                onError: (errs) => {
                    setSubmitting(false);
                    setFormErrors(errs);
                    setSnackbar({
                        open: true,
                        message: errs.nombre || errs.error || "Error al crear el menú",
                        severity: "error",
                    });
                },
            }
        );
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!selectedMenu) return;
        setSubmitting(true);

        router.put(
            route("dashboard.paginas.menu.update", selectedMenu.id),
            { nombre },
            {
                onSuccess: () => {
                    setOpenEdit(false);
                    setSubmitting(false);
                    setSelectedMenu(null);
                    setSnackbar({
                        open: true,
                        message: "Menú actualizado correctamente",
                        severity: "success",
                    });
                },
                onError: (errs) => {
                    setSubmitting(false);
                    setFormErrors(errs);
                    setSnackbar({
                        open: true,
                        message: errs.nombre || errs.error || "Error al actualizar el menú",
                        severity: "error",
                    });
                },
            }
        );
    };

    const handleConfirmDelete = () => {
        if (!selectedMenu) return;

        router.delete(
            route("dashboard.paginas.menu.destroy", selectedMenu.id),
            {
                onSuccess: () => {
                    setOpenDelete(false);
                    setSelectedMenu(null);
                    setSnackbar({
                        open: true,
                        message: "Menú eliminado correctamente",
                        severity: "success",
                    });
                },
                onError: (errs) => {
                    setOpenDelete(false);
                    setSnackbar({
                        open: true,
                        message: errs.error || "No se pudo eliminar el menú",
                        severity: "error",
                    });
                },
            }
        );
    };

    return (
        <>
            <Head title="Menús de Talleres - Dashboard" />

            <Box sx={{ width: "92%", maxWidth: 1100, mx: "auto", mt: 3, mb: 6 }}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    {/* Encabezado */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <RestaurantMenuIcon color="primary" sx={{ fontSize: 32 }} />
                            <Box>
                                <Typography variant="h5" component="h1" fontWeight="bold">
                                    Menús de Talleres
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Catálogo de opciones gastronómicas (ej: Tradicional, Salado, Dulce, Sin TACC) para vincular a los talleres
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <SearchBar
                                placeholder="Buscar menú..."
                                debounceMs={0}
                                onSearch={(term) => setSearch(term)}
                            />

                            <Tooltip title="Crear una nueva opción de menú">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenCreate}
                                    sx={{ minWidth: 140, height: 42 }}
                                >
                                    Nuevo Menú
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Tabla de Menús */}
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: "#fafafa" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", width: 80 }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Nombre del Menú</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", width: 220 }} align="center">
                                        Talleres que lo usan
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", width: 140 }} align="center">
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMenus.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No se encontraron menús registrados.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredMenus.map((menu) => (
                                        <TableRow key={menu.id} hover>
                                            <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                                                {menu.id}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                                                {menu.nombre}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={`${menu.talleres_count || 0} taller(es)`}
                                                    size="small"
                                                    color={menu.talleres_count > 0 ? "primary" : "default"}
                                                    variant={menu.talleres_count > 0 ? "filled" : "outlined"}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                                                    <Tooltip title="Editar nombre del menú">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleOpenEdit(menu)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Eliminar opción de menú">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleOpenDelete(menu)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            {/* Modal Crear Menú */}
            <Dialog
                open={openCreate}
                onClose={() => !submitting && setOpenCreate(false)}
                maxWidth="xs"
                fullWidth
            >
                <form onSubmit={handleCreateSubmit}>
                    <DialogTitle fontWeight="bold">Nuevo Menú</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Crea la opción de menú (el contenido gastronómico específico se redacta en la edición de cada taller).
                        </Typography>
                        <TextField
                            fullWidth
                            label="Nombre del Menú"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            error={!!formErrors.nombre}
                            helperText={formErrors.nombre || "ej: Tradicional, Salado, Dulce, Sin TACC, Vegetariano"}
                            autoFocus
                            required
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5 }}>
                        <Button
                            onClick={() => setOpenCreate(false)}
                            disabled={submitting}
                            color="inherit"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={submitting || !nombre.trim()}
                        >
                            {submitting ? "Creando..." : "Crear Menú"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Modal Editar Menú */}
            <Dialog
                open={openEdit}
                onClose={() => !submitting && setOpenEdit(false)}
                maxWidth="xs"
                fullWidth
            >
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle fontWeight="bold">Editar Menú</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                        <TextField
                            fullWidth
                            label="Nombre del Menú"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            error={!!formErrors.nombre}
                            helperText={formErrors.nombre}
                            autoFocus
                            required
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5 }}>
                        <Button
                            onClick={() => setOpenEdit(false)}
                            disabled={submitting}
                            color="inherit"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={submitting || !nombre.trim()}
                        >
                            {submitting ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Modal Confirmar Eliminación */}
            <Dialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
            >
                <DialogTitle fontWeight="bold">Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar la opción de menú{" "}
                        <strong>"{selectedMenu?.nombre}"</strong>?
                    </DialogContentText>
                    {(selectedMenu?.talleres_count ?? 0) > 0 ? (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Este menú está asignado actualmente a{" "}
                            <strong>{selectedMenu?.talleres_count} taller(es)</strong>. Para eliminarlo, primero debes desvincularlo de esos talleres.
                        </Alert>
                    ) : (
                        <DialogContentText color="error" sx={{ mt: 1.5, fontSize: "0.875rem" }}>
                            Esta acción no se puede deshacer.
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenDelete(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={(selectedMenu?.talleres_count ?? 0) > 0}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Feedback Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ width: "100%" }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
