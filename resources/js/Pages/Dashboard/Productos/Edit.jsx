import { useState } from "react";
import { useForm, router, Head } from "@inertiajs/react";
import {
    Box,
    TextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Snackbar,
    Alert,
    FormControlLabel,
    Checkbox,
    FormHelperText,
    Tooltip,
    Paper,
    Chip,
    Divider,
} from "@mui/material";
import MenuSelector from "@/Components/MenuSelector";
import {
    Delete,
    CloudUpload,
    DragIndicator,
    RestoreFromTrash,
    ArrowBack,
    Save,
} from "@mui/icons-material";

export default function Edit({
    producto,
    subcategorias = [],
    tipoAtributos = [],
    atributosDisponibles = [],
}) {
    // Detectar el tipo de atributo inicial si el producto tiene atributos
    const initialTipoAtributoId =
        producto.atributos && producto.atributos.length > 0
            ? producto.atributos[0].tipo_atributo_id || producto.atributos[0].tipoAtributo?.id || ""
            : "";

    const initialAtributosIds =
        producto.atributos && producto.atributos.length > 0
            ? producto.atributos.map((a) => a.id)
            : [];

    const { data, setData, processing, errors } = useForm({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        idSubcategoria: producto.idSubcategoria || "",
        precio: producto.precio ?? "",
        stock: producto.stock ?? "",
        tiene_atributos: Boolean(producto.tiene_atributos),
        idTipoAtributo: initialTipoAtributoId,
        atributos: initialAtributosIds,
        es_mayorista: Boolean(producto.es_mayorista),
        cant_minima_mayorista: producto.cant_minima_mayorista ?? "",
        descuento_mayorista: producto.descuento_mayorista ?? "",
        sku: producto.sku || "",
        peso: producto.peso ?? "",
        dimensiones: producto.dimensiones || "",
        tags: producto.tags || "",
        descuento: producto.descuento ?? "",
        activo: producto.activo !== undefined ? Boolean(producto.activo) : true,
    });

    const [imagenesExistentes, setImagenesExistentes] = useState(
        producto.imagenes || []
    );
    const [imagenesEliminar, setImagenesEliminar] = useState([]);
    const [nuevasImagenes, setNuevasImagenes] = useState([]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Subcategorías de productos (categoría ID 1)
    const subcategoriasProductos = subcategorias.filter(
        (sub) => sub.idCategoria === 1
    );

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const filesWithPreview = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setNuevasImagenes((prev) => [...prev, ...filesWithPreview]);
    };

    const handleRemoveNuevaImagen = (index) => {
        setNuevasImagenes((prev) => {
            const item = prev[index];
            if (item?.preview) {
                URL.revokeObjectURL(item.preview);
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleMarcarEliminarExistente = (id) => {
        setImagenesEliminar((prev) => [...prev, id]);
    };

    const handleRestaurarExistente = (id) => {
        setImagenesEliminar((prev) => prev.filter((imgId) => imgId !== id));
    };

    const imagenesActivasCount =
        imagenesExistentes.filter((img) => !imagenesEliminar.includes(img.id))
            .length + nuevasImagenes.length;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (imagenesActivasCount === 0) {
            setSnackbar({
                open: true,
                message: "El producto debe conservar al menos una imagen",
                severity: "error",
            });
            return;
        }

        const formData = new FormData();
        formData.append("_method", "PUT");

        // Datos del producto
        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
                if (typeof data[key] === "boolean") {
                    formData.append(key, data[key] ? "1" : "0");
                } else if (key === "atributos" && Array.isArray(data[key])) {
                    data[key].forEach((attrId, index) => {
                        formData.append(`atributos[${index}]`, attrId);
                    });
                } else if (key !== "idTipoAtributo") {
                    formData.append(key, data[key]);
                }
            }
        });

        // Imágenes a eliminar
        imagenesEliminar.forEach((id, index) => {
            formData.append(`imagenes_eliminar[${index}]`, id);
        });

        // Imágenes nuevas
        nuevasImagenes.forEach((imgObj, index) => {
            formData.append(`imagenes_nuevas[${index}]`, imgObj.file);
        });

        router.post(route("dashboard.productos.update", producto.id), formData, {
            forceFormData: true,
            onSuccess: () => {
                setSnackbar({
                    open: true,
                    message: "Producto actualizado exitosamente",
                    severity: "success",
                });
            },
            onError: (errs) => {
                const errorMsg =
                    errs.error ||
                    Object.values(errs)[0] ||
                    "Error al actualizar el producto. Verifica los campos.";
                setSnackbar({
                    open: true,
                    message: errorMsg,
                    severity: "error",
                });
            },
        });
    };

    return (
        <>
            <Head title={`Editar ${producto.nombre} - Dashboard`} />
            <Box sx={{ maxWidth: 1200, mx: "auto", mt: 3, mb: 6, px: 2 }}>
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                    {/* Encabezado */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Tooltip title="Volver al listado de productos">
                                <IconButton
                                    onClick={() =>
                                        router.visit(route("dashboard.productos.index"))
                                    }
                                    color="primary"
                                    size="medium"
                                >
                                    <ArrowBack />
                                </IconButton>
                            </Tooltip>
                            <Box>
                                <Typography variant="h5" component="h1" fontWeight="bold">
                                    Editar Producto
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Modifica los detalles, atributos e imágenes de este producto
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            label={data.activo ? "Activo" : "Inactivo"}
                            color={data.activo ? "success" : "default"}
                            variant="outlined"
                        />
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
                                gap: 4,
                                mb: 4,
                            }}
                        >
                            {/* Columna Izquierda - Información y Atributos */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre del Producto"
                                    value={data.nombre}
                                    onChange={(e) => setData("nombre", e.target.value)}
                                    error={!!errors.nombre}
                                    helperText={errors.nombre}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    value={data.descripcion}
                                    onChange={(e) =>
                                        setData("descripcion", e.target.value)
                                    }
                                    error={!!errors.descripcion}
                                    helperText={errors.descripcion}
                                    multiline
                                    rows={4}
                                    required
                                />

                                <FormControl fullWidth error={!!errors.idSubcategoria} required>
                                    <InputLabel id="select-subcategoria-label">
                                        Subcategoría
                                    </InputLabel>
                                    <Select
                                        labelId="select-subcategoria-label"
                                        value={data.idSubcategoria}
                                        onChange={(e) =>
                                            setData("idSubcategoria", e.target.value)
                                        }
                                        label="Subcategoría"
                                    >
                                        {subcategoriasProductos.map((sub) => (
                                            <MenuItem key={sub.id} value={sub.id}>
                                                {sub.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.idSubcategoria && (
                                        <FormHelperText>
                                            {errors.idSubcategoria}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                {/* Contiene atributos Checkbox */}
                                <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1.5, p: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={data.tiene_atributos}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setData((prev) => ({
                                                        ...prev,
                                                        tiene_atributos: checked,
                                                        idTipoAtributo: checked
                                                            ? prev.idTipoAtributo
                                                            : "",
                                                        atributos: checked
                                                            ? prev.atributos
                                                            : [],
                                                    }));
                                                }}
                                                color="primary"
                                            />
                                        }
                                        label="Este producto contiene atributos (variantes)"
                                    />

                                    {data.tiene_atributos && (
                                        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                                            <FormControl fullWidth error={!!errors.idTipoAtributo}>
                                                <InputLabel id="edit-tipo-atributo-label">
                                                    Tipo de Atributo
                                                </InputLabel>
                                                <Select
                                                    labelId="edit-tipo-atributo-label"
                                                    value={data.idTipoAtributo || ""}
                                                    onChange={(e) => {
                                                        const idTipo = e.target.value;
                                                        setData((prev) => ({
                                                            ...prev,
                                                            idTipoAtributo: idTipo,
                                                            atributos: [],
                                                        }));
                                                    }}
                                                    label="Tipo de Atributo"
                                                >
                                                    {tipoAtributos?.map((tipo) => (
                                                        <MenuItem key={tipo.id} value={tipo.id}>
                                                            {tipo.nombre}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            {data.idTipoAtributo && (
                                                <Box>
                                                    <MenuSelector
                                                        label="Atributos seleccionados"
                                                        menus={(atributosDisponibles || []).filter(
                                                            (attr) =>
                                                                attr.tipo_atributo_id === data.idTipoAtributo
                                                        )}
                                                        selectedMenus={(atributosDisponibles || []).filter(
                                                            (attr) =>
                                                                (data.atributos || []).includes(attr.id)
                                                        )}
                                                        onChange={(newAtributos) => {
                                                            const ids = newAtributos.map((a) => a.id);
                                                            setData("atributos", ids);
                                                        }}
                                                    />
                                                    {errors.atributos && (
                                                        <Typography
                                                            variant="caption"
                                                            color="error"
                                                            sx={{ mt: 0.5, display: "block" }}
                                                        >
                                                            {errors.atributos}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Box>

                                <TextField
                                    fullWidth
                                    label="SKU"
                                    value={data.sku}
                                    onChange={(e) => setData("sku", e.target.value)}
                                    error={!!errors.sku}
                                    helperText={errors.sku}
                                    required
                                />

                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Precio Base ($)"
                                        type="number"
                                        value={data.precio}
                                        onChange={(e) => setData("precio", e.target.value)}
                                        error={!!errors.precio}
                                        helperText={errors.precio}
                                        required
                                    />

                                    <TextField
                                        fullWidth
                                        label="Descuento Minorista (%)"
                                        type="number"
                                        value={data.descuento}
                                        onChange={(e) => setData("descuento", e.target.value)}
                                        error={!!errors.descuento}
                                        helperText={errors.descuento || "Opcional"}
                                        inputProps={{ min: 0, max: 100 }}
                                    />
                                </Box>

                                {/* Configuración Mayorista */}
                                <Box
                                    sx={{
                                        border: "1px solid #ce93d8",
                                        borderRadius: 2,
                                        p: 2,
                                        bgcolor: data.es_mayorista ? "#f3e5f5" : "#fafafa",
                                        transition: "all 0.3s",
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={Boolean(data.es_mayorista)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setData((prev) => ({
                                                        ...prev,
                                                        es_mayorista: checked,
                                                        cant_minima_mayorista: checked ? (prev.cant_minima_mayorista || "10") : "",
                                                        descuento_mayorista: checked ? (prev.descuento_mayorista || "20") : "",
                                                    }));
                                                }}
                                                color="secondary"
                                            />
                                        }
                                        label={
                                            <Typography fontWeight="bold" color="secondary.main">
                                                Habilitar Venta Mayorista
                                            </Typography>
                                        }
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: data.es_mayorista ? 2 : 0 }}>
                                        Permite que este producto aparezca en el catálogo /mayorista y aplique precio por mayor en el carrito al alcanzar la cantidad mínima.
                                    </Typography>

                                    {data.es_mayorista && (
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Cantidad Mínima Mayorista"
                                                    type="number"
                                                    value={data.cant_minima_mayorista}
                                                    onChange={(e) =>
                                                        setData("cant_minima_mayorista", e.target.value)
                                                    }
                                                    error={!!errors.cant_minima_mayorista}
                                                    helperText={errors.cant_minima_mayorista || "Ej: 10 unidades"}
                                                    inputProps={{ min: 1 }}
                                                    required={data.es_mayorista}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="Descuento Mayorista (%)"
                                                    type="number"
                                                    value={data.descuento_mayorista}
                                                    onChange={(e) =>
                                                        setData("descuento_mayorista", e.target.value)
                                                    }
                                                    error={!!errors.descuento_mayorista}
                                                    helperText={errors.descuento_mayorista || "Ej: 20%"}
                                                    inputProps={{ min: 0, max: 100 }}
                                                    required={data.es_mayorista}
                                                />
                                            </Box>

                                            {/* Vista previa cálculo mayorista */}
                                            {data.precio && data.descuento_mayorista && (
                                                <Box sx={{ p: 1.5, bgcolor: "white", borderRadius: 1.5, border: "1px dashed #ab47bc" }}>
                                                    <Typography variant="body2" color="secondary.dark" fontWeight="bold">
                                                        Vista Previa Precio Mayorista:
                                                    </Typography>
                                                    <Typography variant="body2" color="text.primary">
                                                        Precio Final Mayorista: <strong>${Math.round(Number(data.precio) * (1 - Number(data.descuento_mayorista) / 100)).toLocaleString('es-AR')}</strong> / unidad
                                                        {" "}(Ahorro de ${Math.round(Number(data.precio) * (Number(data.descuento_mayorista) / 100)).toLocaleString('es-AR')} por unidad a partir de {data.cant_minima_mayorista || 1} u.)
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Stock"
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData("stock", e.target.value)}
                                        error={!!errors.stock}
                                        helperText={errors.stock}
                                        inputProps={{ min: 0 }}
                                        required
                                    />

                                    <TextField
                                        fullWidth
                                        label="Peso (kg)"
                                        type="number"
                                        value={data.peso}
                                        onChange={(e) => setData("peso", e.target.value)}
                                        error={!!errors.peso}
                                        helperText={errors.peso}
                                        inputProps={{ min: 0, step: 0.01 }}
                                        required
                                    />
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Dimensiones (ej: 10x10x5 cm)"
                                    value={data.dimensiones}
                                    onChange={(e) => setData("dimensiones", e.target.value)}
                                    error={!!errors.dimensiones}
                                    helperText={errors.dimensiones}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Tags (separados por comas)"
                                    value={data.tags}
                                    onChange={(e) => setData("tags", e.target.value)}
                                    error={!!errors.tags}
                                    helperText={errors.tags}
                                    placeholder="cerámica, artesanal, decorativo"
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data.activo}
                                            onChange={(e) => setData("activo", e.target.checked)}
                                            color="success"
                                        />
                                    }
                                    label="Producto Activo (visible en la tienda)"
                                />
                            </Box>

                            {/* Columna Derecha - Gestión de Imágenes */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Imágenes del Producto
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                        Gestiona las imágenes existentes o añade nuevas fotografías.
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUpload />}
                                        fullWidth
                                        sx={{ py: 1.2, mb: 2 }}
                                    >
                                        Subir Nuevas Imágenes
                                        <input
                                            type="file"
                                            hidden
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </Box>

                                {/* Sección de imágenes existentes */}
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                        Imágenes Actuales ({imagenesExistentes.length})
                                    </Typography>

                                    {imagenesExistentes.length === 0 ? (
                                        <Typography variant="caption" color="text.secondary">
                                            No hay imágenes registradas
                                        </Typography>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                                                gap: 1.5,
                                                mb: 3,
                                            }}
                                        >
                                            {imagenesExistentes.map((img, index) => {
                                                const isDeleted = imagenesEliminar.includes(img.id);
                                                return (
                                                    <Box
                                                        key={img.id}
                                                        sx={{
                                                            position: "relative",
                                                            aspectRatio: "1",
                                                            borderRadius: 1.5,
                                                            overflow: "hidden",
                                                            border: isDeleted
                                                                ? "2px solid #d32f2f"
                                                                : "1px solid #e0e0e0",
                                                            opacity: isDeleted ? 0.35 : 1,
                                                            transition: "all 0.2s ease-in-out",
                                                            bgcolor: "#f5f5f5",
                                                        }}
                                                    >
                                                        <img
                                                            src={`/storage/productos/${img.urlImagen}`}
                                                            alt={`Producto ${producto.nombre}`}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                display: "block",
                                                            }}
                                                        />

                                                        {/* Badge Principal */}
                                                        {index === 0 && !isDeleted && (
                                                            <Box
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 6,
                                                                    left: 6,
                                                                    bgcolor: "primary.main",
                                                                    color: "white",
                                                                    px: 0.8,
                                                                    py: 0.3,
                                                                    borderRadius: 1,
                                                                    fontSize: "0.65rem",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                Principal
                                                            </Box>
                                                        )}

                                                        {/* Botón eliminar o restaurar */}
                                                        <Box sx={{ position: "absolute", top: 6, right: 6 }}>
                                                            {isDeleted ? (
                                                                <Tooltip title="Restaurar imagen">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleRestaurarExistente(img.id)}
                                                                        sx={{
                                                                            bgcolor: "success.main",
                                                                            color: "white",
                                                                            "&:hover": { bgcolor: "success.dark" },
                                                                        }}
                                                                    >
                                                                        <RestoreFromTrash fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            ) : (
                                                                <Tooltip title="Eliminar imagen">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleMarcarEliminarExistente(img.id)}
                                                                        sx={{
                                                                            bgcolor: "error.main",
                                                                            color: "white",
                                                                            "&:hover": { bgcolor: "error.dark" },
                                                                        }}
                                                                    >
                                                                        <Delete fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </Box>

                                {/* Sección de nuevas imágenes cargadas */}
                                {nuevasImagenes.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1, fontWeight: "bold" }}>
                                            Nuevas Imágenes a Subir ({nuevasImagenes.length})
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                                                gap: 1.5,
                                            }}
                                        >
                                            {nuevasImagenes.map((imgObj, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        position: "relative",
                                                        aspectRatio: "1",
                                                        borderRadius: 1.5,
                                                        overflow: "hidden",
                                                        border: "2px dashed #1976d2",
                                                        bgcolor: "#f5f5f5",
                                                    }}
                                                >
                                                    <img
                                                        src={imgObj.preview}
                                                        alt={`Nueva ${index + 1}`}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            display: "block",
                                                        }}
                                                    />
                                                    <Box sx={{ position: "absolute", top: 6, right: 6 }}>
                                                        <Tooltip title="Quitar nueva imagen">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleRemoveNuevaImagen(index)}
                                                                sx={{
                                                                    bgcolor: "error.main",
                                                                    color: "white",
                                                                    "&:hover": { bgcolor: "error.dark" },
                                                                }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Botones de acción */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                justifyContent: "flex-end",
                                pt: 2,
                                borderTop: "1px solid #e0e0e0",
                            }}
                        >
                            <Tooltip title="Descartar cambios y volver al listado">
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        router.visit(route("dashboard.productos.index"))
                                    }
                                >
                                    Cancelar
                                </Button>
                            </Tooltip>
                            <Tooltip title="Guardar todos los cambios del producto">
                                <span>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Save />}
                                        disabled={processing || imagenesActivasCount === 0}
                                    >
                                        {processing ? "Guardando cambios..." : "Guardar Cambios"}
                                    </Button>
                                </span>
                            </Tooltip>
                        </Box>
                    </form>
                </Paper>
            </Box>

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
