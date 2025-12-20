import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, CreditCard, Banknote, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Checkout({ items, subtotal, costoEnvio, total, tipoEntrega, metodosPago, cantidadItems }) {
  const { toast } = useToast();
  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
  });

  const [direccion, setDireccion] = useState({
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    piso: '',
    departamento: '',
  });

  const [metodoPago, setMetodoPago] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);

  // Cargar datos del usuario si está autenticado
  useEffect(() => {
    // TODO: Cargar datos del usuario autenticado si existe
  }, []);

  // Si no hay items, redirigir al carrito
  useEffect(() => {
    if (!items || items.length === 0) {
      router.visit('/carrito');
    }
  }, [items]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    // Si hay errores, mostrar notificación
    const mostrarErrorValidacion = () => {
      toast({
        title: "Datos incompletos",
        description: "Por favor, revisá los campos en rojo.",
        variant: "destructive",
      });
    };

    // Validar datos del cliente
    if (!datosCliente.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    if (!datosCliente.apellido.trim()) nuevosErrores.apellido = 'El apellido es requerido';
    if (!datosCliente.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosCliente.email)) {
      nuevosErrores.email = 'El email no es válido';
    }
    if (!datosCliente.telefono.trim()) nuevosErrores.telefono = 'El teléfono es requerido';

    // Validar dirección si es envío
    if (tipoEntrega === 'envio') {
      if (!direccion.calle.trim()) nuevosErrores.calle = 'La calle es requerida';
      if (!direccion.numero.trim()) nuevosErrores.numero = 'El número es requerido';
      if (!direccion.ciudad.trim()) nuevosErrores.ciudad = 'La ciudad es requerida';
      if (!direccion.provincia.trim()) nuevosErrores.provincia = 'La provincia es requerida';
      if (!direccion.codigoPostal.trim()) nuevosErrores.codigoPostal = 'El código postal es requerido';
    } else {
      // Si es retiro, usar datos por defecto
      setDireccion({
        calle: 'Barrio San Lorenzo',
        numero: '0',
        ciudad: 'Cipolletti',
        provincia: 'Río Negro',
        codigoPostal: '8324',
        piso: '',
        departamento: '',
      });
    }

    // Validar método de pago
    if (!metodoPago) {
      nuevosErrores.metodoPago = 'Debes seleccionar un método de pago';
    }

    setErrores(nuevosErrores);
    const esValido = Object.keys(nuevosErrores).length === 0;
    if (!esValido) {
      mostrarErrorValidacion();
    }
    return esValido;
  };

  const prepararDatosCompra = () => {
    return {
      items: items.map(item => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      })),
      datos_cliente: datosCliente,
      direccion: tipoEntrega === 'envio' ? direccion : {
        calle: 'Barrio San Lorenzo',
        numero: '0',
        ciudad: 'Cipolletti',
        provincia: 'Río Negro',
        codigoPostal: '8324',
        piso: '',
        departamento: '',
      },
      tipo_entrega: tipoEntrega,
      costo_envio: costoEnvio,
      total: total,
      observaciones: observaciones,
      idMetodoPago: metodoPago,
    };
  };

  const handleMercadoPago = async () => {
    if (!validarFormulario()) return;

    setProcesando(true);

    try {
      const datos = prepararDatosCompra();
      
      const response = await fetch('/api/mercadopago/productos/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(datos),
      });

      const data = await response.json();

      if (response.ok && data?.mercadopago?.init_point) {
        // Redirigir a MercadoPago
        window.location.href = data.mercadopago.init_point;
      } else {
        const errorMessage = data?.message || 'Error al iniciar el pago. Por favor, intenta nuevamente.';
        toast({
          title: "Error al iniciar el pago",
          description: errorMessage,
          variant: "destructive",
        });
        setProcesando(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error de red",
        description: error.message || "Ocurrió un error de red o al procesar la solicitud. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
      setProcesando(false);
    }
  };

  const handleTransferencia = async () => {
    if (!validarFormulario()) return;

    setProcesando(true);

    try {
      const datos = prepararDatosCompra();
      
      const response = await fetch('/compras/transferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(datos),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "¡Pedido realizado!",
          description: "Redirigiendo a la confirmación...",
        });
        router.visit(`/productos/compra/success?compra_id=${data.compra_id}`);
      } else {
        toast({
          title: "Error al procesar la compra",
          description: data.message || 'Ocurrió un error al procesar tu compra. Por favor, intenta nuevamente.',
          variant: "destructive",
        });
        setProcesando(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error de red",
        description: "Ocurrió un error de red o al procesar la solicitud. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
      setProcesando(false);
    }
  };

  const handleEfectivo = async () => {
    if (!validarFormulario()) return;

    setProcesando(true);

    try {
      const datos = prepararDatosCompra();
      
      const response = await fetch('/compras/efectivo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(datos),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "¡Pedido realizado!",
          description: "Redirigiendo a la confirmación...",
        });
        router.visit(`/productos/compra/success?compra_id=${data.compra_id}`);
      } else {
        toast({
          title: "Error al procesar la compra",
          description: data.message || 'Ocurrió un error al procesar tu compra. Por favor, intenta nuevamente.',
          variant: "destructive",
        });
        setProcesando(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error de red",
        description: "Ocurrió un error de red o al procesar la solicitud. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
      setProcesando(false);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Checkout - Yuna Cerámica</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/carrito"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al carrito
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-6">
              {/* Datos del Cliente */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Datos de Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={datosCliente.nombre}
                      onChange={(e) => setDatosCliente({ ...datosCliente, nombre: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errores.nombre ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errores.nombre && (
                      <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={datosCliente.apellido}
                      onChange={(e) => setDatosCliente({ ...datosCliente, apellido: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errores.apellido ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errores.apellido && (
                      <p className="text-red-500 text-sm mt-1">{errores.apellido}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={datosCliente.email}
                      onChange={(e) => setDatosCliente({ ...datosCliente, email: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errores.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errores.email && (
                      <p className="text-red-500 text-sm mt-1">{errores.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={datosCliente.telefono}
                      onChange={(e) => setDatosCliente({ ...datosCliente, telefono: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errores.telefono ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errores.telefono && (
                      <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dirección (solo si es envío) */}
              {tipoEntrega === 'envio' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Dirección de Envío</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Calle *
                      </label>
                      <input
                        type="text"
                        value={direccion.calle}
                        onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errores.calle ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errores.calle && (
                        <p className="text-red-500 text-sm mt-1">{errores.calle}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={direccion.numero}
                        onChange={(e) => setDireccion({ ...direccion, numero: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errores.numero ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errores.numero && (
                        <p className="text-red-500 text-sm mt-1">{errores.numero}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Piso
                      </label>
                      <input
                        type="text"
                        value={direccion.piso}
                        onChange={(e) => setDireccion({ ...direccion, piso: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departamento
                      </label>
                      <input
                        type="text"
                        value={direccion.departamento}
                        onChange={(e) => setDireccion({ ...direccion, departamento: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        value={direccion.ciudad}
                        onChange={(e) => setDireccion({ ...direccion, ciudad: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errores.ciudad ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errores.ciudad && (
                        <p className="text-red-500 text-sm mt-1">{errores.ciudad}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provincia *
                      </label>
                      <input
                        type="text"
                        value={direccion.provincia}
                        onChange={(e) => setDireccion({ ...direccion, provincia: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errores.provincia ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errores.provincia && (
                        <p className="text-red-500 text-sm mt-1">{errores.provincia}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        value={direccion.codigoPostal}
                        onChange={(e) => setDireccion({ ...direccion, codigoPostal: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errores.codigoPostal ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errores.codigoPostal && (
                        <p className="text-red-500 text-sm mt-1">{errores.codigoPostal}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tipo de Entrega */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tipo de Entrega</h2>
                <div className="p-4 border-2 border-blue-600 bg-blue-50 rounded-lg">
                  {tipoEntrega === 'retiro' ? (
                    <>
                      <div className="font-medium text-gray-900">Retiro en local</div>
                      <div className="text-sm text-gray-600">Barrio San Lorenzo - Cipolletti</div>
                      <div className="text-sm text-gray-500">Los datos precisos se enviarán después de la compra</div>
                    </>
                  ) : (
                    <>
                      <div className="font-medium text-gray-900">Envío a domicilio</div>
                      <div className="text-sm text-gray-600">${costoEnvio.toLocaleString('es-AR')} - Solo en la zona</div>
                    </>
                  )}
                </div>
              </div>

              {/* Método de Pago */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Método de Pago</h2>
                {errores.metodoPago && (
                  <p className="text-red-500 text-sm mb-4">{errores.metodoPago}</p>
                )}
                <div className="space-y-3">
                  {metodosPago && metodosPago.map((metodo) => (
                    <button
                      key={metodo.id}
                      onClick={() => setMetodoPago(metodo.id)}
                      className={`w-full p-4 border-2 rounded-lg text-left transition ${
                        metodoPago === metodo.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {metodo.id === 2 ? (
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        ) : metodo.id === 1 ? (
                          <Banknote className="w-6 h-6 text-blue-600" />
                        ) : (
                          <Wallet className="w-6 h-6 text-blue-600" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{metodo.nombre}</div>
                          {metodo.descripcion && (
                            <div className="text-sm text-gray-600">{metodo.descripcion}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Observaciones */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Observaciones (Opcional)</h2>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alguna indicación especial para la entrega..."
                />
              </div>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen de Compra</h2>
                
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.idProducto} className="flex gap-3">
                      <img
                        src={item.imagen ? `/storage/productos/${item.imagen}` : '/storage/uploads/placeholder.jpg'}
                        alt={item.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.nombre}</div>
                        <div className="text-sm text-gray-600">
                          {item.cantidad} x ${item.precio.toLocaleString('es-AR')}
                        </div>
                      </div>
                      <div className="font-medium">
                        ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('es-AR')}</span>
                  </div>
                  {costoEnvio > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Envío</span>
                      <span>${costoEnvio.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toLocaleString('es-AR')}</span>
                  </div>
                </div>

                {/* Botones de Pago */}
                <div className="mt-6 space-y-3">
                  {metodoPago === 2 && (
                    <button
                      onClick={handleMercadoPago}
                      disabled={procesando}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      {procesando ? 'Procesando...' : 'Pagar con MercadoPago'}
                    </button>
                  )}
                  {metodoPago === 1 && (
                    <button
                      onClick={handleTransferencia}
                      disabled={procesando}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Banknote className="w-5 h-5" />
                      {procesando ? 'Procesando...' : 'Pagar con Transferencia'}
                    </button>
                  )}
                  {metodoPago === 3 && (
                    <button
                      onClick={handleEfectivo}
                      disabled={procesando}
                      className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Wallet className="w-5 h-5" />
                      {procesando ? 'Procesando...' : 'Pagar en Efectivo'}
                    </button>
                  )}
                  {!metodoPago && (
                    <p className="text-sm text-gray-500 text-center">
                      Selecciona un método de pago para continuar
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

