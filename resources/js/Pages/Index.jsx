import { Head, Link } from '@inertiajs/react';
import { AspectRatio } from "@/Components/ui/aspect-ratio"

export default function Index() {
  return (
    <>
      <Head title="Inicio" />
      <div className="">
        {/* Imagen de portada */}
        <div className="relative h-[80vh] w-full ">
          <img 
            src="/storage/uploads/yunaceramica.webp" 
            alt="Portada Yuna Cerámica"
            className="object-cover w-full h-full object-bottom"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center  text-white text-center px-0 justify-center">
            <h1 className="text-5xl   pt-0 md:text-8xl font-bold">Yuna</h1>
            <p className="mt-2 md:mt-2 text-2xl md:text-4xl max-w">
              Arte y diseño en cerámica
            </p>
            
            
          </div>
          
          
        </div>

       
      </div>
      <section className='mb-20 mx-auto  max-w-7xl '>
        <h2 className="text-4xl font-bold text-center py-8">Nuestras secciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-16 py-8 ">
            <Link href="/productos" className="group relative">
              <AspectRatio ratio={1.8 / 1.4} className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/storage/uploads/productos.webp"
                  alt="Productos"
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex p-10 justify-center items-center">
                  <h3 className="text-white text-end text-4xl md:text-6xl font-semibold">PRODUCTOS</h3>
                </div>
              </AspectRatio>
            </Link>

            <Link href="/talleres" className="group relative">
              <AspectRatio ratio={1.8 / 1.4} className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/storage/uploads/talleres.webp"
                  alt="Talleres"
                  className="object-cover object-[center_75%]  w-full h-full transition-transform duration-300 group-hover:scale-105 "
                />
                <div className="absolute inset-0 bg-black/30 flex p-10 justify-center items-center">
                  <h3 className="text-white text-end text-4xl md:text-6xl font-semibold">TALLERES</h3>
                </div>
              </AspectRatio>
            </Link>
          </div>
        </section>
    </>
  );
}