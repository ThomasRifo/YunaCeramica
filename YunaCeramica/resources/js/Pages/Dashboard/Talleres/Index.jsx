import { Head } from "@inertiajs/react";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Add } from "@mui/icons-material";
import { router } from '@inertiajs/react';
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

export default function TalleresIndex({ talleres = [] }) {
  const [mode, setMode] = React.useState("light");
  const [tallerSeleccionado, setTallerSeleccionado] = React.useState(null);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const theme = useTheme();
  const fecha = dayjs(tallerSeleccionado?.fecha).format('DD-MM-YYYY');
  const handleEditar = (taller) => {
    router.visit(`/dashboard/talleres/${taller.id}/edit`);
  };

  const handleEliminar = (taller) => {
    setTallerSeleccionado(taller);
    setOpenConfirm(true);
  };

  const confirmarEliminar = () => {
    if (tallerSeleccionado) {
      router.put(route('dashboard.talleres.eliminar', tallerSeleccionado.id));
      setOpenConfirm(false);
      setTallerSeleccionado(null);
    }
  };

  const handleVer = (taller) => {
    router.visit(`/dashboard/talleres/${taller.id}`);
  };

  const columns = [
    {
      field: "nombre",
      headerName: "Nombre",
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const tallerFecha = dayjs(params.row.fecha);
        const hoy = dayjs();
        const esFuturo = hoy.isBefore(tallerFecha, 'day');
        return (
          <span style={{
            fontWeight: esFuturo ? 'bold' : 'normal',
            border: esFuturo ? '2px solid #f8bbd0' : 'none',
            padding: esFuturo ? '2px 6px' : '0',
            borderRadius: '6px'
          }}>{params.value}</span>
        );
      }
    },
    {
      field: "inscriptos",
      headerName: "Inscriptos",
      width: 100,
      sortable: false,
      align: "center",
      filterable: false,
      renderCell: (params) => `${params.row.cantInscriptos}/${params.row.cupoMaximo}`,
    },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 100,
      sortable: true,
      filterable: false,
      renderCell: (params) => `${dayjs(params.row.fecha).format('DD-MM-YYYY')}`,
    },
    {
      field: "precio",
      headerName: "Precio",
      width: 100,
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => `$ ${params.row.precio}`,
    },
    {
      field: "ubicacion",
      headerName: "Ubicación",
      width: 300,
      sortable: false,
      filterable: false,
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

      <Dialog
      className="mb-64"
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
      >
        <DialogTitle 
        sx={{
           
        }}>Confirmar acción</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que querés eliminar el taller "{tallerSeleccionado?.nombre}" del {fecha}? <br></br>
            Esta acción no tiene vueltra atras.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
          <Button onClick={confirmarEliminar} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <div className="py-12 max-w-screen-2xl h-auto ml-0">
        <div className=" w-4/5 justify-end flex mx-auto pb-8 ">
          <Button
          onClick={() => router.visit(route('dashboard.talleres.create'))}
            variant={theme.palette.mode === "dark" ? "outlined" : "contained"}
            endIcon={<Add />}
            sx={{
              bgcolor: theme.palette.mode === "dark" ? 'transparent' : '#f8bbd0',
              color: theme.palette.mode === "dark" ? '#f8bbd0' : '#000',
              borderColor: theme.palette.mode === "dark" ? '#f8bbd0' : undefined,
              '&:hover': {
                bgcolor: theme.palette.mode === "dark" ? '#f8bbd0' : '#f48fb1',
                color: '#000',
                transition: 'all 0.3s ease-in-out',
               
              }
            }}
          >
            Nuevo Taller
          </Button>
        </div>

        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 h-screen">
          <Paper sx={{ height: "75%", width: "100%", p: 2 }} elevation={0}>
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
                  transition: "all 0.2s ease",
                  ...(theme.palette.mode === "dark"
                    ? {
                        backgroundColor: "#2a2a2a",
                        color: "#fbd5e5",
                      }
                    : {
                        backgroundColor: "#fbd5e5",
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
