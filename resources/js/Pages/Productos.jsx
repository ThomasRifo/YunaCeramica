import { Head } from "@inertiajs/react";

export default function Welcome() {
    return (
      <>
      <Head>
        <title>Productos</title>
        <meta name="description" content="Descubre nuestros productos de cerámica artesanal. Piezas únicas y personalizadas para tu hogar y regalo especial." />
        <meta name="keywords" content="cerámica, piezas de cerámica, cerámica artesanal, cerámica personalizada, regalo especial, hogar, decoración, tazas, platos, vasos, figuras, esculturas, cerámica Río Negro, Yuna Cerámica, Yuna Cerámica Cipolletti, Yuna Cerámica Neuquén, Yuna Cerámica Río Negro, Yuna Cerámica Talleres, Yuna Cerámica Productos" />
        
      </Head>
<div className="relative">
      {/* Imagen de portada */}
      <div className="relative">
        <img src="/storage/uploads/productos.webp" alt="Portada productos" className="w-full h-auto object-cover object-[center_80%]" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-start text-white text-center px-4">
          <h1 className="mt-8 md:mt-52 text-5xl pt-16 md:text-6xl font-bold">Yuna Cerámica</h1>
          <p className="mt-5 text-4xl md:text-4xl max-w">
            Piezas en stock próximamente...
          </p>
        </div>
      </div>
      </div>
      </>
    );
  }