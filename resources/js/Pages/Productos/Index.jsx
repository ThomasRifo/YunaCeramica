import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

export default function ProductosIndex({ productos, subcategorias, filtros }) {
  const [busqueda, setBusqueda] = useState(filtros?.busqueda || '');
  const timeoutRef = useRef(null);

  // Búsqueda dinámica con debounce
  useEffect(() => {
    // Solo ejecutar si la búsqueda realmente cambió (no en el mount inicial si ya hay filtros)
    const busquedaActual = busqueda.trim();
    const busquedaAnterior = filtros?.busqueda || '';
    
    // Si la búsqueda no cambió, no hacer nada
    if (busquedaActual === busquedaAnterior) {
      return;
    }

    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear nuevo timeout para ejecutar la búsqueda después de 500ms sin escribir
    timeoutRef.current = setTimeout(() => {
      const params = {};
      
      // Preservar filtro de subcategoría si existe
      if (filtros?.subcategoria) {
        params.subcategoria = filtros.subcategoria;
      }
      
      // Agregar búsqueda si hay texto
      if (busquedaActual) {
        params.busqueda = busquedaActual;
      }
      
      // Resetear a página 1 cuando cambia la búsqueda
      // (no preservar page cuando hay cambio de búsqueda)
      
      router.get('/productos', params, {
        preserveState: false,
        preserveScroll: false,
        replace: true,
      });
    }, 500); // Esperar 500ms después de que el usuario deje de escribir

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [busqueda]); // Se ejecuta cada vez que cambia busqueda

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const handleFiltro = (tipo, valor) => {
    const params = { ...filtros };
    if (valor) {
      params[tipo] = valor;
    } else {
      delete params[tipo];
    }
    router.get('/productos', params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head>
        <title>Productos - Yuna Cerámica</title>
        <meta name="description" content="Descubre nuestros productos de cerámica artesanal. Piezas únicas y personalizadas para tu hogar y regalo especial." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[50vh] w-full">
          <img 
            src="/storage/uploads/productos.webp" 
            alt="Portada productos" 
            className="object-cover w-full h-full object-[center_50%]" 
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="mt-16 text-6xl md:text-7xl font-bold">Nuestros Productos</h1>
            <p className="mt-2 text-lg md:text-3xl">Arte, barro y pincel. Explorá nuestra colección de piezas únicas diseñadas para acompañar tus rituales diarios</p>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-8 space-y-4">
            {/* Búsqueda */}
            <div className="flex gap-2">
              <input
                type="text"
                value={busqueda}
                onChange={handleBusquedaChange}
                placeholder="Buscar productos..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtros por Subcategoría */}
            {subcategorias && subcategorias.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFiltro('subcategoria', null)}
                  className={`px-4 py-2 rounded-lg ${
                    !filtros?.subcategoria 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todas
                </button>
                {subcategorias.map((subcategoria) => (
                  <button
                    key={subcategoria.id}
                    onClick={() => handleFiltro('subcategoria', subcategoria.id)}
                    className={`px-4 py-2 rounded-lg ${
                      filtros?.subcategoria == subcategoria.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {subcategoria.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid de Productos */}
          {productos && productos.data && productos.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productos.data.map((producto) => {
                const imagenPrincipal = producto.imagenes && producto.imagenes.length > 0 
                  ? `/storage/productos/${producto.imagenes[0].urlImagen}`
                  : '/storage/uploads/placeholder.jpg';
                
                const precioFinal = producto.descuento 
                  ? producto.precio * (1 - producto.descuento / 100)
                  : producto.precio;

                return (
                  <div
                    key={producto.id}
                    onClick={() => router.visit(`/productos/${producto.slug}`, { preserveState: false, preserveScroll: false })}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={imagenPrincipal}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                      />
                      {producto.descuento && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                          -{producto.descuento}%
                        </div>
                      )}
                      {producto.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">SIN STOCK</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-2xl mb-2 line-clamp-2">{producto.nombre}</h3>
                      <div className="flex items-center gap-2">
                        {producto.descuento ? (
                          <>
                            <span className="text-gray-400 line-through">${producto.precio.toLocaleString()}</span>
                            <span className="text-xl font-bold text-blue-600">
                              ${precioFinal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-blue-600">
                            ${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron productos.</p>
            </div>
          )}

          {/* Paginación */}
          {productos && productos.links && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2 items-center">
                {productos.links.map((link, index) => {
                  // Procesar el label para mostrar texto legible
                  let label = link.label;
                  if (label === 'pagination.previous' || label === '&laquo; Previous') {
                    label = '← Anterior';
                  } else if (label === 'pagination.next' || label === 'Next &raquo;') {
                    label = 'Siguiente →';
                  } else if (label.includes('&laquo;')) {
                    label = label.replace('&laquo;', '←');
                  } else if (label.includes('&raquo;')) {
                    label = label.replace('&raquo;', '→');
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => link.url && router.get(link.url)}
                      className={`px-4 py-2 rounded border ${
                        link.active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                      } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

