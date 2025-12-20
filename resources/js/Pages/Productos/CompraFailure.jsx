import { Head, Link } from "@inertiajs/react";
import { XCircle } from "lucide-react";

export default function CompraFailure({ mensaje }) {
  return (
    <>
      <Head>
        <title>Error en el Pago - Yuna Cerámica</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-32">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Error en el Pago
            </h1>
            <p className="text-gray-600 mb-6">
              {mensaje || 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.'}
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/productos"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Seguir Comprando
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

