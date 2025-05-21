import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ImageWithText from "@/Components/Taller/ImageWithText";
import PiecesCarousel from "@/Components/Taller/PiecesCarousel";
import LocationMap from "@/Components/Taller/LocationMap";
import { Head, Link } from "@inertiajs/react";
import { Calendar, Clock, MapPin, DollarSign, CheckCircle  } from "lucide-react";
import MercadoPagoButton from "@/Components/MercadoPagoButton";
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/Components/ui/dialog';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRef, useEffect, useState } from "react";
import Breadcrumbs from "@/Components/Breadcrumbs";

export default function TallerView({ taller, imagenes, pagoAprobado: pagoAprobadoProp, imagenesPiezas, slug }) {
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const mainButtonRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [showModal, setShowModal] = useState(false);
console.log(slug)
  const breadcrumbItems = [
    {
      label: 'Talleres',
      href: '/talleres'
    },{
      label: slug === 'ceramica-y-cafe' ? 'Cerámica y Café' : 'Cerámica y Gin',
      href: '#'
  }
  ];
  useEffect(() => {
    const handleScroll = () => {
      if (mainButtonRef.current) {
        const mainButtonPosition = mainButtonRef.current.getBoundingClientRect().top;
        setShowFloatingButton(mainButtonPosition > window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Detectar ?pago=success en la URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('pago') === 'success') {
        setShowModal(true);
      }
    }
  }, []);

  dayjs.extend(customParseFormat);
  const tallerEsPasado = dayjs(taller.fecha).isBefore(dayjs(), 'day');
  const tallerLleno = taller.cantInscriptos >= taller.cupoMaximo;
  const precios = (
    <div className="mt-6 space-y-2 text-gray-800">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-black" />
        <span>El valor es de <strong> ${taller.precio.toLocaleString("es-AR") } </strong>por persona abonando con <strong>transferencia</strong> </span>
          
        
</div>
    </div>
  )
  const extraInfo = (
    <div className="mt-6 space-y-2 text-gray-800">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-black" />
        <span><strong>Fecha:</strong> {dayjs(taller.fecha).format('DD-MM-YYYY')}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-black" />
        <span><strong>Horario:</strong> {dayjs(taller.hora, "HH:mm:ss").format("HH:mm")}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
        <MapPin className="md:w-5 md:h-5 min-h-5 min-w-5 text-black" />
        <a href="#ubicacion" className="flex items-center">
          <span><strong>Ubicación:</strong> <span className="text-blue-500 hover:underline">{taller.ubicacion} (Ver mapa)</span></span>
        </a>
        </div>
      </div>
    </div>
  );
  



  return (
    <>
      <Head title={taller.nombre} />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-28">
      <Breadcrumbs items={breadcrumbItems} />
        {/* Floating Button */}
        <AnimatePresence>
          {taller.idSubcategoria && showFloatingButton && (
            <motion.div
              className="fixed bottom-8 right-8 z-50"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3 }
              }}
              transition={{ duration: 0.3 }}
            >
              {tallerEsPasado ? (
                <button
                  className="inline-block bg-black text-white font-semibold py-3 px-6 rounded-lg text-xl shadow-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  Evento finalizado
                </button>
              ) : tallerLleno ? (
                <button
                  className="inline-block bg-black text-white font-semibold py-3 px-6 rounded-lg text-xl shadow-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  CUPO LLENO
                </button>
              ) : (
                <Link
                  href={`/talleres-${taller.subcategoria.url}-inscripcion`}
                  className="inline-block bg-black hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition text-xl shadow-lg hover:shadow-xl"
                >
                  ¡Quiero inscribirme!
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Título principal */}
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-center mb-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          {taller.nombre.toUpperCase() }
        </motion.h1>

        {/* Secciones de Imagen + Texto */}
        <div className="space-y-16 md:mt-24 mt-8">
          <ImageWithText
            image={`/storage/talleres/${imagenes[0]?.urlImagen}`}
            crop={{ x: imagenes[0]?.crop_x ?? 0, y: imagenes[0]?.crop_y ?? 0 }}
            zoom={imagenes[0]?.zoom ?? 1}
            aspectRatio={1.4/1.5}
            title="Nuestra Experiencia"
            description={imagenes[0]?.texto}
            extraContent={extraInfo}
          />

          <ImageWithText
            image={`/storage/talleres/${imagenes[1]?.urlImagen}`}
            crop={{ x: imagenes[1]?.crop_x ?? 0, y: imagenes[1]?.crop_y ?? 0 }}
            zoom={imagenes[1]?.zoom ?? 1}
            aspectRatio={1.4/1.5}
            title="¿Qué incluye?"
            description={imagenes[1]?.texto}
            reverse
          />

          <ImageWithText
            image={`/storage/talleres/${imagenes[2]?.urlImagen}`}
            crop={{ x: imagenes[2]?.crop_x ?? 0, y: imagenes[2]?.crop_y ?? 0 }}
            zoom={imagenes[2]?.zoom ?? 1}
            aspectRatio={1.4/1.5}
            title=""
            description={imagenes[2]?.texto}
            extraContent={precios}
          />
        </div>

        {/* Main Button */}
        <motion.div
          ref={mainButtonRef}
          className="text-center my-24"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.5,
              delay: 0.2
            }
          }}
          viewport={{ once: true, amount: 0.4 }}
        >
          {taller.idSubcategoria && (
            <motion.div
              initial={!showFloatingButton ? { 
                opacity: 0,
                scale: 0.8,
                y: 100
              } : false}
              animate={!showFloatingButton ? {
                opacity: 1,
                scale: 1,
                y: 0
              } : false}
              transition={{ duration: 0.5 }}
            >
              {tallerEsPasado ? (
                <button
                  className="inline-block w-1/2 bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg text-2xl shadow-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  Evento finalizado
                </button>
              ) : tallerLleno ? (
                <button
                  className="inline-block w-1/2 bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg text-2xl shadow-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  CUPO LLENO
                </button>
              ) : (
                <Link
                  href={`/talleres-${taller.subcategoria.url}-inscripcion`}
                  className="inline-block w-1/2 bg-black hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition text-2xl shadow-lg hover:shadow-xl"
                >
                  ¡Quiero inscribirme!
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Carrusel de piezas */}

        <PiecesCarousel images={imagenesPiezas} title="Piezas disponibles para pintar" />
        

        {/* Mapa */}
        <div id="ubicacion">
        <LocationMap  direccion={taller.ubicacion} />
        </div>
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal} >
        <DialogContent >
        <div className="  flex flex-col items-center justify-center bg-gray-100 px-4 pt-2">
            <Head title="Pago Exitoso" />

            <div className="bg-white p-8 md:p-8 rounded-xl max-w-2xl w-full text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    ¡Pago Aprobado!
                </h1>
                </div>
                <p className="text-gray-600 mb-6 text-lg text-center">
                    Tu inscripción al taller ha sido confirmada exitosamente.
                </p>
            <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 space-y-2">
              <div><strong>Taller:</strong> {taller.nombre}</div>
              <div><strong>Ubicación:</strong> {taller.ubicacion}</div>
              <div><strong>Fecha:</strong> {dayjs(taller.fecha).format('DD-MM-YYYY')} </div>
              <div><strong>Hora:</strong> {dayjs(taller.hora, "HH:mm:ss").format("HH:mm")}</div>
            </div>
            <p className="text-gray-600 mb-6">
                    Recibirás un correo electrónico con los detalles completos en breve. ¡Gracias por tu confianza!
                </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

