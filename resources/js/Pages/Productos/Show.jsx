import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { ShoppingCart, Plus, Minus, CheckCircle, XCircle } from "lucide-react";


export default function ProductoShow({ producto }) {
  // 1. Verificación de seguridad inmediata
  if (!producto) return <div className="p-10 text-center">Cargando producto...</div>;

  const [cantidad, setCantidad] = useState(1);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [agregandoAlCarrito, setAgregandoAlCarrito] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // 2. Manejo de imágenes (evita errores si no hay imágenes)
  const imagenes = producto.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes.map(img => `/storage/productos/${img.urlImagen}`)
    : ['/storage/uploads/placeholder.jpg'];

  const precioFinal = producto.descuento 
    ? producto.precio * (1 - producto.descuento / 100)
    : producto.precio;

  const tieneStock = producto.stock > 0;

  const handleAgregarAlCarrito = async () => {
    if (!tieneStock || cantidad > producto.stock) return;

    setAgregandoAlCarrito(true);
    setMensaje(null);

    try {
      const response = await fetch('/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          idProducto: producto.id,
          cantidad: cantidad,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMensaje({ tipo: 'success', texto: data.message || 'Producto agregado al carrito' });
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setMensaje({ tipo: 'error', texto: data.message || 'Error al agregar al carrito' });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al agregar al carrito. Por favor, intenta nuevamente.' });
    } finally {
      setAgregandoAlCarrito(false);
    }
  };

  return (
    <>
      <Head title={`${producto.nombre} - Yuna Cerámica`} />
      
      <div className="max-w-7xl mx-auto px-4 py-32"> 
        <Link href="/productos" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Imagen */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-md">
              <img 
                src={imagenes[imagenSeleccionada]} 
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Miniaturas */}
            <div className="flex gap-2">
                {imagenes.map((img, i) => (
                    <button key={i} onClick={() => setImagenSeleccionada(i)} className="w-20 h-20 border rounded overflow-hidden">
                        <img src={img} className="object-cover w-full h-full" />
                    </button>
                ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{producto.nombre}</h1>
            <p className="text-2xl text-blue-700 font-bold">${Number(precioFinal).toLocaleString('es-AR')}</p>
            
            <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600">{producto.descripcion || 'Sin descripción disponible.'}</p>
            </div>

            <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center border rounded-lg">
                    <button 
                        onClick={() => setCantidad(Math.max(1, cantidad - 1))} 
                        className="p-2 px-4 hover:bg-gray-100 transition"
                        disabled={agregandoAlCarrito}
                    >
                        -
                    </button>
                    <span className="px-4 font-bold">{cantidad}</span>
                    <button 
                        onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} 
                        className="p-2 px-4 hover:bg-gray-100 transition"
                        disabled={agregandoAlCarrito || cantidad >= producto.stock}
                    >
                        +
                    </button>
                </div>
                <button 
                    onClick={handleAgregarAlCarrito}
                    className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={!tieneStock || agregandoAlCarrito || cantidad > producto.stock}
                >
                    {agregandoAlCarrito ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Agregando...
                        </>
                    ) : tieneStock ? (
                        <>
                            <ShoppingCart className="w-5 h-5" />
                            Agregar al carrito
                        </>
                    ) : (
                        'Sin Stock'
                    )}
                </button>
            </div>

            {/* Mensaje de éxito/error */}
            {mensaje && (
                <div className={`mt-4 p-3 rounded-lg ${
                    mensaje.tipo === 'success' 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                    {mensaje.texto}
                </div>
            )}

            {/* Stock disponible */}
            {tieneStock && (
                <p className="text-sm text-gray-600 mt-2">
                    Stock disponible: {producto.stock} unidades
                </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

