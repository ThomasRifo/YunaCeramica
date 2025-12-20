import { Head, Link } from "@inertiajs/react";
import { Clock, Mail } from "lucide-react";

export default function CompraPending({ compra }) {
  return (
    <>
      <Head>
        <title>Pago Pendiente - Yuna Cerámica</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-32">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pago Pendiente
            </h1>
            <p className="text-gray-600 mb-6">
              Tu pago está siendo procesado. Te notificaremos por email una vez que se confirme.
            </p>

            {compra && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Compra #{compra.id}</span>
                  <span className="text-xl font-bold">
                    ${compra.total.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Método de pago: {compra.metodoPago?.nombre || 'No especificado'}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-6 text-left">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Revisa tu email</div>
                <div className="text-sm text-gray-600">
                  Te enviaremos una notificación cuando el pago sea confirmado
                </div>
              </div>
            </div>

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

