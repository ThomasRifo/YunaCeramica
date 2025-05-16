// resources/js/Pages/Talleres/Index.jsx

import { Head, Link } from '@inertiajs/react';

import { AspectRatio } from "@/Components/ui/aspect-ratio"
import { cn } from '@/lib/utils';
import ReviewsSection from '@/Components/ReviewsSection';
import PiecesCarousel from '@/Components/Taller/PiecesCarousel';

export default function TalleresIndex({ reviews, talleres, imagenesPiezas }) {

  console.log('IMAGENES PIEZAS:', imagenesPiezas);
  return (
    <>
    <Head title="Talleres" />
    <div className="min-h-screen">
      {/* Imagen de portada */}
      <div className="relative h-[51.5vh] w-full">
      <video autoPlay="autoplay" loop muted className="object-cover  object-[63%_1%] w-full h-full" alt="Portada talleres">
        <source src="/storage/uploads/Portada.webm" type="video/webm" />
        <source src="/storage/uploads/Portada.mp4" type="video/mp4" />
        Tu navegador no soporta el formato de video.
      </video>
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center  text-white text-center px-4">
          <h1 className="text-5xl pt-16 md:text-6xl font-bold">Workshop de Cerámica</h1>
          <p className=" mt-5 text-lg md:text-3xl max-w">
            Una experiencia única para llevarte un recuerdo para toda la vida.
          </p>
        </div>
      </div>

      
      <section className='mx-auto max-w-7xl '>
        <h2 className='text-center font-semibold text-2xl md:text-4xl pt-8 md:pt-14 md:pb-8'>Elegí tu experiencia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-16 py-8  ">
       
        {talleres?.ceramicaYCafeFuturos ? (
          <Link href="talleres-ceramica-y-cafe" className="group relative">
            <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-lg ">
              <img
                src="/storage/uploads/ceramica-y-cafe.webp" 
                alt="Cerámica y Café"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex p-10 justify-center items-center">
                <h3 className="text-white text-end text-4xl md:text-6xl font-semibold">CERÁMICA <br></br> & CAFÉ</h3>
              </div>
              {talleres?.ceramicaYCafe === 'cupo_lleno' && (
                <div className="absolute inset-0 bg-white/50 flex p-8 items-end justify-center">
                  <div className="text-center bg-black/70 rounded-xl md:p-4 p-3 md:mb-20 mb-6 w-full">
                    <span className="text-white md:text-4xl  text-3xl font-normal">COMPLETO</span>
                  </div>
                </div>
              )}
            </AspectRatio>
          </Link>
        ) : (
          <div className="group relative">
            <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src="/storage/uploads/ceramica-y-cafe.webp" 
                alt="Cerámica y Café"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/30 flex p-10 justify-center items-center">
                <h3 className="text-white text-end text-4xl md:text-6xl font-semibold">CERÁMICA <br></br> & CAFÉ</h3>
              </div>
              <div className="absolute inset-0 bg-white/50 flex p-8 items-end justify-center">
              <div className="text-center bg-black/70 rounded-xl md:p-4 p-3 md:mb-20 mb-6 w-full">
                    <span className="text-white md:text-4xl text-3xl font-normal">PROXIMAMENTE</span>
                  </div>
              </div>
            </AspectRatio>
          </div>
        )}

        {talleres?.ceramicaYGinFuturos ? (
          <Link href="/talleres-ceramica-y-gin" className="group relative">
            <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src="/storage/uploads/ceramica-y-gin.webp"
                alt="Cerámica y Gin"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-white text-end text-4xl md:text-6xl font-semibold">CERÁMICA <br></br> & GIN</h2>
              </div>
              {talleres?.ceramicaYGin === 'cupo_lleno' && (
                <div className="absolute inset-0 bg-white/50 flex p-8 items-end justify-center">
                  <div className="text-center bg-black/70 rounded-xl md:p-4 p-3 md:mb-20 mb-6 w-full">
                  <span className="text-white md:text-4xl text-3xl font-normal">COMPLETO</span>
                  </div>
                </div>
              )}
            </AspectRatio>
          </Link>
        ) : (
          <div className="group relative">
            <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src="/storage/uploads/ceramica-y-gin.webp"
                alt="Cerámica y Gin"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h2 className="text-white text-end text-4xl md:text-6xl font-semibold">CERÁMICA <br></br> & GIN</h2>
              </div>

              <div className="absolute inset-0 bg-white/50 flex p-8 items-end justify-center">
              <div className="text-center bg-black/70 rounded-xl md:p-4 p-3 md:mb-20 mb-6 w-full">
                    <span className="text-white md:text-4xl text-3xl font-normal">PROXIMAMENTE</span>
                  </div>
                </div>
             
            </AspectRatio>
          </div>
        )}
      </div>
      </section>
<section className='mx-auto max-w-7xl mt-16'>
  <PiecesCarousel images={imagenesPiezas} title="Sus piezas" />
</section>
      <section>
      <ReviewsSection reviews={reviews} />
      </section>
    </div>
    </>
  );
}
