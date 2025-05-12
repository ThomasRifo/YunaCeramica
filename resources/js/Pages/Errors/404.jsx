import { Link } from '@inertiajs/react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center pb-32 text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-2xl font-semibold mb-2">Página no encontrada</p>
      <p className="text-gray-600 mb-6">La página que estás buscando no existe.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}