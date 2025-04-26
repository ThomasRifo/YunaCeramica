// resources/js/Pages/Talleres/Index.jsx

import { Link } from '@inertiajs/react';

 
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { cn } from '@/lib/utils';

export default function TalleresIndex() {
  return (
    <div className="min-h-screen">
      {/* Imagen de portada */}
      <div className="relative h-[51.5vh] w-full">
      <video autoplay loop muted className="object-cover w-full h-full" alt="Portada talleres">
  <source src="https://lapintoramica.com/wp-content/uploads/2024/03/VIDEO-BANNER-FULL-SCREEN-WITHOUT-TEXT-2.mp4" type="video/mp4" />
  <source src="https://lapintoramica.com/wp-content/uploads/2024/03/VIDEO-BANNER-FULL-SCREEN-WITHOUT-TEXT-2.webm" type="video/webm" />
  <source src="https://lapintoramica.com/wp-content/uploads/2024/03/VIDEO-BANNER-FULL-SCREEN-WITHOUT-TEXT-2.ogg" type="video/ogg" />
  Tu navegador no soporta el formato de video.
</video>
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center  text-white text-center px-4">
          <h1 className="text-5xl pt-16 md:text-6xl font-bold">Workshop de Cerámica</h1>
          <p className=" mt-5 text-lg md:text-3xl max-w">
            Una experiencia única para llevarte un recuerdo para toda la vida.
          </p>
        </div>
      </div>

      {/* Secciones Cerámica & Café / Gin */}
      <div className='mx-auto max-w-7xl h-screen '>
        <h2 className='text-center font-semibold text-2xl md:text-4xl pt-8 md:pt-14 md:pb-8'>Elegí tu experiencia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-8  ">
        {/* Cerámica y Café */}
        <Link href="talleres-ceramica-y-cafe" className="group">
          <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-lg ">
            <img
              src="../../../../storage/imagenesFijas/IMG_0219.png" 
              alt="Cerámica y Café"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex p-10 justify-center items-center">
              <h3 className="text-white text-end text-4xl md:text-6xl font-semibold">CERÁMICA <br></br> & CAFÉ</h3>
            </div>
          </AspectRatio>
        </Link>

        {/* Cerámica y Gin */}
        <Link href="/talleres-ceramica-y-gin" className="group">
          <AspectRatio ratio={2 / 1.8} className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src="../../../../storage/imagenesFijas/IMG_0122.jpg"
              alt="Cerámica y Gin"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h2 className="text-white text-end text-4xl md:text-6xl font-semibold">CERÁMICA <br></br> & GIN</h2>
            </div>
          </AspectRatio>
        </Link>
      </div>
      </div>
    </div>
  );
}
