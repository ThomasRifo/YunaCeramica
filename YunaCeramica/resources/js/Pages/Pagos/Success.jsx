import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function Success() {
    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split('?')[1]);

    const paymentId = queryParams.get('payment_id');
    const status = queryParams.get('status');
    const externalReference = queryParams.get('external_reference');
    const merchantOrderId = queryParams.get('merchant_order_id');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-12">
            <Head title="Pago Exitoso" />

            <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl max-w-2xl w-full text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    ¡Pago Aprobado!
                </h1>
                <p className="text-gray-600 mb-6 text-lg">
                    Tu inscripción al taller ha sido confirmada exitosamente.
                </p>

                <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 space-y-2">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Detalles de la transacción:</h2>
                    {paymentId && (
                        <p className="text-sm text-gray-600"><strong>ID de Pago:</strong> {paymentId}</p>
                    )}
                     {merchantOrderId && (
                        <p className="text-sm text-gray-600"><strong>ID de Orden:</strong> {merchantOrderId}</p>
                    )}
                    {status && (
                        <p className="text-sm text-gray-600"><strong>Estado:</strong> <span className="font-semibold text-green-600">{status}</span></p>
                    )}
                    {externalReference && (
                        <p className="text-sm text-gray-600"><strong>Referencia:</strong> {externalReference}</p>
                    )}
                   
                </div>

                <p className="text-gray-600 mb-6">
                    Recibirás un correo electrónico con los detalles completos en breve. ¡Gracias por tu confianza!
                </p>

                <Link
                    href={route('talleres')} // Asumiendo que tienes una ruta llamada 'talleres' para ver la lista
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out"
                >
                    Ver Próximos Talleres
                </Link>
                 <Link
                    href={route('talleres')} // Ruta a tu página de inicio
                    className="mt-4 sm:mt-0 sm:ml-4 inline-block text-blue-600 hover:text-blue-800 font-semibold py-3 px-6 transition duration-300 ease-in-out"
                >
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
} 