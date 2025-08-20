import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ReviewThanks() {
  useEffect(() => {
    const t = setTimeout(() => {
      window.close();
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Head title="¡Gracias!" />
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-lg text-center">
        <h1 className="text-2xl font-semibold mb-2">¡Gracias por tu reseña!</h1>
        <p className="text-gray-600 mb-1">La recibimos correctamente.</p>
        <p className="text-gray-600 mb-6">Esta pestaña se cerrará automáticamente en 3 segundos.</p>
        <Link href={route('talleres')} className="text-teal-700 underline">Ir al sitio</Link>
      </div>
    </div>
  );
}

