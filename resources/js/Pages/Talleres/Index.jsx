// resources/js/Pages/Talleres/Index.jsx

import { Head, Link } from '@inertiajs/react';

import { AspectRatio } from "@/Components/ui/aspect-ratio"
import { cn } from '@/lib/utils';
import ReviewsSection from '@/Components/ReviewsSection';
import PiecesCarousel from '@/Components/Taller/PiecesCarousel';

export default function TalleresIndex({ reviews, talleres, imagenesPiezas, subcategorias }) {
  return (
    <>
      <Head>
        <title>Talleres</title>
        <meta name="description" content="Descubre nuestros talleres de cerámica en Cipolletti. Experiencias únicas combinando cerámica con café y gin. Aprende técnicas artesanales y crea piezas únicas en un ambiente relajado y creativo." />
        <meta name="keywords" content="talleres de cerámica Cipolletti, cerámica y café, cerámica y gin, clases de cerámica, taller de cerámica artesanal, cerámica para principiantes, cerámica Río Negro" />
        
        <meta property="og:title" content="Talleres de Cerámica en Cipolletti | Yuna Cerámica" />
        <meta property="og:description" content="Experiencias únicas de cerámica combinadas con café y gin. Aprende técnicas artesanales y crea piezas únicas en Cipolletti." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Talleres de Cerámica Yuna",
            "description": "Talleres de cerámica artesanal en Cipolletti, combinando técnicas tradicionales con experiencias modernas de café y gin.",
            "provider": {
              "@type": "Organization",
              "name": "Yuna Cerámica",
              "sameAs": "https://instagram.com/yunaceramica"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock"
            },
            "location": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cipolletti",
                "addressRegion": "Río Negro",
                "addressCountry": "AR"
              }
            }
          })}
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
            <h1 className="text-5xl pt-16 md:text-6xl font-bold">Workshop de Cerámica</h1>
            <p className="mt-5 text-lg md:text-3xl max-w">
              Una experiencia creativa, una pieza única, un recuerdo para toda la vida.
            </p>
          </div>
        </section>

        {/* Talleres Section */}
        <section className="mx-auto max-w-7xl" aria-label="Tipos de talleres disponibles">
          <h2 className="text-center font-semibold text-2xl md:text-4xl pt-8 md:pt-14 md:pb-8">
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
                      <h3 className="text-white text-end text-4xl md:text-6xl font-semibold whitespace-pre-line">
                        {subcat.nombre.toUpperCase()}
                      </h3>
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
                        <h3 className="text-white text-end text-4xl md:text-6xl font-semibold whitespace-pre-line">
                          {subcat.nombre.toUpperCase()}
                        </h3>
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
        <section aria-label="Reseñas de nuestros talleres">
          <ReviewsSection reviews={reviews} />
        </section>
      </main>
    </>
  );
}
