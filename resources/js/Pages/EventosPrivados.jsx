import { Head } from "@inertiajs/react";
// import InstantPhoto from "@/Components/InstantPhoto";

export default function EventosPrivados() {
  return (
    <>
      <Head>
        <title>Eventos Privados - Yuna Cerámica</title>
        <meta
          name="description"
          content="Descubre nuestros productos de cerámica artesanal. Piezas únicas y personalizadas para tu hogar y regalo especial."
        />
      </Head>

      {/* Hero anterior comentado para conservar el trabajo pero no mostrarlo */}
      {/*
      <div className="bg-gray-50 overflow-x-hidden">
        <div className="w-screen lg:min-h-[60dvh]  2xl:min-h-[60dvh] h-auto py-16 lg:py-20 xl:py-16 2xl:py-24 overflow-visible relative sm:min-h-[70dvh] sm:pt-24 pt-24 bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black before:opacity-60 before:z-0" style={{backgroundImage: 'url(/storage/uploads/yunaceramica.webp)'}}>
          <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-12">
              <div className="w-full md:w-[58%] lg:w-[55%] xl:w-[60%] 2xl:w-3/5 flex flex-col justify-center text-white text-center md:text-left lg:pr-12 md:pr-14">
                <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold mb-4">
                  Yuna en tu evento
                </h1>
                <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold mb-6">
                  Arte y pintura en bizcocho
                </h2>
                <p className="text-lg md:text-xl leading-relaxed">
                  Llevamos la creatividad a tu festejo. Una propuesta diferente donde cada invitado interviene su propia pieza de cerámica.
                </p>
              </div>
              <div className="w-full md:w-[80%] lg:w-[45%] relative md:h-[400px] pt-48 mx-auto md:mx-0 flex justify-center md:block pr-10">
                <InstantPhoto
                  src="/storage/uploads/eventosprivados1.jpg"
                  alt="Evento cerámica 1"
                  rotation={-10}
                  zIndex={0}
                  className="bottom-[-10px] md:bottom-[-100px] lg:bottom-0 left-[calc(50%-150px)]  lg:left-[-06px]"
                />
                <InstantPhoto
                  src="/storage/uploads/eventosprivados2.jpg"
                  alt="Evento cerámica 2"
                  rotation={8}
                  zIndex={10}
                  className="bottom-[+10px] md:bottom-[-80px] lg:bottom-[+30px]  left-[calc(50%-20px)] "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16"></div>
      */}

      {/* Versión actual: PROXIMAMENTE centrado y grande, empujando el footer abajo */}
      <div className=" min-h-[80vh] flex items-center justify-center bg-white">
        <p className="text-4xl md:text-6xl font-amatic tracking-widest">
          PROXIMAMENTE..
        </p>
      </div>
    </>
  );
}
