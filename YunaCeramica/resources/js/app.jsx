import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import DashboardLayout from './Layouts/DashboardLayout';

import NavbarClient from './Layouts/NavbarClient';
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
          : <NavbarClient>{page}</NavbarClient>;
    
      return module;
    });
    
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});
