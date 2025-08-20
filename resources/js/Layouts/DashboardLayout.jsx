import * as React from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";
import ReviewsIcon from '@mui/icons-material/Reviews';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CategoryIcon from "@mui/icons-material/Category";
import ConstructionIcon from "@mui/icons-material/Construction";
import SellIcon from "@mui/icons-material/Sell";
import HeaderSection from "@/Components/HeaderSection";
import { Link } from "@inertiajs/react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import useInertiaRouter from "./InertiaRouterAdapter";
import UserMenu from "@/Components/UserMenu";
import WebIcon from '@mui/icons-material/Web';
import { usePage, Link as InertiaLink } from '@inertiajs/react';
import BreadcrumbsNavigation from "@/Components/BreadcrumbsNavigation";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect } from 'react';



const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "../dashboard/subcategorias", title: "Categorías", icon: <CategoryIcon/> },
  {
    segment: "tienda",
    title: "Tienda",
    icon: <StoreIcon />,
    children: [
      { segment: "../dashboard/productos", title: "Productos", icon: <DescriptionIcon /> },
      { segment: "clientes", title: "Clientes", icon: <GroupsIcon /> },
      { segment: "ventas", title: "Ventas", icon: <SellIcon /> },
    ],
  },
  { segment: "dashboard/pedidos", title: "Pedidos", icon: <ShoppingCartIcon /> },
  { segment: "dashboard/reviews", title: "Reseñas", icon: <ReviewsIcon /> },
  { segment: "dashboard/talleres", title: "Talleres", icon: <ConstructionIcon /> },
  { kind: "divider" },
  { kind: "header", title: "Configuraciones" },
  {
    segment: "profile",
    title: "Cuenta",
    icon: <ManageAccountsIcon />,
    children: [
      { segment: "", title: "Profile", icon: <DescriptionIcon /> },
      { segment: "../logout", title: "Logout", icon: <CategoryIcon /> },
    ],
  },
  { segment: "dashboard/paginas", title: "Paginas", icon: <WebIcon  />, children: [
    { segment: "talleres", title: "Talleres", icon: <DescriptionIcon /> },
    { segment: "menu", title: "Menu", icon: <CategoryIcon /> },
    { segment: "archivos", title: "Subir Archivos", icon: <CloudUploadIcon /> },
  ],  },
];

// 🔁 Creamos una función para crear el theme según el modo
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
    },
  });

function InnerLayout({ children, router, toggleColorMode }) {
  const theme = useTheme();

  React.useEffect(() => {
    // Aquí puedes dejar otros efectos relacionados con el theme si los necesitas
  }, [theme.palette.mode]);

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={theme}
      router={router}
      className="h-96"
      linkComponent={(props) => <Link {...props} />}
      branding={{
        logo: (
          <div style={{ width: '250px', display: 'flex', alignItems: 'center' }}>
            <img src="/storage/uploads/yunalogo.webp" alt="Yuna Cerámica logo" style={{ height: '120px', width: 'auto' }} />
          </div>
        ),
        title: " ",
        color: "#000",
        homeUrl: "/",
      }}
    >
      <ToolpadDashboardLayout
        maxWidth="xl"
        
        slots={{
          toolbarAccount: () => (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconButton onClick={toggleColorMode} color="inherit">
                {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <UserMenu />
            </div>
          ),
        }}
      >
<PageContainer maxWidth="xl" className="w-auto h-auto">
  <HeaderSection className="p-0"/>
  {children}
</PageContainer>
      </ToolpadDashboardLayout>
    </AppProvider>
  );
}

export default function DashboardLayout({ children }) {
  const router = useInertiaRouter();

  // 🌓 Estado para cambiar el modo
  const [mode, setMode] = React.useState("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    const errorHandler = (event) => {
      if (event.detail?.response?.status === 419) {
        window.location.href = '/login?expired=1';
      }
    };

    window.addEventListener('inertia:error', errorHandler);

    return () => {
      window.removeEventListener('inertia:error', errorHandler);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <InnerLayout router={router} toggleColorMode={toggleColorMode}>
        {children}
      </InnerLayout>
    </ThemeProvider>
  );
}
