import React, { useState, useMemo } from "react";
import SubcategoriaTable from "../../../Components/SubcategoriaTable";
import SearchBar from "../../../Components/SearchBar";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";

const Index = ({ subcategorias }) => {
    const [search, setSearch] = useState("");

    // Filtrado instantáneo por nombre de subcategoría o nombre de categoría
    const filtered = useMemo(() => {
        const s = search.toLowerCase();
        return subcategorias.filter(
            (sc) =>
                sc.nombre.toLowerCase().includes(s) ||
                (sc.categoria_nombre &&
                    sc.categoria_nombre.toLowerCase().includes(s)),
        );
    }, [search, subcategorias]);

    // Callbacks vacíos por ahora
    const handleEdit = () => {};
    const handleDelete = () => {};
    const handleToggleActive = () => {};

    return (
        <Box sx={{ width: "80%", mx: "auto", mt: 4 }}>
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
                <Box className="w-4/5 justify-end flex mx-auto pb-8">
                <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre o tipo..."
                    />
                </Box>
                <Box className="w-1/6 flex mx-auto pb-8">
                   
                                        <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{
                            minWidth: 120,
                            position: "relative",
                            right: 0,
                            top: 0,
                        }}
                    >
                        Agregar
                    </Button>
                </Box>
            </Box>
            <SubcategoriaTable
                subcategorias={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
            />
        </Box>
    );
};

export default Index;
