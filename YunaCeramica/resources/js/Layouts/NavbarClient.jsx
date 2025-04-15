import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function NavbarClient({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Yuna Cerámica
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/productos" className="text-gray-600 hover:text-gray-900">
                Productos
              </Link>
              <Link href="/talleres" className="text-gray-600 hover:text-gray-900">
                Talleres
              </Link>
              <Link href="/contacto" className="text-gray-600 hover:text-gray-900">
                Contacto
              </Link>
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden px-2 pb-3 space-y-1">
            <Link href="/productos" className="block text-gray-600 hover:text-gray-900">
              Productos
            </Link>
            <Link href="/talleres" className="block text-gray-600 hover:text-gray-900">
              Talleres
            </Link>
            <Link href="/contacto" className="block text-gray-600 hover:text-gray-900">
              Contacto
            </Link>
          </div>
        )}
      </nav>

      {/* Acá se renderiza el contenido de la página */}
      <main className="pt-6 px-4">{children}</main>
    </>
  );
}
