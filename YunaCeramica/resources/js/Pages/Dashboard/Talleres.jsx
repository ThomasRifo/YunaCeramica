// resources/js/Pages/Talleres/Index.jsx

import { Head } from "@inertiajs/react";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button, IconButton } from "@mui/material";
import { Add, AddCircleOutline } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function TalleresIndex({ talleres = [] }) {
  const [mode, setMode] = React.useState("light");

  const theme = useTheme();

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

    const columns = [
        {
            field: "nombre",
            headerName: "Nombre",
            width: 200,
            sortable: false,
            filterable: false,
        },
        { field: "fecha", 
          headerName: "Fecha", 
          width: 150, 
          sortable: true,
        
          filterable: false,
        },
        {
            field: "precio",
            headerName: "Precio",
            width: 100,
            align: "center",
            sortable: false,
            filterable: false,
        },
        {
            field: "ubicacion",
            headerName: "Ubicación",
            width: 300,
            sortable: false,
            filterable: false,
        },
        {
            field: "inscriptos", 
            headerName: "Inscriptos",
            width: 100,
            sortable: false,
            align: "center",
            filterable: false,
            renderCell: (params) =>
                `${params.row.cantInscriptos}/${params.row.cupoMaximo}`,
        },
        {
            field: "acciones",
            headerName: "Acciones",
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className="flex gap-2">
                    <IconButton
                        aria-label="editar"
                        color="primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditar(params.row);
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        aria-label="eliminar"
                        color="error"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEliminar(params.row);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                        <DeleteForeverIcon />
                    </IconButton>
                    <IconButton
                        aria-label="ver detalles"
                        color="success"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleVer(params.row);
                        }}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    >
                        <VisibilityIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Talleres" />


            <div className="py-12 max-w-screen-2xl h-auto ml-0">
              <div className=" w-4/5 justify-end flex mx-auto pb-8 "> <Button
          variant={theme.palette.mode === "dark" ? "outlined" : "contained"}
          endIcon={<Add />}

        >
          Nuevo Taller
        </Button></div>
           
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 h-screen">
                    <Paper sx={{ height: "75%", width: "100%", p: 2 }}
                     elevation={0}
                    >
                        <DataGrid
                            maxWidth="xl"
                            rows={talleres}
                            columns={columns}
                            onRowDoubleClick={(params) => handleVer(params.row)}
                            pageSizeOptions={[5, 10]}
                            sx={{
                              border: "none",
                              "& .MuiDataGrid-cell": {
                                color: "inherit",
                                borderBottom: "1px solid #ECEFF1",
                              },
                              "& .MuiDataGrid-columnSeparator": {
                                color: "#666",
                              },
                              "& .MuiDataGrid-columnHeaders": {
                                borderBottom: "1px solid #B0BEC5",
                                borderTop: "1px solid "
                              },
                             "& .MuiDataGrid-row:hover": (theme) => ({
  transition: "all 0.3s ease",
  ...(theme.palette.mode === "dark"
    ? {
        backgroundColor: "#2a2a2a", // 🔥 Hover más oscuro en darkmode
        color: "#fbd5e5", // y además cambia el color del texto
      }
    : {
        backgroundColor: "#fbd5e5", // 🔥 Hover rosita en lightmode
      }),
}),
                          
                            }}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },

                                },
                                sorting: {
                                  sortModel: [{ field: "fecha", sort: "desc" }],
                                },
                            }}
                           
                            checkboxSelection={false}
                        />
                    </Paper>
                </div>
            </div>
        </>
    );
}
