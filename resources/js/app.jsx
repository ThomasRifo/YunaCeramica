import '../css/app.css';
import './bootstrap';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // asegúrate de que esta ruta sea correcta
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import DashboardLayout from './Layouts/DashboardLayout';
import NavbarClient from './Layouts/NavbarClient';
import { Ziggy } from './ziggy';
import Footer from './Components/Footer';
import { Toaster } from "@/Components/ui/toaster";

const appName = import.meta.env.VITE_APP_NAME || 'Yuna Cerámica';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx');
    return resolvePageComponent(`./Pages/${name}.jsx`, pages).then((module) => {
      const isDashboard = name.startsWith('Dashboard/') ||
        (name.startsWith('Errors/') && window.location.pathname.startsWith('/dashboard'));

      module.default.layout = (page) =>
        isDashboard
          ? <DashboardLayout>{page}</DashboardLayout>
          : (
            <>
              <NavbarClient>{page}</NavbarClient>
              <Footer />
              <Toaster />
            </>
          );

      return module;
    });
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App {...props} />
      </ThemeProvider>
    );
  },
  progress: {
    color: '#4B5563',
  },
});
