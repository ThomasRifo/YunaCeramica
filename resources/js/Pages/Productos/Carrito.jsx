import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Modal from "@/Components/Modal";

export default function Carrito({ items: itemsProp, total: totalProp, cantidadItems }) {
  const [items, setItems] = useState(itemsProp || []);
  const [subtotal, setSubtotal] = useState(totalProp || 0);
  const [actualizando, setActualizando] = useState({});
  const [eliminando, setEliminando] = useState({});
  const [tipoEntrega, setTipoEntrega] = useState(() => {
    // Recuperar de sessionStorage si existe
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('tipoEntrega') || 'retiro';
    }
    return 'retiro';
  });
  
  // Estados para modales
  const [modalError, setModalError] = useState({ isOpen: false, message: '' });
  const [modalConfirmarEliminar, setModalConfirmarEliminar] = useState({ isOpen: false, idProducto: null });
  const [modalConfirmarVaciar, setModalConfirmarVaciar] = useState({ isOpen: false });
  
  // Costo de envío (puedes ajustar este valor)
  const COSTO_ENVIO = 5000; // $5000 pesos argentinos
  
  const costoEnvio = tipoEntrega === 'envio' ? COSTO_ENVIO : 0;
  const total = subtotal + costoEnvio;

  useEffect(() => {
    setItems(itemsProp || []);
    setSubtotal(totalProp || 0);
  }, [itemsProp, totalProp]);

  useEffect(() => {
    // Guardar tipo de entrega en sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tipoEntrega', tipoEntrega);
    }
  }, [tipoEntrega]);

  const actualizarCantidad = async (idProducto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    setActualizando(prev => ({ ...prev, [idProducto]: true }));

    try {
      const response = await fetch(`/carrito/${idProducto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });

      const data = await response.json();

      if (response.ok) {
        // Recargar la página para obtener datos actualizados
        router.reload({ only: ['items', 'total', 'cantidadItems'] });
      } else {
        setModalError({ isOpen: true, message: data.message || 'Error al actualizar la cantidad' });
      }
    } catch (error) {
      console.error('Error:', error);
      setModalError({ isOpen: true, message: 'Error al actualizar la cantidad. Por favor, intenta de nuevo.' });
    } finally {
      setActualizando(prev => ({ ...prev, [idProducto]: false }));
    }
  };

  const eliminarProducto = async (idProducto) => {
    setModalConfirmarEliminar({ isOpen: true, idProducto });
  };

  const confirmarEliminarProducto = async () => {
    const idProducto = modalConfirmarEliminar.idProducto;
    if (!idProducto) return;

    setEliminando(prev => ({ ...prev, [idProducto]: true }));

    try {
      const response = await fetch(`/carrito/${idProducto}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Recargar la página para obtener datos actualizados
        router.reload({ only: ['items', 'total', 'cantidadItems'] });
      } else {
        setModalError({ isOpen: true, message: data.message || 'Error al eliminar el producto' });
      }
    } catch (error) {
      console.error('Error:', error);
      setModalError({ isOpen: true, message: 'Error al eliminar el producto. Por favor, intenta de nuevo.' });
    } finally {
      setEliminando(prev => ({ ...prev, [idProducto]: false }));
    }
  };

  const vaciarCarrito = async () => {
    setModalConfirmarVaciar({ isOpen: true });
  };

  const confirmarVaciarCarrito = async () => {
    try {
      const response = await fetch('/carrito/vaciar', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
      });

      const data = await response.json();

      if (response.ok) {
        router.reload({ only: ['items', 'total', 'cantidadItems'] });
      } else {
        setModalError({ isOpen: true, message: data.message || 'Error al vaciar el carrito' });
      }
    } catch (error) {
      console.error('Error:', error);
      setModalError({ isOpen: true, message: 'Error al vaciar el carrito. Por favor, intenta de nuevo.' });
    }
  };

  if (!items || items.length === 0) {
    return (
      <>
        <Head>
          <title>Carrito de Compras - Yuna Cerámica</title>
        </Head>

        <div className="min-h-screen bg-gray-50 py-32 ">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
              <p className="text-gray-600 mb-8">Agrega productos para comenzar tu compra</p>
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ver Productos
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Carrito de Compras - Yuna Cerámica</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
            <p className="text-gray-600 mt-2">{cantidadItems} {cantidadItems === 1 ? 'producto' : 'productos'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Productos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const imagenUrl = item.imagen 
                  ? `/storage/productos/${item.imagen}`
                  : '/storage/uploads/placeholder.jpg';
                
                const subtotal = item.precio * item.cantidad;
                const sinStock = item.stock === 0;
                const cantidadMaxima = item.stock;

                return (
                  <div
                    key={item.idProducto}
                    className={`bg-white rounded-lg shadow-md p-6 ${
                      sinStock ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Imagen */}
                      <Link
                        href={`/productos/${item.slug}`}
                        className="flex-shrink-0 w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={imagenUrl}
                          alt={item.nombre}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Información */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="flex-1">
                          <Link
                            href={`/productos/${item.slug}`}
                            className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2 block"
                          >
                            {item.nombre}
                          </Link>
                          <p className="text-lg font-bold text-blue-600 mb-2">
                            ${item.precio.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </p>
                          {sinStock && (
                            <p className="text-red-600 text-sm font-medium mb-2">
                              Sin stock disponible
                            </p>
                          )}
                          {!sinStock && item.cantidad > cantidadMaxima && (
                            <p className="text-orange-600 text-sm font-medium mb-2">
                              Stock disponible: {cantidadMaxima}
                            </p>
                          )}
                        </div>

                        {/* Controles */}
                        <div className="flex flex-col sm:items-end gap-4">
                          {/* Cantidad */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => actualizarCantidad(item.idProducto, item.cantidad - 1)}
                              disabled={actualizando[item.idProducto] || item.cantidad <= 1}
                              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => actualizarCantidad(item.idProducto, item.cantidad + 1)}
                              disabled={actualizando[item.idProducto] || item.cantidad >= cantidadMaxima}
                              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <p className="text-lg font-bold text-gray-900">
                            ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </p>

                          {/* Eliminar */}
                          <button
                            onClick={() => eliminarProducto(item.idProducto)}
                            disabled={eliminando[item.idProducto]}
                            className="text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center gap-1 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            {eliminando[item.idProducto] ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Botón Vaciar Carrito */}
              <div className="flex justify-end">
                <button
                  onClick={vaciarCarrito}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen</h2>
                
                {/* Opción de Entrega */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Entrega
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="tipoEntrega"
                        value="retiro"
                        checked={tipoEntrega === 'retiro'}
                        onChange={(e) => setTipoEntrega(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Retiro en local</div>
                        <div className="text-sm text-gray-600">Barrio San Lorenzo - Cipolletti</div>
                        <div className="text-sm text-gray-500">Los datos precisos se enviarán después de la compra</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="tipoEntrega"
                        value="envio"
                        checked={tipoEntrega === 'envio'}
                        onChange={(e) => setTipoEntrega(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Envío a domicilio</div>
                        <div className="text-sm text-gray-600">${COSTO_ENVIO.toLocaleString('es-AR')}</div>
                        <div className="text-sm text-gray-500">Solo disponible para Cipolletti, Neuquén y Fernández Oro</div>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cantidadItems} {cantidadItems === 1 ? 'producto' : 'productos'})</span>
                    <span className="font-medium">
                      ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  {tipoEntrega === 'envio' && (
                    <div className="flex justify-between text-gray-600">
                      <span>Envío</span>
                      <span className="font-medium">
                        ${costoEnvio.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>
                        ${total.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/checkout?tipo_entrega=${tipoEntrega}`}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Continuar al Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/productos"
                  className="block text-center text-gray-600 hover:text-gray-900 mt-4"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <Modal
        isOpen={modalError.isOpen}
        onClose={() => setModalError({ isOpen: false, message: '' })}
        title="Error"
        message={modalError.message}
        type="error"
      />

      <Modal
        isOpen={modalConfirmarEliminar.isOpen}
        onClose={() => setModalConfirmarEliminar({ isOpen: false, idProducto: null })}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este producto del carrito?"
        type="warning"
        showCancel={true}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminarProducto}
      />

      <Modal
        isOpen={modalConfirmarVaciar.isOpen}
        onClose={() => setModalConfirmarVaciar({ isOpen: false })}
        title="Confirmar acción"
        message="¿Estás seguro de que deseas vaciar el carrito?"
        type="warning"
        showCancel={true}
        confirmText="Vaciar carrito"
        cancelText="Cancelar"
        onConfirm={confirmarVaciarCarrito}
      />
    </>
  );
}

