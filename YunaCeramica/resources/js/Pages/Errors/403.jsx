import { usePage } from '@inertiajs/react';

export default function Forbidden() {
  const { url } = usePage();

  return (
    <div className="min-h-screen flex flex-col justify-center pb-32 items-center text-center px-4">
      <h1 className="text-6xl font-bold text-yellow-500 mb-4">403</h1>
      <p className="text-2xl font-semibold mb-2">Acceso denegado</p>
      <p className="text-gray-600 mb-6">
        No tenés permisos para acceder a esta página: <code>{url}</code>
      </p>
      <button
        onClick={() => window.history.back()}
        className="text-blue-600 hover:underline"
      >
        Volver a la página anterior
      </button>
    </div>
  );
}