import { Link } from '@inertiajs/react';

export default function ServerError() {
  return (
    <div className="min-h-screen flex flex-col justify-center pb-32 items-center text-center px-4">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">500</h1>
      <p className="text-2xl font-semibold mb-2">Error del servidor</p>
      <p className="text-gray-600 mb-6">
        Ocurrió un error inesperado. Estamos trabajando para solucionarlo.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}