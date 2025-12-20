import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function ProductosIndex({ productos, subcategorias, filtros }) {
  const [busqueda, setBusqueda] = useState(filtros?.busqueda || '');

  const handleBusqueda = (e) => {
    e.preventDefault();
    router.get('/productos', { busqueda }, {
      preserveState: true,
      preserveScroll: true,
    });
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
            <h1 className="text-4xl md:text-6xl font-bold">Nuestros Productos</h1>
            <p className="mt-2 md:mt-4 text-2xl md:text-4xl">Cada producto es unico blablabla</p>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-8 space-y-4">
            {/* Búsqueda */}
            <form onSubmit={handleBusqueda} className="flex gap-2">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Buscar
              </button>
            </form>

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
                  <Link
                    key={producto.id}
                    href={`/productos/${producto.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
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
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{producto.nombre}</h3>
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
                      {producto.stock > 0 && (
                        <p className="text-sm text-gray-600 mt-2">Stock: {producto.stock}</p>
                      )}
                    </div>
                  </Link>
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
              <div className="flex gap-2">
                {productos.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => link.url && router.get(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-4 py-2 rounded ${
                      link.active
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

