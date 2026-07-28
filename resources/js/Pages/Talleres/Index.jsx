// resources/js/Pages/Talleres/Index.jsx
import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

import { AspectRatio } from "@/Components/ui/aspect-ratio"
import { cn } from '@/lib/utils';
import ReviewsSection from '@/Components/ReviewsSection';
import PiecesCarousel from '@/Components/Taller/PiecesCarousel';

export default function TalleresIndex({ reviews, talleres, imagenesPiezas, subcategorias }) {
  const { toast } = useToast();
  const { props } = usePage();
  const success = props?.flash?.success;

  useEffect(() => {
    if (typeof success === 'string' && success.length) {
      toast({ title: '¡Gracias!', description: success, variant: 'success' });
    }
  }, [success]);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Talleres y Experiencias de Cerámica | Yuna Cerámica",
    "description": "Explorá nuestros talleres de cerámica artesanal en Cipolletti y Neuquén. Clases para principiantes, cerámica con café, gin y más.",
    "url": "https://yunaceramica.com/talleres",
    "publisher": {
      "@type": "Organization",
      "name": "Yuna Cerámica",
      "logo": "https://yunaceramica.com/storage/uploads/yunalogowhite.webp"
    }
  };

  return (
    <>
     <Head>
        <title>Talleres</title>

        <meta 
          name="description" 
          content="Sumate a nuestros talleres de cerámica en Cipolletti y Neuquén. Clases para todos los niveles, no necesitas experiencia previa. Experiencias únicas con café, gin o cerveza. ¡Creá tus propias piezas!" 
        />
        <meta 
          name="keywords" 
          content="talleres de cerámica Cipolletti, talleres de cerámica Neuquén, cerámica y café, cerámica y gin, clases de cerámica, taller de cerámica artesanal, cerámica para principiantes, aprender cerámica Río Negro, Taller de cerámica." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yunaceramica.com/talleres" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yunaceramica.com/talleres" />
        <meta property="og:title" content="Talleres y Experiencias de Cerámica | Yuna Cerámica" />
        <meta property="og:description" content="Aprende técnicas artesanales y crea piezas únicas. Clases regulares y jornadas especiales combinadas con café o gin en Cipolletti." />
        <meta property="og:image" content="https://yunaceramica.com/storage/uploads/poster.webp" />
        <meta property="og:locale" content="es_AR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Talleres de Cerámica | Yuna Cerámica" />
        <meta name="twitter:description" content="Experiencias únicas creando cerámica con tus propias manos en Cipolletti y Neuquén." />
        <meta name="twitter:image" content="https://yunaceramica.com/storage/uploads/poster.webp" />
        
        
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[65.5vh] w-full" aria-label="Portada de talleres">
          <video 
            autoPlay="autoplay" 
            loop 
            muted 
            playsInline
            poster="/storage/uploads/poster.webp" 
            className="object-cover object-[63%_1%] w-full h-full" 
            alt="Video de portada de talleres de cerámica"
          >
            <source src="/storage/uploads/Portada.webm" type="video/webm" />
            <source src="/storage/uploads/Portada.mp4" type="video/mp4" />
            Tu navegador no soporta el formato de video.
          </video>
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-6xl pt-16 md:text-7xl font-bold">Experiencias de Cerámica</h1>
            <p className="mt-5 text-lg md:text-3xl max-w">
              Un encuentro creativo, una pieza única, un recuerdo para toda la vida.
            </p>
          </div>
        </section>

        {/* Talleres Section */}
        <section className="mx-auto max-w-7xl" aria-label="Tipos de talleres disponibles">
          <h2 className="text-center font-semibold text-4xl md:text-5xl pt-8 md:pt-14 md:pb-8">
            Elegí tu experiencia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-16 py-8">
            {subcategorias.map((subcat) => {
              const tieneFuturos = talleres?.[subcat.slug + 'Futuros'];
              const estado = talleres?.[subcat.slug];
              return tieneFuturos ? (
                <Link key={subcat.slug} href={subcat.link} className="group relative" aria-label={subcat.nombre}>
                  <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={subcat.imagen}
                      alt={`Taller de ${subcat.nombre} - Aprende cerámica en Yuna`}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex p-10 justify-center items-center">
                      <p className="text-white text-end text-4xl md:text-6xl font-semibold whitespace-pre-line">
                        {subcat.nombre.toUpperCase()}
                      </p>
                    </div>
                    {estado === 'cupo_lleno' && (
                      <div className="absolute inset-0 bg-white/50 flex p-8 items-end justify-center">
                        <div className="text-center bg-black/70 rounded-xl md:p-4 p-3 md:mb-20 mb-6 w-full">
                          <span className="text-white md:text-4xl text-3xl font-normal">COMPLETO</span>
                        </div>
                      </div>
                    )}
                  </AspectRatio>
                </Link>
              ) : (
                <div key={subcat.slug} className="group relative" aria-label={`Taller de ${subcat.nombre} - Próximamente`}>
                  <Link href={subcat.link} className="group relative" aria-label={subcat.nombre}>
                    <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={subcat.imagen}
                        alt={`Taller de ${subcat.nombre} - Próximamente`}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex p-10 justify-center items-center">
                        <p className="text-white text-end text-4xl md:text-6xl font-semibold whitespace-pre-line">
                          {subcat.nombre.toUpperCase()}
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-white/50 flex p-8 items-end justify-center">
                        <div className="text-center bg-black/70 rounded-xl md:p-4 p-3 md:mb-20 mb-6 w-full">
                          <span className="text-white md:text-4xl text-3xl font-normal">PRÓXIMAMENTE</span>
                        </div>
                      </div>
                    </AspectRatio>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Galería de Piezas */}
        <section className="mx-auto max-w-7xl mt-16" aria-label="Galería de piezas creadas en nuestros talleres">
          <PiecesCarousel images={imagenesPiezas} title="Sus piezas" loading="lazy" />
        </section>

        {/* Reseñas */}
        <section className="text-4xl md:text-5xl" aria-label="Reseñas de nuestros talleres">
          <ReviewsSection reviews={reviews} />
        </section>
      </main>
    </>
  );
}
