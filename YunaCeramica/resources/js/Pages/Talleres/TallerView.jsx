import { motion } from "framer-motion";
import ImageWithText from "@/Components/Taller/ImageWithText";
import PiecesCarousel from "@/Components/Taller/PiecesCarousel";
import LocationMap from "@/Components/Taller/LocationMap";
import { Head, Link } from "@inertiajs/react";
import { Calendar, Clock, MapPin, DollarSign  } from "lucide-react";
import MercadoPagoButton from "@/Components/MercadoPagoButton";

export default function TallerView({ taller, imagenes }) {

  console.log(taller.subcategoria.url);

  const precios = (
    <div className="mt-6 space-y-2 text-gray-800">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-black" />
        <span>El valor es de <strong> ${taller.precio } </strong>por persona abonando con <strong>transferencia</strong> </span>
          
        
</div>
    </div>
  )
  const extraInfo = (
    <div className="mt-6 space-y-2 text-gray-800">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-black" />
        <span><strong>Fecha:</strong> {taller.fecha}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-black" />
        <span><strong>Horario:</strong> {taller.hora}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-black" />
        <a href="#ubicacion"><span><strong>Ubicación:</strong> {taller.ubicacion} (Ver mapa) </span> </a>
      </div>
    </div>
  );
  

  return (
    <>
      <Head title={taller.nombre} />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-36">
        {/* Título principal */}
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          {taller.nombre.toUpperCase() }
        </motion.h1>

        {/* Secciones de Imagen + Texto */}
        <div className="space-y-16 mt-32">
          <ImageWithText
            image={`/storage/talleres/${imagenes[0]?.urlImagen}`}
            title="Nuestra Experiencia"
            description={imagenes[0]?.texto}
            extraContent={extraInfo}
          />

          <ImageWithText
            image={`/storage/talleres/${imagenes[1]?.urlImagen}`}
            title="¿Qué incluye?"
            description={imagenes[1]?.texto}
            reverse
          />

          <ImageWithText
            image={`/storage/talleres/${imagenes[2]?.urlImagen}`}
            title=""
            description={imagenes[2]?.texto}
            extraContent={precios}
          />
        </div>

        {/* Botón de inscripción */}
        <motion.div
          className="text-center my-24"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {taller.idSubcategoria && (
<Link
href={`/talleres-${taller.subcategoria.url}-inscripcion`}
  className="inline-block w-3/4 bg-rose-300 hover:bg-rose-400 text-white font-semibold py-3 px-6 rounded-lg transition text-2xl"
>
  Quiero inscribirme!

</Link>
          )}


        </motion.div>

        {/* Carrusel de piezas */}
        <PiecesCarousel images={taller.imagenesPiezas} />

        {/* Mapa */}
        <div id="ubicacion">
        <LocationMap  direccion={taller.ubicacion} />
        </div>
      </div>
    </>
  );
}
