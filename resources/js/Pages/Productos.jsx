import { Head } from "@inertiajs/react";

export default function Welcome() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Catálogo de Productos y Kits Creativos | Yuna Cerámica",
    "description": "Explorá nuestro catálogo de piezas de cerámica artesanal y kits creativos para pintar en casa y hornear en tu horno convencional.",
    "url": "https://yunaceramica.com/productos",
    "publisher": {
      "@type": "Organization",
      "name": "Yuna Cerámica",
      "logo": "https://yunaceramica.com/storage/uploads/yunalogowhite.webp"
    }
  };

  return (
    <>
      <Head>
        <title>Productos</title>
        
        <meta 
          name="description" 
          content="Catálogo de Yuna Cerámica: piezas artesanales hechas a mano y kits creativos para pintar en casa y hornear en tu horno convencional. Envíos y retiro en Cipolletti." 
        />
        <meta 
          name="keywords" 
          content="cerámica artesanal, kits para pintar cerámica, kit creativo cerámica, pintar cerámica en casa, tazas artesanales, vajilla de cerámica, regalos originales, cerámica Cipolletti, cerámica Neuquén" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yunaceramica.com/productos" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yunaceramica.com/productos" />
        <meta property="og:title" content="Productos y Kits Creativos | Yuna Cerámica" />
        <meta property="og:description" content="Piezas únicas de cerámica artesanal y kits creativos listos para pintar en casa y hornear en tu horno." />
        <meta property="og:image" content="https://yunaceramica.com/storage/uploads/productos.webp" />
        <meta property="og:locale" content="es_AR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Productos y Kits Creativos | Yuna Cerámica" />
        <meta name="twitter:description" content="Descubrí nuestras piezas artesanales y kits para pintar cerámica en casa. Envíos en Cipolletti y alrededores." />
        <meta name="twitter:image" content="https://yunaceramica.com/storage/uploads/productos.webp" />

        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
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