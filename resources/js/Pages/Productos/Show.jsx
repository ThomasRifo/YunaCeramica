import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { ShoppingCart, Plus, Minus, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import Breadcrumbs from "@/Components/Breadcrumbs";


export default function ProductoShow({ producto, metodosPago }) {
  // 1. Verificación de seguridad inmediata
  if (!producto) return <div className="p-10 text-center">Cargando producto...</div>;

  const [cantidad, setCantidad] = useState(1);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [agregandoAlCarrito, setAgregandoAlCarrito] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [metodosPagoAbierto, setMetodosPagoAbierto] = useState(false);
  const [formasEnvioAbierto, setFormasEnvioAbierto] = useState(false);
  const [atributoSeleccionado, setAtributoSeleccionado] = useState('');

  const nombreTipoAtributo = producto.atributos && producto.atributos.length > 0 
  ? producto.atributos[0].tipo_nombre 
  : 'opción';

  const descripcionLimpia = (producto?.descripcion || 'Pieza de cerámica artesanal de Yuna Cerámica.')
  .replace(/<[^>]*>?/gm, '')
  .trim();
  
  // 2. Manejo de imágenes (evita errores si no hay imágenes)
  const imagenes = producto.imagenes && producto.imagenes.length > 0 
    ? producto.imagenes.map(img => `/storage/productos/${img.urlImagen}`)
    : ['/storage/uploads/placeholder.jpg'];

  const imagenDestacadaUrl = `https://yunaceramica.com${imagenes[0]}`;

  const precioFinal = producto.descuento 
    ? producto.precio * (1 - producto.descuento / 100)
    : producto.precio;

  // Asegurar que stock sea un número y manejar casos donde pueda ser null/undefined
  const stock = producto.stock !== null && producto.stock !== undefined ? Number(producto.stock) : 0;
  const tieneStock = stock > 0;


  const schemaProductData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": producto.nombre,
    "image": imagenes.map(img => `https://yunaceramica.com${img}`),
    "description": descripcionLimpia,
    "brand": {
      "@type": "Brand",
      "name": "Yuna Cerámica"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://yunaceramica.com/productos/${producto.slug}`,
      "priceCurrency": "ARS",
      "price": Number(precioFinal),
      "availability": tieneStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  const handleAgregarAlCarrito = async () => {
    if (!tieneStock || cantidad > stock) return;
    if (producto.tiene_atributos && !atributoSeleccionado) {
      setMensaje({ tipo: 'error', texto: `Por favor, selecciona tu ${nombreTipoAtributo.toLowerCase()} antes de agregar al carrito.` });
      return;
    }
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
          atributo_id: atributoSeleccionado || null,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMensaje({ tipo: 'success', texto: data.message || 'Producto agregado al carrito' });
        const nuevaCantidad = data.carrito?.cantidadTotal ?? data.carrito?.cantidadItems;
        if (typeof nuevaCantidad === 'number') {
          window.dispatchEvent(
            new CustomEvent('carrito:actualizado', {
              detail: { cantidad: nuevaCantidad },
            })
          );
        } else {
          // Si la respuesta no trajo el número directo, pedimos el count actualizado
          fetch('/carrito/count')
            .then(res => res.json())
            .then(countData => {
              window.dispatchEvent(
                new CustomEvent('carrito:actualizado', {
                  detail: { cantidad: countData.cantidad },
                })
              );
            });
        }

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

  const breadcrumbItems = [
    {
      label: 'Productos',
      href: '/productos'
    },
    {
      label: producto.nombre,
      href: '#'
    }
  ];

  return (
    <>
      <Head>
        <title>{`${producto.nombre} | Yuna Cerámica`}</title>
        
        
        <meta name="description" content={descripcionLimpia.substring(0, 160)} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://yunaceramica.com/productos/${producto.slug}`} />

        
        <meta property="og:type" content="og:product" />
        <meta property="og:url" content={`https://yunaceramica.com/productos/${producto.slug}`} />
        <meta property="og:title" content={`${producto.nombre} - $${Number(precioFinal).toLocaleString('es-AR')}`} />
        <meta property="og:description" content={descripcionLimpia.substring(0, 160)} />
        <meta property="og:image" content={imagenDestacadaUrl} />
        <meta property="og:locale" content="es_AR" />
        <meta property="product:price:amount" content={precioFinal} />
        <meta property="product:price:currency" content="ARS" />

        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${producto.nombre} | Yuna Cerámica`} />
        <meta name="twitter:description" content={descripcionLimpia.substring(0, 160)} />
        <meta name="twitter:image" content={imagenDestacadaUrl} />

        
        <script type="application/ld+json">
          {JSON.stringify(schemaProductData)}
        </script>
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 py-24 md:pt-28"> 
        <Breadcrumbs items={breadcrumbItems} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 md:mt-16">
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
                <p className="text-gray-600 whitespace-pre-line">
                  {(producto.descripcion || 'Sin descripción disponible.')
                    .replace(/<br\s*\/?>/gi, '\n')}
                </p>
            </div>

            {!!producto.tiene_atributos && (
              <div className="space-y-2 mt-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Elegí tu {nombreTipoAtributo.toLowerCase()}:
                </label>
                <select
                  value={atributoSeleccionado}
                  onChange={(e) => setAtributoSeleccionado(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition"
                >
                  <option  value="">Seleccionar</option>
                  {producto.atributos && producto.atributos.map((attr) => (
                    <option key={attr.id} value={attr.id}>
                      {attr.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                        onClick={() => setCantidad(Math.min(stock, cantidad + 1))} 
                        className="p-2 px-4 hover:bg-gray-100 transition"
                        disabled={agregandoAlCarrito || cantidad >= stock || (producto.tiene_atributos && !atributoSeleccionado)}
                    >
                        +
                    </button>
                </div>
                <button 
                    onClick={handleAgregarAlCarrito}
                    className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={!tieneStock || agregandoAlCarrito || cantidad > stock}
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

            {/* Métodos de Pago y Formas de Envío */}
            <div className="mt-8 space-y-3">
              {/* Métodos de Pago */}
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={() => setMetodosPagoAbierto(!metodosPagoAbierto)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Métodos de Pago</h2>
                  {metodosPagoAbierto ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                {metodosPagoAbierto && (
                  <div className="px-3 pb-3 space-y-1.5">
                    {metodosPago && metodosPago.map((metodo) => (
                      <div key={metodo.id} className="flex items-start gap-2 p-2 bg-white rounded border border-gray-200">
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-900">{metodo.nombre}</div>
                          {metodo.id === 2 && (
                            <div className="text-xs text-orange-600 font-medium mt-0.5">
                               Recargo del 10%.
                            </div>
                          )}
                          {metodo.descripcion && (
                            <div className="text-xs text-gray-600 mt-0.5">{metodo.descripcion}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formas de Envío */}
              <div className="bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={() => setFormasEnvioAbierto(!formasEnvioAbierto)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Formas de Envío</h2>
                  {formasEnvioAbierto ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                {formasEnvioAbierto && (
                  <div className="px-3 pb-3 space-y-1.5">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <div className="text-xs font-medium text-gray-900">Envío a domicilio</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        $7.000 - Solo en Cipolletti, Neuquén y Fernández Oro
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <div className="text-xs font-medium text-gray-900">Retiro en local</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        Barrio San Lorenzo - Cipolletti (sin costo adicional)
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Los datos precisos se enviarán después de la compra
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

