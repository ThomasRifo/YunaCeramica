import '../css/app.css';
import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import NavbarClient from './Layouts/NavbarClient';
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

      if (isDashboard) {
        // Importa el layout y MUI solo si es dashboard
        return import('./Layouts/DashboardLayout').then(async ({ default: DashboardLayout }) => {
          // Importa MUI solo aquí
          const mui = await import('@mui/material');
          const theme = (await import('./theme')).default;
          module.default.layout = (page) => (
            <mui.ThemeProvider theme={theme}>
              <mui.CssBaseline />
              <DashboardLayout>{page}</DashboardLayout>
            </mui.ThemeProvider>
          );
          return module;
        });
      } else {
        module.default.layout = (page) => (
          <>
            <NavbarClient>{page}</NavbarClient>
            <Footer />
            <Toaster />
          </>
        );
        return module;
      }
    });
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <App {...props} />
    );
  },
  progress: {
    color: '#4B5563',
  },
});
