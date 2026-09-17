import React, { useState, useMemo, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import SubcategoriaTable from "../../../Components/SubcategoriaTable";
import SearchBar from "../../../Components/SearchBar";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Typography,
    Snackbar,
    Alert,
    Tooltip,
    Paper,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const Index = ({ subcategorias = [], categorias = [] }) => {
    const { flash = {}, errors: pageErrors = {} } = usePage().props;

    const [search, setSearch] = useState("");
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedSubcat, setSelectedSubcat] = useState(null);

    // Form state for create / edit
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        idCategoria: "",
        url: "",
        orden: 0,
        activo: true,
        imagen: null,
        imagenPreview: null,
        eliminar_imagen: false,
    });
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

    // Filtrado por nombre de subcategoría o categoría
    const filtered = useMemo(() => {
        const s = search.toLowerCase();
        return subcategorias.filter(
            (sc) =>
                sc.nombre.toLowerCase().includes(s) ||
                (sc.categoria_nombre &&
                    sc.categoria_nombre.toLowerCase().includes(s))
        );
    }, [search, subcategorias]);

    const handleOpenCreate = () => {
        setFormData({
            nombre: "",
            descripcion: "",
            idCategoria: categorias.length > 0 ? categorias[0].id : "",
            url: "",
            orden: 0,
            activo: true,
            imagen: null,
            imagenPreview: null,
            eliminar_imagen: false,
        });
        setFormErrors({});
        setOpenCreate(true);
    };

    const handleOpenEdit = (subcat) => {
        setSelectedSubcat(subcat);
        setFormData({
            nombre: subcat.nombre || "",
            descripcion: subcat.descripcion || "",
            idCategoria: subcat.idCategoria || (categorias[0]?.id ?? ""),
            url: subcat.url || "",
            orden: subcat.orden ?? 0,
            activo: Boolean(subcat.activo),
            imagen: null,
            imagenPreview: subcat.imagen_url || null,
            eliminar_imagen: false,
        });
        setFormErrors({});
        setOpenEdit(true);
    };

    const handleOpenDelete = (subcat) => {
        setSelectedSubcat(subcat);
        setOpenDelete(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                imagen: file,
                imagenPreview: URL.createObjectURL(file),
                eliminar_imagen: false,
            }));
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            imagen: null,
            imagenPreview: null,
            eliminar_imagen: true,
        }));
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append("nombre", formData.nombre);
        data.append("descripcion", formData.descripcion || "");
        data.append("idCategoria", formData.idCategoria);
        data.append("url", formData.url || "");
        data.append("orden", formData.orden || 0);
        data.append("activo", formData.activo ? "1" : "0");

        if (formData.imagen) {
            data.append("imagen", formData.imagen);
        }

        router.post(route("dashboard.subcategorias.store"), data, {
            forceFormData: true,
            onSuccess: () => {
                setOpenCreate(false);
                setSubmitting(false);
                setSnackbar({
                    open: true,
                    message: "Subcategoría creada correctamente",
                    severity: "success",
                });
            },
            onError: (errs) => {
                setSubmitting(false);
                setFormErrors(errs);
                setSnackbar({
                    open: true,
                    message: errs.error || "Error al crear la subcategoría",
                    severity: "error",
                });
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!selectedSubcat) return;
        setSubmitting(true);

        const data = new FormData();
        data.append("_method", "POST");
        data.append("nombre", formData.nombre);
        data.append("descripcion", formData.descripcion || "");
        data.append("idCategoria", formData.idCategoria);
        data.append("url", formData.url || "");
        data.append("orden", formData.orden || 0);
        data.append("activo", formData.activo ? "1" : "0");

        if (formData.eliminar_imagen) {
            data.append("eliminar_imagen", "1");
        }
        if (formData.imagen) {
            data.append("imagen", formData.imagen);
        }

        router.post(route("dashboard.subcategorias.update", selectedSubcat.id), data, {
            forceFormData: true,
            onSuccess: () => {
                setOpenEdit(false);
                setSubmitting(false);
                setSelectedSubcat(null);
                setSnackbar({
                    open: true,
                    message: "Subcategoría actualizada correctamente",
                    severity: "success",
                });
            },
            onError: (errs) => {
                setSubmitting(false);
                setFormErrors(errs);
                setSnackbar({
                    open: true,
                    message: errs.error || "Error al actualizar la subcategoría",
                    severity: "error",
                });
            },
        });
    };

    const handleConfirmDelete = () => {
        if (!selectedSubcat) return;

        router.delete(route("dashboard.subcategorias.destroy", selectedSubcat.id), {
            onSuccess: () => {
                setOpenDelete(false);
                setSelectedSubcat(null);
                setSnackbar({
                    open: true,
                    message: "Subcategoría eliminada correctamente",
                    severity: "success",
                });
            },
            onError: (errs) => {
                setOpenDelete(false);
                setSnackbar({
                    open: true,
                    message: errs.error || "No se pudo eliminar la subcategoría",
                    severity: "error",
                });
            },
        });
    };

    const handleToggleActive = (subcat) => {
        router.put(
            route("dashboard.subcategorias.toggle-active", subcat.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: `Estado de '${subcat.nombre}' actualizado`,
                        severity: "success",
                    });
                },
                onError: (errs) => {
                    setSnackbar({
                        open: true,
                        message: errs.error || "Error al cambiar estado",
                        severity: "error",
                    });
                },
            }
        );
    };

    return (
        <>
            <Head title="Subcategorías - Dashboard" />

            <Box sx={{ width: "92%", maxWidth: 1300, mx: "auto", mt: 3, mb: 6 }}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
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
                        <Box>
                            <Typography variant="h5" component="h1" fontWeight="bold">
                                Gestión de Subcategorías
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Administra las subcategorías de productos y talleres de la plataforma
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <SearchBar
                                placeholder="Buscar por nombre o tipo..."
                                debounceMs={0}
                                onSearch={(term) => setSearch(term)}
                            />

                            <Tooltip title="Agregar una nueva subcategoría">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenCreate}
                                    sx={{ minWidth: 140, height: 42 }}
                                >
                                    Agregar
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>

                    <SubcategoriaTable
                        subcategorias={filtered}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDelete}
                        onToggleActive={handleToggleActive}
                    />
                </Paper>
            </Box>

            {/* Modal Crear Subcategoría */}
            <Dialog
                open={openCreate}
                onClose={() => !submitting && setOpenCreate(false)}
                maxWidth="sm"
                fullWidth
            >
                <form onSubmit={handleCreateSubmit}>
                    <DialogTitle fontWeight="bold">Crear Nueva Subcategoría</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            value={formData.nombre}
                            onChange={(e) =>
                                setFormData({ ...formData, nombre: e.target.value })
                            }
                            error={!!formErrors.nombre}
                            helperText={formErrors.nombre}
                            required
                        />

                        <FormControl fullWidth required error={!!formErrors.idCategoria}>
                            <InputLabel id="categoria-select-label">Categoría Padre</InputLabel>
                            <Select
                                labelId="categoria-select-label"
                                value={formData.idCategoria}
                                label="Categoría Padre"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        idCategoria: e.target.value,
                                    })
                                }
                            >
                                {categorias.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Descripción (opcional)"
                            value={formData.descripcion}
                            onChange={(e) =>
                                setFormData({ ...formData, descripcion: e.target.value })
                            }
                            multiline
                            rows={3}
                        />

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Slug / URL (opcional)"
                                value={formData.url}
                                onChange={(e) =>
                                    setFormData({ ...formData, url: e.target.value })
                                }
                                placeholder="ej: tazas-ceramica"
                            />

                            <TextField
                                fullWidth
                                label="Orden de visualización"
                                type="number"
                                value={formData.orden}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        orden: parseInt(e.target.value) || 0,
                                    })
                                }
                            />
                        </Box>

                        {/* Subir imagen */}
                        <Box sx={{ border: "1px dashed #bdbdbd", p: 2, borderRadius: 1.5, textAlign: "center" }}>
                            {formData.imagenPreview ? (
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                                    <img
                                        src={formData.imagenPreview}
                                        alt="Preview"
                                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                                    />
                                    <Tooltip title="Eliminar imagen seleccionada">
                                        <IconButton color="error" onClick={handleRemoveImage}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ) : (
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                    size="small"
                                >
                                    Subir Imagen de Portada
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            )}
                        </Box>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.activo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            activo: e.target.checked,
                                        })
                                    }
                                    color="success"
                                />
                            }
                            label="Subcategoría activa"
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
                            disabled={submitting}
                        >
                            {submitting ? "Guardando..." : "Crear Subcategoría"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Modal Editar Subcategoría */}
            <Dialog
                open={openEdit}
                onClose={() => !submitting && setOpenEdit(false)}
                maxWidth="sm"
                fullWidth
            >
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle fontWeight="bold">Editar Subcategoría</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            value={formData.nombre}
                            onChange={(e) =>
                                setFormData({ ...formData, nombre: e.target.value })
                            }
                            error={!!formErrors.nombre}
                            helperText={formErrors.nombre}
                            required
                        />

                        <FormControl fullWidth required error={!!formErrors.idCategoria}>
                            <InputLabel id="edit-categoria-select-label">Categoría Padre</InputLabel>
                            <Select
                                labelId="edit-categoria-select-label"
                                value={formData.idCategoria}
                                label="Categoría Padre"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        idCategoria: e.target.value,
                                    })
                                }
                            >
                                {categorias.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Descripción (opcional)"
                            value={formData.descripcion}
                            onChange={(e) =>
                                setFormData({ ...formData, descripcion: e.target.value })
                            }
                            multiline
                            rows={3}
                        />

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Slug / URL (opcional)"
                                value={formData.url}
                                onChange={(e) =>
                                    setFormData({ ...formData, url: e.target.value })
                                }
                            />

                            <TextField
                                fullWidth
                                label="Orden de visualización"
                                type="number"
                                value={formData.orden}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        orden: parseInt(e.target.value) || 0,
                                    })
                                }
                            />
                        </Box>

                        {/* Subir / Reemplazar imagen */}
                        <Box sx={{ border: "1px dashed #bdbdbd", p: 2, borderRadius: 1.5, textAlign: "center" }}>
                            {formData.imagenPreview ? (
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                                    <img
                                        src={formData.imagenPreview}
                                        alt="Preview"
                                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                                    />
                                    <Tooltip title="Quitar imagen actual">
                                        <IconButton color="error" onClick={handleRemoveImage}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ) : (
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                    size="small"
                                >
                                    Subir Nueva Imagen
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            )}
                        </Box>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.activo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            activo: e.target.checked,
                                        })
                                    }
                                    color="success"
                                />
                            }
                            label="Subcategoría activa"
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
                            disabled={submitting}
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
                        ¿Estás seguro de que deseas eliminar la subcategoría{" "}
                        <strong>"{selectedSubcat?.nombre}"</strong>?
                    </DialogContentText>
                    {((selectedSubcat?.productos_count ?? 0) > 0 || (selectedSubcat?.talleres_count ?? 0) > 0) ? (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            Esta subcategoría tiene{" "}
                            {selectedSubcat?.productos_count || 0} producto(s) y{" "}
                            {selectedSubcat?.talleres_count || 0} taller(es) vinculados. El sistema bloqueará la eliminación para evitar inconsistencias. Se recomienda desactivarla.
                        </Alert>
                    ) : (
                        <DialogContentText color="error" sx={{ mt: 1.5, fontSize: "0.875rem" }}>
                            Esta acción no se puede deshacer y eliminará también sus imágenes asociadas.
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
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

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
};

export default Index;
