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
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CategoryIcon from "@mui/icons-material/Category";
import ConstructionIcon from "@mui/icons-material/Construction";
import SellIcon from "@mui/icons-material/Sell";

import { Link } from "@inertiajs/react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import useInertiaRouter from "./InertiaRouterAdapter";
import UserMenu from "@/Components/UserMenu";

const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
  {
    segment: "tienda",
    title: "Tienda",
    icon: <StoreIcon />,
    children: [
      { segment: "../dashboard/productos", title: "Productos", icon: <DescriptionIcon /> },
      { segment: "../dashboard/categorias", title: "Categorías", icon: <CategoryIcon /> },
      { segment: "clientes", title: "Clientes", icon: <GroupsIcon /> },
      { segment: "ventas", title: "Ventas", icon: <SellIcon /> },
    ],
  },
  { segment: "dashboard/pedidos", title: "Pedidos", icon: <ShoppingCartIcon /> },
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
    console.log("🎨 Modo actual del tema:", theme.palette.mode);
  }, [theme.palette.mode]);

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={theme}
      router={router}
      linkComponent={(props) => <Link {...props} />}
      branding={{
        logo: (
          <img src="https://mui.com/static/logo.png" alt="MUI logo" />
        ),
        title: "Yuna Cerámica",
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

  return (
    <ThemeProvider theme={theme}>
      <InnerLayout router={router} toggleColorMode={toggleColorMode}>
        {children}
      </InnerLayout>
    </ThemeProvider>
  );
}
