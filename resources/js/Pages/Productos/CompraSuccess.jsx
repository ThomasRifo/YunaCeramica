import { Head, Link } from "@inertiajs/react";
import { CheckCircle, Package, Mail, MapPin } from "lucide-react";

export default function CompraSuccess({ compra }) {
  if (!compra) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Compra no encontrada</h1>
          <Link href="/productos" className="text-blue-600 hover:text-blue-700">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Compra Exitosa - Yuna Cerámica</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-32">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {compra.metodoPago?.nombre === 'Mercado Pago' 
                  ? '¡Compra Realizada con Éxito!'
                  : '¡Pedido Realizado con Éxito!'
                }
              </h1>
              <p className="text-gray-600">
                {compra.metodoPago?.nombre === 'Mercado Pago'
                  ? `Tu compra #${compra.id} ha sido confirmada y pagada`
                  : `Tu pedido #${compra.id} ha sido registrado correctamente`
                }
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen de tu compra</h2>
              
              <div className="space-y-3 mb-4">
                {compra.detalles && compra.detalles.map((detalle) => (
                  <div key={detalle.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{detalle.nombreProducto}</span>
                      <span className="text-gray-600 ml-2">x{detalle.cantidad}</span>
                    </div>
                    <span className="font-medium">
                      ${(detalle.precioUnitario * detalle.cantidad).toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                {compra.costo_envio > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>${compra.costo_envio.toLocaleString('es-AR')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${compra.total.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Email enviado</div>
                  <div className="text-sm text-gray-600">
                    Hemos enviado un email a <strong>{compra.email}</strong> con los detalles de tu compra
                    {compra.metodoPago?.nombre === 'Transferencia' && ' y las instrucciones de pago'}
                  </div>
                </div>
              </div>

              {compra.tipo_entrega === 'retiro' && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Retiro en local</div>
                    <div className="text-sm text-gray-600">
                      Barrio San Lorenzo - Cipolletti. Los datos precisos se enviarán una vez confirmado el pago.
                    </div>
                  </div>
                </div>
              )}

              {compra.tipo_entrega === 'envio' && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Package className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Envío a domicilio</div>
                    <div className="text-sm text-gray-600">
                      Coordinaremos la entrega contigo vía WhatsApp dentro de las 48 horas.
                    </div>
                  </div>
                </div>
              )}

              {compra.metodoPago?.nombre === 'Transferencia' && (
                <div className="p-4 bg-yellow-50 rounded-lg text-left">
                  <div className="font-medium text-gray-900 mb-2">Próximos pasos:</div>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Revisa tu email para obtener los datos de transferencia</li>
                    <li>Realiza la transferencia y envía el comprobante a yunaceramica@gmail.com</li>
                    <li>Tu pedido quedará confirmado una vez verifiquemos el pago</li>
                  </ul>
                  <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
                    <p className="text-sm text-gray-700">
                      <strong>Importante:</strong> Los productos seguirán disponibles para otras personas hasta que confirmemos tu pago.
                    </p>
                  </div>
                </div>
              )}

              {compra.metodoPago?.nombre === 'Efectivo' && (
                <div className="p-4 bg-yellow-50 rounded-lg text-left">
                  <div className="font-medium text-gray-900 mb-2">Próximos pasos:</div>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Te contactaremos pronto para coordinar el pago y la entrega</li>
                    <li>Revisa tu email para más detalles</li>
                  </ul>
                  <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
                    <p className="text-sm text-gray-700">
                      <strong>Importante:</strong> Los productos seguirán disponibles para otras personas hasta que efectúes el pago.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/productos"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Seguir Comprando
              </Link>
              <Link
                href="/mis-compras"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Ver Mis Compras
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

